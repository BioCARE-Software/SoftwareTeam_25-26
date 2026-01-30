#include <cstdint>
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <string>
#include <array>

// nlohmann/json (single header). Install via package manager or drop json.hpp in include path.
#include "nlohmann/json.hpp"
using json = nlohmann::json;

enum class Cond : uint8_t { GT = 0, LT = 1, EQ = 2, UNKNOWN = 3 };

struct GestureBits {
  uint8_t fingers5 = 0; // bit0=finger1 ... bit4=finger5
  Cond cond = Cond::UNKNOWN;
};

struct PresetCompact {
  std::array<GestureBits, 3> gestures{};
  uint8_t preset_id_hash = 0;
  uint8_t version = 1;
};

static Cond parse_condition(const std::string& s) {
  if (s == "Fa>Fb") return Cond::GT;
  if (s == "Fa<Fb") return Cond::LT;
  if (s == "Fa=Fb") return Cond::EQ;
  return Cond::UNKNOWN;
}

static std::string cond_to_string(Cond c) {
  switch (c) {
    case Cond::GT: return "Fa>Fb";
    case Cond::LT: return "Fa<Fb";
    case Cond::EQ: return "Fa=Fb";
    default: return "UNKNOWN";
  }
}

static uint8_t fingers_to_5bits(const json& fingers_obj) {
  auto get01 = [&](const char* key) -> uint8_t {
    if (!fingers_obj.contains(key)) throw std::runtime_error(std::string("Missing ") + key);
    int v = fingers_obj.at(key).get<int>();
    if (v != 0 && v != 1) throw std::runtime_error(std::string("Finger not 0/1: ") + key);
    return static_cast<uint8_t>(v);
  };

  uint8_t b0 = get01("finger1");
  uint8_t b1 = get01("finger2");
  uint8_t b2 = get01("finger3");
  uint8_t b3 = get01("finger4");
  uint8_t b4 = get01("finger5");

  return static_cast<uint8_t>((b0 << 0) | (b1 << 1) | (b2 << 2) | (b3 << 3) | (b4 << 4));
}

// Simple FNV-1a 32-bit then truncate to 8 bits
static uint8_t hash8_preset_id(const std::string& s) {
  uint32_t h = 2166136261u;
  for (unsigned char c : s) {
    h ^= c;
    h *= 16777619u;
  }
  return static_cast<uint8_t>(h & 0xFFu);
}

static PresetCompact read_and_compact(const std::string& path) {
  std::ifstream f(path);
  if (!f) throw std::runtime_error("Failed to open: " + path);

  json j;
  f >> j;

  if (!j.contains("preset_id")) throw std::runtime_error("Missing preset_id");
  if (!j.contains("gestures")) throw std::runtime_error("Missing gestures");

  const std::string preset_id = j.at("preset_id").get<std::string>();
  const auto& gestures = j.at("gestures");
  if (!gestures.is_array() || gestures.size() != 3) {
    throw std::runtime_error("Expected gestures array of size 3");
  }

  PresetCompact out;
  out.preset_id_hash = hash8_preset_id(preset_id);
  out.version = 1;

  for (size_t i = 0; i < 3; i++) {
    const auto& g = gestures.at(i);
    if (!g.contains("condition")) throw std::runtime_error("Gesture missing condition");
    if (!g.contains("fingers")) throw std::runtime_error("Gesture missing fingers");

    out.gestures[i].cond = parse_condition(g.at("condition").get<std::string>());
    out.gestures[i].fingers5 = fingers_to_5bits(g.at("fingers"));
  }

  return out;
}

// Packs into 32-bit using the layout described above
static uint32_t encode32(const PresetCompact& p) {
  auto cond2 = [](Cond c) -> uint32_t {
    return static_cast<uint32_t>(static_cast<uint8_t>(c) & 0x3u);
  };

  uint32_t msg = 0;

  // gesture 0 at bits 0..6
  msg |= (static_cast<uint32_t>(p.gestures[0].fingers5) & 0x1Fu) << 0;
  msg |= (cond2(p.gestures[0].cond)) << 5;

  // gesture 1 at bits 7..13
  msg |= (static_cast<uint32_t>(p.gestures[1].fingers5) & 0x1Fu) << 7;
  msg |= (cond2(p.gestures[1].cond)) << 12;

  // gesture 2 at bits 14..20
  msg |= (static_cast<uint32_t>(p.gestures[2].fingers5) & 0x1Fu) << 14;
  msg |= (cond2(p.gestures[2].cond)) << 19;

  // preset hash at bits 21..28
  msg |= (static_cast<uint32_t>(p.preset_id_hash) & 0xFFu) << 21;

  // version at bits 29..31
  msg |= (static_cast<uint32_t>(p.version) & 0x7u) << 29;

  return msg;
}

static PresetCompact decode32(uint32_t msg) {
  PresetCompact p{};
  p.version = static_cast<uint8_t>((msg >> 29) & 0x7u);
  p.preset_id_hash = static_cast<uint8_t>((msg >> 21) & 0xFFu);

  auto read_gesture = [&](int idx, int baseBit) {
    uint8_t fingers = static_cast<uint8_t>((msg >> baseBit) & 0x1Fu);
    uint8_t c2 = static_cast<uint8_t>((msg >> (baseBit + 5)) & 0x3u);
    p.gestures[idx].fingers5 = fingers;
    p.gestures[idx].cond = static_cast<Cond>(c2);
  };

  read_gesture(0, 0);
  read_gesture(1, 7);
  read_gesture(2, 14);

  return p;
}

// Optional: a 64-bit wrapper that just stores the 32-bit payload + a 16-bit CRC-ish
static uint64_t encode64_with_check(uint32_t payload32) {
  // super light “check”: sum of bytes (not cryptographic)
  uint16_t sum = 0;
  sum += (payload32 >> 0) & 0xFF;
  sum += (payload32 >> 8) & 0xFF;
  sum += (payload32 >> 16) & 0xFF;
  sum += (payload32 >> 24) & 0xFF;

  uint64_t msg64 = 0;
  msg64 |= static_cast<uint64_t>(payload32);
  msg64 |= (static_cast<uint64_t>(sum) & 0xFFFFull) << 32;
  // top 16 bits unused for now
  return msg64;
}

static bool decode64_with_check(uint64_t msg64, uint32_t& payload32_out) {
  uint32_t payload32 = static_cast<uint32_t>(msg64 & 0xFFFFFFFFull);
  uint16_t sum = static_cast<uint16_t>((msg64 >> 32) & 0xFFFFull);

  uint16_t calc = 0;
  calc += (payload32 >> 0) & 0xFF;
  calc += (payload32 >> 8) & 0xFF;
  calc += (payload32 >> 16) & 0xFF;
  calc += (payload32 >> 24) & 0xFF;

  if (calc != sum) return false;
  payload32_out = payload32;
  return true;
}

static void print_preset(const PresetCompact& p) {
  std::cout << "version=" << int(p.version)
            << " preset_id_hash=0x" << std::hex << int(p.preset_id_hash) << std::dec << "\n";
  for (int i = 0; i < 3; i++) {
    auto f = p.gestures[i].fingers5;
    std::cout << "gesture[" << i << "] cond=" << cond_to_string(p.gestures[i].cond) << " fingers="
              << int((f >> 0) & 1) << int((f >> 1) & 1) << int((f >> 2) & 1)
              << int((f >> 3) & 1) << int((f >> 4) & 1) << "\n";
  }
}

int main(int argc, char** argv) {
  try {
    std::string path = (argc >= 2) ? argv[1] : "3_gesture_single_preset.json";

    // 1) read JSON -> compact struct
    PresetCompact preset = read_and_compact(path);

    // 2) encode to 32-bit
    uint32_t packed32 = encode32(preset);
    std::cout << "Packed32 = 0x" << std::hex << packed32 << std::dec << "\n";

    // 3) “send” as 64-bit with a quick check (optional)
    uint64_t packed64 = encode64_with_check(packed32);
    std::cout << "Packed64 = 0x" << std::hex << packed64 << std::dec << "\n";

    // 4) decode back
    uint32_t recv32 = 0;
    if (!decode64_with_check(packed64, recv32)) {
      throw std::runtime_error("64-bit check failed (corrupted message?)");
    }
    PresetCompact decoded = decode32(recv32);

    std::cout << "\nDecoded:\n";
    print_preset(decoded);
  } catch (const std::exception& e) {
    std::cerr << "Error: " << e.what() << "\n";
    return 1;
  }
  return 0;
}

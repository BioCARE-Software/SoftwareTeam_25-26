#pragma once

#include <Arduino.h>
#include "config.h"

/*
  Rising-edge burst detector + train counter.

  When a burst train ends (no new burst within BURST_WINDOW_MS),
  commit() returns the burst count clamped to 1..MAX_BURSTS (0 if none).
*/

class BurstDetector {
public:
  void begin() {
    for (uint8_t i = 0; i < SMOOTH_N; i++) {
      _buf[i] = 0;
    }
    _idx = 0;
    _sum = 0;
    _baseline = 0;
    _smooth = 0;
    _env = 0;
    _above = false;
    _count = 0;
    _lastBurstMs = 0;
  }

  void setBaseline(int16_t baseline) { _baseline = baseline; }
  int16_t baseline() const { return _baseline; }
  int16_t envelope() const { return _env; }
  int16_t smoothed() const { return _smooth; }
  uint8_t pendingCount() const { return _count; }

  void applyCalibration(int16_t meanRest) {
    setBaseline(meanRest);
    g_thresh = 2500;
    _count = 0;
    _above = false;
  }

  // Feed one sample. Returns true if a new burst edge was accepted.
  bool update(int16_t raw, uint32_t nowMs) {
    _sum -= _buf[_idx];
    _buf[_idx] = raw;
    _sum += raw;
    _idx = (_idx + 1) % SMOOTH_N;
    _smooth = (int16_t)(_sum / SMOOTH_N);
    _env = (_smooth > _baseline) ? (int16_t)(_smooth - _baseline) : 0;

    bool newBurst = false;
    if (!_above && _env > (g_thresh + HYSTERESIS)) {
      _above = true;
      newBurst = acceptBurst(nowMs);
    } else if (_above && _env < (g_thresh - HYSTERESIS)) {
      _above = false;
    }
    return newBurst;
  }

  // If train finished, returns committed burst count (1..MAX); else 0.
  uint8_t pollCommit(uint32_t nowMs) {
    if (_count == 0) {
      return 0;
    }
    if ((nowMs - _lastBurstMs) <= BURST_WINDOW_MS) {
      return 0;
    }
    uint8_t n = _count;
    if (n > MAX_BURSTS) {
      n = MAX_BURSTS;
    }
    _count = 0;
    return n;
  }

private:
  bool acceptBurst(uint32_t nowMs) {
    if (_count > 0 && (nowMs - _lastBurstMs) < REFRACTORY_MS) {
      return false;
    }
    if (_count == 0 || (nowMs - _lastBurstMs) <= BURST_WINDOW_MS) {
      if (_count < 255) {
        _count++;
      }
    } else {
      _count = 1;
    }
    _lastBurstMs = nowMs;
    return true;
  }

  int16_t _buf[SMOOTH_N];
  uint8_t _idx;
  int32_t _sum;
  int16_t _baseline;
  int16_t _smooth;
  int16_t _env;
  bool _above;
  uint8_t _count;
  uint32_t _lastBurstMs;
};

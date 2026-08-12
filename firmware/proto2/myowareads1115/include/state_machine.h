#pragma once

#include <Arduino.h>
#include "config.h"

/*
  Holds the active BioCARE control state.

  Burst count N commits STATE_N and keeps it until a new train commits
  a different state (or reset to IDLE).
*/

class StateMachine {
public:
  void begin() { _state = STATE_IDLE; }

  StateId state() const { return _state; }

  static const char *name(StateId s) {
    switch (s) {
      case STATE_1: return "STATE_1";
      case STATE_2: return "STATE_2";
      case STATE_3: return "STATE_3";
      case STATE_4: return "STATE_4";
      default:      return "STATE_IDLE";
    }
  }

  // Map burst count -> held state. Returns true if state changed.
  bool commitBursts(uint8_t bursts) {
    StateId next = STATE_IDLE;
    switch (bursts) {
      case 1: next = STATE_1; break;
      case 2: next = STATE_2; break;
      case 3: next = STATE_3; break;
      case 4: next = STATE_4; break;
      default: return false;
    }
    if (next == _state) {
      return false;
    }
    _state = next;
    return true;
  }

  void reset() { _state = STATE_IDLE; }

private:
  StateId _state;
};

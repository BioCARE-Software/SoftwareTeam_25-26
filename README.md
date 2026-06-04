# BioCARE Software Team 2025-2026

Firmware, app, hardware references, tools, and documentation for BioCARE's prosthetic arm project.

The goal of this repository is to keep active work easy to find:

- `firmware/` contains embedded code for prototypes, signal processing, and sensor work.
- `app/` contains the mobile application.
- `hardware/` contains electronics and mechanical design files.
- `docs/` contains onboarding, setup, and architecture documentation.
- `protocols/` documents communication contracts such as BLE and UART.
- `tools/` contains reusable scripts for data collection, calibration, flashing, and plotting.
- `experiments/` contains prototypes and trial work that should not be treated as production code.
- `archive/` is for intentionally retained old snapshots.

## Current Layout

```text
.
  app/
    mobile/
  docs/
    architecture/
    onboarding/
    setup/
    decisions/
  firmware/
    proto1/
    proto2/
    force-sensors/
    lowpass-filter/
  hardware/
    electronics/
    mechanical/
  protocols/
  tools/
  experiments/
  archive/
```

## Getting Started

Start with the subsystem you are working on:

- Firmware: see `firmware/README.md`
- Mobile app: see `app/mobile/README.md`
- Hardware files: see `hardware/README.md`
- General onboarding: see `docs/onboarding/`

## Repository Rules

- Do not commit dependency folders such as `node_modules/`.
- Do not commit generated local state such as `.expo/`, `.DS_Store`, KiCad lock files, or KiCad backup archives.
- Keep active source files out of `experiments/` once they become part of the real system.
- Add a short README when creating a new major folder.

## Known Follow-Ups

- Restore a correct `app/mobile/package.json` and lockfile for the Expo app.
- Add missing app assets referenced by `app/mobile/app.json`, or update the config.
- Document BLE and UART message formats under `protocols/`.
- Replace placeholder experiment files with short notes explaining whether to keep or delete them.

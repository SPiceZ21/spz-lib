<div align="center">

<img src="https://github.com/SPiceZ21/spz-core-media-kit/raw/main/Banner/Banner%232.png" alt="SPiceZ-Core Banner" width="100%"/>

<br/>

# spz-lib
> Shared utility library · `v1.3.0`

## Scripts

### Shared

| Side   | File                      | Purpose                                       |
| ------ | ------------------------- | --------------------------------------------- |
| Shared | `init.lua`                | Library bootstrap and export registration     |
| Shared | `config.lua`              | Library-level configuration                   |
| Shared | `shared/main.lua`         | Core shared utilities entry point             |
| Shared | `shared/callbacks.lua`    | Shared callback registration helpers          |
| Shared | `shared/notify.lua`       | Shared notification dispatch                  |
| Shared | `shared/timer.lua`        | Timer and interval utilities                  |
| Shared | `shared/logger.lua`       | Structured logging helpers                    |
| Shared | `shared/math.lua`         | Extended math utilities                       |
| Shared | `shared/table.lua`        | Table manipulation helpers                    |
| Shared | `shared/string.lua`       | String manipulation helpers                   |

### Client

| Side   | File                      | Purpose                                        |
| ------ | ------------------------- | ---------------------------------------------- |
| Client | `client/ui/notify.lua`    | On-screen notification rendering               |
| Client | `textui.lua`              | Text UI prompt display                         |
| Client | `progress.lua`            | Progress bar display                           |
| Client | `alert.lua`               | Alert dialog display                           |
| Client | `dialog.lua`              | Input dialog display                           |
| Client | `menu.lua`                | Context menu display                           |
| Client | `context.lua`             | Context action menu                            |
| Client | `radial.lua`              | Radial menu display                            |
| Client | `skillcheck.lua`          | Skill check mini-game display                  |
| Client | `client/callbacks.lua`    | Client-side callback handlers                  |

## CI
Built and released via `.github/workflows/release.yml` on push to `main`.

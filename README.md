
# Uavcan nodes

This repository has a description of existing [UAVCAN v0](https://legacy.uavcan.org/) nodes and their binaries files.

Last binaries files you can find in the [Releases section](https://github.com/InnopolisAero/inno_uavcan_node_binaries/releases).


## Existing UAVCAN devices

Following devices are already well tested and are being used in real application multiple times:

| № | Uavcan node name                                  | Node default ID   |
| - | ------------------------------------------------- |:-----------------:|
| 1 | [programmer-sniffer](doc/programmer_sniffer/README.md)| -             |
| 2 | [uavcan-pwm](doc/can_pwm/README.md)               | 50-69             |
| 3 | [airspeed](doc/airspeed/README.md)                | 74                |
| 4 | [rangefinder](doc/rangefinder/README.md)          | 73                |

Still have some issues on not tested enough yet:
| № | Uavcan node name                                  | Node default ID   |
| - | ------------------------------------------------- |:-----------------:|
| 5 | [gps_mag_baro](doc/gps_mag_baro/README.md)        | 71                |
| 6 | [wifi node](doc/wifi_bridge/README.md)            | 90                |
| 7 | [ui_leds](doc/ui_leds/README.md)                  | 92                |
| 8 | [internal_combustion_engine](doc/ice/README.md)   | 70                |

These nodes in development process yet, but they will go to the testing on real application soon:

| № | Uavcan node name                                  | Node default ID   |
| - | ------------------------------------------------- |:-----------------:|
| 9 | [charger](doc/charger/README.md)                  | 80                |
| 10| [pmu_cover](doc/pmu_cover/README.md)              | 72                |
| 11| [fuel_tank](doc/fuel_tank/README.md)              | 75                |
| 12| inclinometer                                      | 80                |

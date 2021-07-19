
# Uavcan nodes

This repository has description fo existing UAVCAN nodes and their binaries files.

Last release you can find in [Releases section](https://github.com/InnopolisAero/inno_uavcan_node_binaries/releases).

Uavcan nodes based on [UAVCAN v0 protocol](https://legacy.uavcan.org/).

## Existing UAVCAN devices

At this time the list of well tested uavcan devices are:

| № | Uavcan node name                                  | Node default ID   |
| - | ------------------------------------------------- |:-----------------:|
| 1 | [programmer-sniffer](doc/programmer_sniffer/README.md)| -             |
| 2 | [can-pwm-servos](doc/can_pwm/README.md)           | 50-69             |
| 3 | [can-pwm-esc](doc/can_pwm/README.md)              | 50-69             |
| 4 | [airspeed](doc/airspeed/README.md)                | 74                |
| 5 | [rangefinder](doc/rangefinder/README.md)          | 73                |
| 6 | [can_uart_bridge](doc/wifi_bridge/README.md)      | -                 |
| 7 | [internal_combustion_engine](doc/ice/README.md)   | 70                |

Several nodes in development process now:

| № | Uavcan node name                                  | Node default ID   |
| - | ------------------------------------------------- |:-----------------:|
| 8 | [charger](doc/charger/README.md)                  | 80                |
| 9 | inclinometer                                      | 80                |
| 10| [fuel_tank](doc/fuel_tank/README.md)              | 75                |
| 11| [pmu_cover](doc/pmu_cover/README.md)              | 72                |
| 12| [gps_mag_baro](doc/gps_mag_baro/README.md)        | 71                |


# Uavcan nodes

This repository has description fo existing UAVCAN nodes and their binaries files.

Last release you can find in [Releases section](https://github.com/InnopolisAero/inno_uavcan_node_binaries/releases).

Uavcan nodes based on [UAVCAN v0 protocol](https://legacy.uavcan.org/).

## Existing UAVCAN devices

At this time the list of well tested uavcan devices are:

| № | Uavcan node name                            | Node default ID | Version    | Date         | Hash    |
| - | ------------------------------------------- |:---------------:| ---------- | ------------ | ------- |
| 1 | [programmer-sniffer](doc/programmer_sniffer/README.md)| -     | v0.3       |              |         |
| 2 | [can-pwm-servos](doc/can_pwm/README.md)     | 50-69           | v0.3       | Mar 30, 2021 | d4d9849 |
| 3 | [can-pwm-esc](doc/can_pwm/README.md)        | 50-69           | v0.3       | May 31, 2021 | 0b55576 |
| 4 | [airspeed](doc/airspeed/README.md)          | 74              | v0.3       | Apr 1, 2021  | 5eb5d1c |
| 5 | [rangefinder](doc/rangefinder/README.md)    | 73              | v0.1       | Aug 5, 2020  | 0fe6caf |
| 6 | [wifi_bridge](doc/wifi_bridge/README.md)    | -               | v0.1       | Nov 19, 2020 | c87fb41 |

Several nodes in development process now:

| № | Uavcan node name                            | Node default ID | Version    | Date         | Hash    |
| - | ------------------------------------------- |:---------------:| ---------- | ------------ | ------- |
| 7 | [ice](doc/ice/README.md)                    | 70          | v0.3alpha  | Apr 21, 2021 | 295786c |
| 8 | [charger](doc/charger/README.md)            | 80              | v0.3alpha  | Apr 20, 2021 | 7070a94 |
| 9 | inclinometer                                | 80              | v0.3alpha  | Mar 29, 2021 | e97b7c4 |
| 10| [fuel_tank](doc/fuel_tank/README.md)        | 75              | v0.3alpha  | Aug 12, 2020 | a914c30 |
| 11| [pmu_cover](doc/pmu_cover/README.md)        | 72              | v0.2alpha  | Oct 5, 2020  | ef5b29a |
| 12| [gps_mag_baro](doc/gps_mag_baro/README.md)  | 71              | v0.3alpha   | Apr 5, 2021  | 7baa09b |

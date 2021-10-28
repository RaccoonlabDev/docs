## CHARGER node

This board allows to automatically charge a battery.

![charger](charger.jpg?raw=true "charger")

## Content
  - [1. UAVCAN interface](#1-uavcan-interface)
  - [2. Hardware specification](#2-hardware-specification)
  - [3. Wire](#3-wire)
  - [4. Main function description](#4-main-function-description)
  - [5. Auxiliary functions description](#5-auxiliary-function-description)
  - [6. Led indication](#6-led-indication)
  - [7. Usage example on a table](#7-usage-example-on-a-table)
  - [8. UAV usage example](#8-uav-usage-example)

## 1. UAVCAN interface

This node interracts with following messages:

| № | type      | message  |
| - | --------- | -------- |
| 1 | publisher   | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) |

Beside required and hightly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports following application level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | service consumer | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | service consumer   | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | service consumer   | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Hardware specification

(in process)

## 3. Wire

You can power this board using one of 2 CAN-sockets:

1. UCANPHY Micro (JST-GH 4).
```
UAVCAN/CAN Physical Layer Specification note.
Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal.
Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not
exceed 1 A per connector.
```
2. 6-pin Molex series 502585 connector ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670) and [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600))

```
Up to 100 V, 2 A per contact
```

It also has SWD socket that is dedicated for updating firmware using [programmer-sniffer](doc/programmer_sniffer/README.md) device.

## 4. Main function description

Algorithm of charging is following:

1. At initialization stage it perform calibration of zero current value for 3 seconds.

2. After that it goes to the WAITING stage where it is trying to detect connected battery by measuring voltage and comparing it with offset value.

3. When battery is detected, it goes to the SIGNALING stage, where it just blinks leds for 2 seconds to signals us about start charging. 

4. Then it goes to the CHARGING stage where it tries to maintains the target current level by regulating dc-dc voltage using control loop shown below.

5. If current is less than some offset value that could mean that battery is charged or disconnected it goes into FINISH stage. If voltage is less than some offset value it returns to the CHARGING stage again.

![scheme](charger_algorithm.png?raw=true "scheme")

The table with parameters shown below.

![scheme](params.png?raw=true "scheme")

## 5. Auxiliary functions description

(in process)

## 6. Led indication

(in process)

## 7. Usage example on a table

(in process)

## 8. Real appilcation usage example

(in process)

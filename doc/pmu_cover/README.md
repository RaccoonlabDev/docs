## UAVCAN PMU node

This board monitors battery (voltage and current) and allows to control charging, source and load. It might be usefull for application where you need to control power of the drone including board computer and charging process.

![pmu_cover](pmu_cover.png?raw=true "pmu_cover")

## Content
  - [1. UAVCAN interface](#1-uavcan-interface)
  - [2. Hardware specification](#2-hardware-specification)
  - [3. Wire](#3-wire)
  - [4. Main function description](#4-main-function-description)
  - [5. Auxiliary functions description](#5-auxiliary-function-description)
  - [6. Parameters](#6-parameters)
  - [7. Led indication](#7-led-indication)
  - [8. Usage example on a table](#8-usage-example-on-a-table)
  - [9. UAV usage example](#9-uav-usage-example)

## 1. UAVCAN interface

This node interracts with following messages:

| № | type      | message  |
| - | --------- | -------- |
| 1 | publisher   | [uavcan.equipment.power.BatteryInfo](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#batteryinfo) |
| 2 | publisher   | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) |
| 3 | publisher   | inno_msgs.PmuStatus |
| 4 | subscriber   | inno_msgs.PmuChargerControl |
| 5 | subscriber   | inno_msgs.PmuPowerControl |
| 6 | subscriber   | inno_msgs.PmuLoadControl |


| № | type      | message  |
| - | --------- | -------- |
| 1 | service consumer | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | service consumer   | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | service consumer   | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |


## 4. Main function description

This board monitors:
1. battery voltage (PA0, k=13.91)
2. 5V voltage (PA1, k=2)
3. charger contact status (PB4)
4. load current (PA3, 60 Ampers ~ 3.15V)

and controls:
1. connect charger (PB6)
2. enable load (autopilot, motors, etc) (PB7)
3. enable jetson (PB5)

![battery_info_msg](battery_info_msg.png?raw=true "battery_info_msg")

![pmu_status_msg](pmu_status_msg.png?raw=true "pmu_status_msg")

## 6. Parameters

![pmu_params](pmu_params.png?raw=true "pmu_params")

## 8. Usage example on a table

```python
broadcast(uavcan.thirdparty.inno_msgs.PmuChargerControl(cmd=0))
broadcast(uavcan.thirdparty.inno_msgs.PmuChargerControl(cmd=1))

broadcast(uavcan.thirdparty.inno_msgs.PmuPowerControl(cmd=0))
broadcast(uavcan.thirdparty.inno_msgs.PmuPowerControl(cmd=1))

broadcast(uavcan.thirdparty.inno_msgs.PmuLoadControl(cmd=0))
broadcast(uavcan.thirdparty.inno_msgs.PmuLoadControl(cmd=1))
```
# UAVCAN PMU node

This board monitors the battery (voltage and current) and allows to control charging, source and load. It might be useful for applications where you need to control the power of the drone including the board computer and charging process.

![pmu_cover](../../assets/pmu_cover/pmu_cover.png?raw=true "pmu_cover")

## 1. UAVCAN interface

This node interacts with the following messages:

| № | type      | message  |
| - | --------- | -------- |
| 1 | publisher   | [uavcan.equipment.power.BatteryInfo](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#batteryinfo) |
| 2 | publisher   | [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) |
| 3 | publisher   | inno_msgs.PmuStatus |
| 4 | subscriber   | inno_msgs.PmuChargerControl |
| 5 | subscriber   | inno_msgs.PmuPowerControl |
| 6 | subscriber   | inno_msgs.PmuLoadControl |


| № | type      | message  |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#gettransportstats) |


## 4. Main function description

This board monitor:
1. battery voltage (PA0, k=13.91)
2. 5V voltage (PA1, k=2)
3. charger contact status (PB4)
4. load current (PA3, 60 Ampers ~ 3.15V)

and controls:
1. connect the charger (PB6)
2. enable load (autopilot, motors, etc) (PB7)
3. enable jetson (PB5)

![battery_info_msg](../../assets/pmu_cover/battery_info_msg.png?raw=true "battery_info_msg")

![pmu_status_msg](../../assets/pmu_cover/pmu_status_msg.png?raw=true "pmu_status_msg")

## 6. Parameters

![pmu_params](../../assets/pmu_cover/pmu_params.png?raw=true "pmu_params")

## 8. Usage example on a table

```python
broadcast(uavcan.thirdparty.inno_msgs.PmuChargerControl(cmd=0))
broadcast(uavcan.thirdparty.inno_msgs.PmuChargerControl(cmd=1))

broadcast(uavcan.thirdparty.inno_msgs.PmuPowerControl(cmd=0))
broadcast(uavcan.thirdparty.inno_msgs.PmuPowerControl(cmd=1))

broadcast(uavcan.thirdparty.inno_msgs.PmuLoadControl(cmd=0))
broadcast(uavcan.thirdparty.inno_msgs.PmuLoadControl(cmd=1))
```
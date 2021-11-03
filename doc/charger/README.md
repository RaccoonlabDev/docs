## UAVCAN Charger node

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
| 1 | publisher   | inno_msgs.charging_status |
| 2 | publisher   | inno_msgs.charging_response |
| 3 | publisher   | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) |
| 4 | subscriber   | inno_msgs.charging_control |
| 5 | subscriber   | [uavcan.equipment.power.BatteryInfo](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#batteryinfo) |

Beside required and hightly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports following application level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | service consumer | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | service consumer   | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | service consumer   | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |

**Custom messages description**

1. inno_msgs.ChargingControl

| № | type  | name        | meaning                                     |
| - | ----- | ----------- | ------------------------------------------- |
| 1 | uint8 | cmd | 0 - disable, 1 - calibrate, 2 - enable normal charging, 3 - enable extream charging, 4 - enable saving mode, 5 - do nothing |

2. inno_msgs.ChargingStatus is published by this node with constant rate that might be configured using uavcan parameters. The table below describes his fields:

| № | type                    | name        | meaning                                     |
| - | ----------------------- | ----------- | ------------------------------------------- |
| 1 |inno_msgs.ChargingControl|executing_cmd| command being executed at this moment       |
| 2 | uint8   | stage                       | stage of the state machine at that moment   |
| 3 | uint8   | state_of_charge_pct         | soc in %, 127 if unknown                    |
| 4 | uint16  | dac_value                   | DAC raw value from o to 4095                |
| 5 | float16 | capacity                    | integrated capacity during charging, mAh    |
| 6 | float16 | received_battery_voltage    | voltage received from BatteryInfo, volts    |
| 7 | float16 | measured_dc_dc_voltage      | dc-dc output voltage measured using ADC     |
| 8 | float16 | mesured_battery_current     | dc-dc output current measured using ADC     |
| 9 | float16 | measured_shunt_current      | dc-dc input current measured using ADC      |
| 10| float16 | measured_temperature        | not implemented yet                         |

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

This node might be discribed using state machine.

After boot the node is in the `calibration` stage - it measures dc-dc output current using ADC multiple times and calucates average raw adc value - the offset corresponded to the zero current. After calibration stage the node goes to the `waiting` stage where it is ready for further work. The calibration stage may be repeated only by a specific charing command.

If node receives start charging command, it goes into `signaling` stage and then starts charging process.

The charging process is divided into 2 main stages. It starts with `charging with constant current (CC)` stage then goes into `charging with constant voltage (CV)`.

If battery voltage more then maximum voltage (battery is charged) or less then some specific voltage (battary is not connected) or data receiving stops in goes into `check finish` stage. After some checks it goes into `finish` or `waiting` stages or even goes into previous stage

The whole state machine might be illustarted using following flowchart diagram:

![charger](state_machine.png?raw=true "charger")

The typical 2-stages charging process might me illustrated using following plot:

![scheme](normal_charging_process.png?raw=true "scheme")

During both stages this node uses I-regulator to keep constand current/voltage.

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

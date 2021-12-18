## UAVCAN Rangefinder node

This board is a wrapper under [LW20/C](https://www.mouser.com/datasheet/2/321/28055-LW20-SF20-LiDAR-Manual-Rev-7-1371848.pdf) that allows to use it through the UAVCAN network.

It reads measurements from the sensor via i2c and publishes the range in meters.

![rangefinder](rangefinder.jpg?raw=true "rangefinder")

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

This node interacts with the following messages:

| № | type      | message  |
| - | --------- | -------- |
| 1 | publisher   | [uavcan.equipment.range_sensor.Measurement](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#measurement) |
| 2 | publisher   | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) |

Besides required and highly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports the following application-level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | service consumer | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | service consumer   | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | service consumer   | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Hardware specification

(in progress)

## 3. Wire

You can power this board using one of 2 CAN-sockets:

1. 4-pin CAN-socket (`UCANPHY Micro - JST-GH 4`). This socket is described in [UAVCAN/CAN Physical Layer Specification](https://forum.uavcan.org/t/uavcan-can-physical-layer-specification-v1-0/1471). Short note from the standard below: 
```
UAVCAN/CAN Physical Layer Specification note.
Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal.
Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not
exceed 1 A per connector.
```
2. 6-pin CAN-socket (`Molex series 502585 connector`: [502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670) and [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600))

```
Up to 100 V, 2 A per contact
```

It also has an SWD socket that is dedicated to updating firmware using [programmer-sniffer](doc/programmer_sniffer/README.md) device.

## 4. Main function description

This node measures and publishes range with adjustable rates (10 Hz by default for both). Publication and measurement rates might be configured using node parameters, but it is recommended to use default values.

## 5. Auxiliary functions description

**Circuit status**

It also sends [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) messages with measured `5V` and `Vin`.

## 6. Parameters

The list of parameters is shown in the picture below:

![scheme](rangefinder_params.png?raw=true "scheme")

Using parameters you may specify the type of sensor (now it supports only LW20/C)

| rangefinder_type value | corresponded sensor type  |
| ---------------------- | ------------------------- |
| 0                      | LW20/C                    |
| 1                      | vl53l0x                   |

## 7. Led indication

This board has an internal led that may allow you to understand possible problems. It blinks from 1 to 10 times within 4 seconds. By counting the number of blinks you can define the code of current status.

| Number of blinks | Uavcan health   | Description                     |
| ---------------- | -------------- | ------------------------------- |
| 1                | OK             | Everything is ok.                |
| 2                | OK             | There is no RawCommand at least for the last 0.5 seconds (it's not a problem for this board, just in case). |
| 3                | WARNING        | This node can't see any other nodes in UAVCAN network, check your cables, or there is no incoming data from the sensor. |
| 4                | ERROR          | There is a problem with circuit voltage, look at circuit status message to get details. It may happen when you power it from SWD, otherwise, be careful with the power supply. This check might be turned off using params. |
| 5                | CRITICAL       | There is a problem with the periphery initialization level. Probably you load the wrong firmware. |


## 8. Usage example on a table

It is recommended to debug it with [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool). You can check the message sent by this node.

Example of the message shown below.

![scheme](rangefinder_message.png?raw=true "scheme")

## 9. UAV usage example

(in progress)

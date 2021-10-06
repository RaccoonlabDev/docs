## rangefinder

This board is a wrapper under [LW20/C](https://www.mouser.com/datasheet/2/321/28055-LW20-SF20-LiDAR-Manual-Rev-7-1371848.pdf) that allows to use it through UAVCAN network.

It reads measurements from the sensor via i2c and publishes range im meters.

![rangefinder](rangefinder.jpg?raw=true "rangefinder")

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
| 1 | publisher   | [uavcan.equipment.range_sensor.Measurement](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#measurement) |
| 2 | publisher   | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) |

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

- the little one - it has 5V
- the big one - it up to 60V

It also has SWD socket that is dedicated for updating firmware using [programmer-sniffer](doc/programmer_sniffer/README.md) device.

## 4. Main function description

This node measures and publishes range with adjustable rates (10 hz by default fro both). Publication and measurement rates might be configured using node parameters, but it is recommended to use default values.

Available list of parameters is shown on the picture below:

![scheme](rangefinder_params.png?raw=true "scheme")

Using parameters you may specify type of sensor (now it supports only LW20/C)

| rangefinder_type value | corresponded sensor type  |
| ---------------------- | ------------------------- |
| 0                      | LW20/C                    |

## 5. Auxiliary functions description

**Circuit status**

It also sends [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) messages with measured `5V` and `Vin`.

## 6. Led indication

This board has internal led that may allows you to understand possible problems. It blinks from 1 to 10 times within 4 seconds. By counting number of blinks you can define the code of current status.

| Number of blinks | Uavcan helth   | Description                     |
| ---------------- | -------------- | ------------------------------- |
| 1                | OK             | Everything is ok.                |
| 2                | OK             | There is no RawCommand at least for last 0.5 seconds (it's not a problem for this board, just in case). |
| 3                | WARNING        | This node can't see any other nodes in UAVCAN network, check your cables or there there no incoming data from the sensor. |
| 4                | ERROR          | There is a problem with circuit voltage, look at circuit status message to get details. It may happend when you power it from SWD, otherwise be carefull with power supply. This check might be turned off using params. |
| 5                | CRITICAL       | There is a problem on periphery initialization level. Probably you load a wrong firmware. |


## 7. Usage example on a table

It is recommended to debug it with [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool). You can check message sended by this node.

Example of the message shown below.

![scheme](rangefinder_message.png?raw=true "scheme")

## 8. UAV usage example

(in process)

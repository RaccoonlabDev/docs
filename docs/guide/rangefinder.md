## UAVCAN Rangefinder node

This board has few drivers for communication with such rangefinder as [LW20/C](https://www.mouser.com/datasheet/2/321/28055-LW20-SF20-LiDAR-Manual-Rev-7-1371848.pdf) and [TF-Luna](https://files.seeedstudio.com/wiki/Grove-TF_Mini_LiDAR/res/SJ-PM-TF-Luna-A03-Product-Manual.pdf) via i2c/uart. After reading measurements it sends data through UAVCAN network.


![rangefinder](rangefinder.jpg?raw=true "rangefinder")
Fig. Prototype based on lightware LW20

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
| 1 | publisher   | [uavcan.equipment.range_sensor.Measurement](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#measurement) |
| 2 | publisher   | [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) |

Besides required and highly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports the following application-level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Hardware specification

(in process)

![scheme](../can_pwm/can_pwm_mini_scheme.png?raw=true "scheme")


## 3. Wire

This board has 3 connectors which are described in the table below.

| № | Connector | Description |
| - | --------- | ----------- |
| 1 | UCANPHY Micro (JST-GH 4) | Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal. Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not exceed 1 A per connector. |
| 2 | 6-pin Molex  ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670), [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Contacts support up to 100 V, 2 A per contact. But the board may work only with 2S-6S. |
| 3 | SWD | STM32 firmware updating using [programmer-sniffer](docs/guide/programmer_sniffer/README.md). |

## 4. Main function description

This node measures and publishes range with adjustable rates (10 Hz by default for both). Publication and measurement rates might be configured using node parameters, but it is recommended to use default values.

## 5. Auxiliary functions description

**Circuit status**

It also sends [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) messages with measured `5V` and `Vin`.

## 6. Parameters

The list of parameters is shown in the table below:

|Idx| Name             | Type    |Default| Min | Max | Desctiption |
| - | ---------------- | ------- | ----- | --- | --- | ----------- |
| 0 | ID               | integer | 73    | 0   | 100 | Node identifier |
| 1 | log_level        | integer | 3     | 0   | 4   | Minimal log level message which might be sended by this device. 0 - debug, 1 - info, 2 - warn, 3 - error, 4 - disable |
| 2 | rng_measurement_period | integer | 100     | 10   | 2000   | Period of measurement and publishing |
| 3 | rng_type         | integer | 0     | 0   | 2   | Defines which sensor to use. See the table below. |
| 4 | rng_id           | integer | 0     | 0   | 255  | Id of the sensor in the message. |
| 5 | enable_5v_check  | integer | 1     | 0   | 1   | Set ERROR status if 5V voltage is out of range 4.5 - 5.5 V |
| 6 | enable_vin_check | integer | 0     | 0   | 1   | Set ERROR status if Vin voltage is less than 4.5 V |
| 7 | name             | integer | 0     | 0   | 100 | Custom name of the node. Might be implemented by request. |

Using parameters you may specify type of sensor (now it supports only LW20/C)

| rng_type value         | corresponded sensor type  |
| ---------------------- | ------------------------- |
| 0                      | LW20/C (i2c)              |
| 1                      | TF-Luna (uart)            |
| 2                      | Garmin lite v3 (i2c)      |
| 3                      | vl53l0x (i2c)             |

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

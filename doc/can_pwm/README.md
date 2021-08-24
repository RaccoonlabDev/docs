# can-pwm

This board is dedicated for controlling servos and ESCs. It maps [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) UAVCAN messages given from CAN bus into PWM signal (frequency 50 Hz and duration from 900 to 2000 us).

It has 2 channels (A1 and A2) which might be directly connected to an actuator. Depending on firmware it also has:
1. either 2 auxiliary channels named B1, B2,
2. (experimental) or 2 auxiliary UART channels for getting feedback from [esc flame](https://store.tmotor.com/category.php?id=20)  with RPM and voltage.

The illustration of this board and pin numeration shown below.

![scheme](can_pwm.png?raw=true "scheme")

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
| 1 | subscriber | [uavcan.equipment.esc.RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) |
| 2 | publisher   | [uavcan.equipment.esc.Status](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#status-2) |
| 3 | publisher   | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) |

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

This node receives [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) which has array with up to 20 channels and it is able to process up to 4 of them.

Configuration of such mapping might be done using 4 sets (named A1, A2, B1, B2) of following params:
- channel - choose which `RawCommand` channel you want to map into particular PWM pin; -1 means disable, 0-20 - specific channel
- min - PWM duration corresponded lower value of RawCommand
- max - PWM duration corresponded highest level of RawCommand
- def - default value of PWM; the corresponded channel will have this PWM duration if there is no RawCommand for few seconds or this command has negative value 

Note, that value of `min` param might be more than value of `max` param and `def` value might be out of `min`/`max` range. It's up to you.

Below you can see visualization of this mapping.

![mapping](can_pwm_mapping.png?raw=true "mapping")

Configuration of mapping can be performed using `uavcan_gui_tool` or even `QGC`. Below you can see the table with these params in `uavcan_gui_tool`.

![scheme](can_pwm_params.png?raw=true "scheme")

## 5. Auxiliary functions description

**Circuit status**

It also sends [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) messages with measured `5V` and `Vin`.

**Esc status**

If you use esc firmware, it will sends [uavcan.equipment.esc.Status](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#status-2) message with rpm, voltage and current given as feedback from `esc flame` via uart.

## 6. Led indication

This board has internal led that may allows you to understand possible problems. It blinks from 1 to 10 times within 4 seconds. By counting number of blinks you can define the code of current status.

| Number of blinks | Uavcan helth   | Description                     |
| ---------------- | -------------- | ------------------------------- |
| 1                | OK             | Everything is ok.                |
| 2                | OK             | There is no RawCommand at least for last 0.5 seconds, PWM state is resetet to default state. |
| 3                | WARNING        | This node can't see any other nodes in UAVCAN network, check your cables. |
| 4                | ERROR          | There is a problem with circuit voltage, look at circuit status message to get details. It may happend when you power it from SWD, otherwise be carefull with power supply. |
| 5                | CRITICAL       | There is a problem on periphery initialization level. Probably you load wrong firmware. |

## 7. Usage example on a table

It is recommended to debug it with [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool). You can setup parameters, connect servo to one of the channels and check it using `ESC panel` as shown below.

![esc_panel](esc_panel.png?raw=true "esc_panel")

## 8. UAV usage example

(in process)

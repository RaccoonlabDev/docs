# UAVCAN-PWM node

UAVCAN-PWM node is dedicated for controlling servos and ESCs. It receives [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) UAVCAN messages from CAN bus and maps it into typical for servos and ESC controllers PWM signal.

This node has 2 main channels (A1 and A2) which are dedicated for direct connection with servos or ESC controllers. It also may have (depending on the board) 2 auxilliary channels (B1 and B2) which might be used for some additional purpose:
1. just additional can->pwm channels,
2. (experimental) UART channels for getting feedback from [esc flame](https://store.tmotor.com/category.php?id=20) with RPM and voltage,
3. any other goal in future.

At that moment we have 3 types of such UAVCAN-pwm nodes, so called `5A`, `Micro` and `Nano`. They are illustrated below.

![scheme](can_pwm_nodes.png?raw=true "scheme")

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

![scheme](pinout.png?raw=true "scheme")

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

This node receives [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) that has an array with up to 20 channels and it is able to process up to 4 of any of them. Each channel is normalized into [-8192, 8191].

Output for each disared RawCommand channel is PWM signal with frequency 50 Hz and duration from 900 to 2000 us. Typically, 900 us means minimal position of servo or stopped motor on the ESC and 2000 us is a maximum. But this range might be different depending on your actuator and desired angle of control of your servo. You also may want to inverse the output of your servo and set a default position of your servo other than just a min or max, for example a middle.

Configuration of such mapping might be done using following 4 parameters that exist for each PWM-channel:

| № | Parameter name | Description  |
| - | -------------- | -------- |
| 1 | channel        | Specify here a desired `RawCommand` channel you want to map into particular PWM pin. Default value -1 means disable. |
| 2 | min            | PWM duration when RawCommand = 0. |
| 3 | max            | PWM duration when RawCommand = 8191. |
| 4 | def            | PWM duration when RawCommand < 0 or when there is no RawCommand for few seconds. |

Below you can see visualization of this mapping.

![mapping](can_pwm_mapping.png?raw=true "mapping")

Configuration of mapping can be performed using `uavcan_gui_tool` or even `QGC`. Below you can see the table with these params in `uavcan_gui_tool`.

![scheme](can_pwm_params.png?raw=true "scheme")

## 5. Auxiliary functions description

**Circuit status**

It also sends 2 [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) messages with measured `5V` and `Vin`.

The first message has `circuit_id=NODE_ID*10 + 0` and following 3 significant fields:
1. voltage - is the 5V voltage
2. current - is the max current for last 0.5 second
3. error_flags - might have ERROR_FLAG_OVERVOLTAGE or ERROR_FLAG_UNDERVOLTAGE or non of them

The second message has `circuit_id=NODE_ID*10 + 1` and following 3 significant fields:
1. voltage - is the Vin voltage
2. current - is the average current for last 0.5 second
3. error_flags - ERROR_FLAG_UNDERVOLTAGE or non of them. There is no ERROR_FLAG_OVERVOLTAGE flag because the expected max Vin voltage is unknown.

Below you can see an example of current consumption with 5V voltage power supply:

![max and avg current plot](current_plot.png?raw=true "max and avg current plot")
Fig. Max and average current measurement

Here cyan color plot is current in ampers with max filter, yellow is current in ampers with average filter. Picks happens when servo was changed his position.

```
Note: only `5A` node supports current measurement. All nodes supports 5V and Vin measurement.
```

**Esc status**

If you use esc firmware, it will sends [uavcan.equipment.esc.Status](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#status-2) message with rpm, voltage and current given as feedback from `esc flame` via uart.

**Node name customization**

By default this node have general purpose name `inno.can.pwm_node`.
This name might be changed to more specific name by changing the parameter `name`.

List of avaliable names shown below.

| Param value | Node name                 |
| ----------- | ------------------------- |
| 0           | default                   |
| 1           | inno.esc.right_front      |
| 2           | inno.esc.left_rear        |
| 3           | inno.esc.left_front       |
| 4           | inno.esc.right_rear       |
| 5           | inno.esc.left             |
| 6           | inno.esc.right            |
| 7           | inno.esc.front            |
| 8           | inno.esc.rear             |
| 9           | inno.servos.aileron_left  |
| 10          | inno.servos.aileron_right |
| 11          | inno.servos.elevators     |
| 12          | inno.servos.rudders       |

You should send the corresponded number of your desired name, store parameter inside the node and restart it.

## 6. Led indication

This board has an internal led that may allows you to understand possible problems. It blinks from 1 to 10 times within 4 seconds. By counting number of blinks you can define the code of current status.

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

This node is tested multiple times on several multicopters and VTOL.

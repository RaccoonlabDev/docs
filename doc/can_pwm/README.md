# UAVCAN-PWM node

UAVCAN-PWM node is dedicated to controlling servos and ESCs. It receives [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) / [ArrayCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#arraycommand) UAVCAN messages from the CAN bus and maps it into typical for servos and ESC controllers PWM signal.

This node is capable to work with up to 2 ESC/servo simultaniusly (though UAVCAN-PWM node Mini has 2 auxilliary channels which might be used as PWM as well).

At that moment we have 3 types of such UAVCAN-PWM boards, so-called `5A`, `Mini` and `Nano`. They are illustrated below.

| UAVCAN-PWM node 5A | UAVCAN-PWM node Mini | UAVCAN-PWM node Nano |
| ------- | ------- | -------- |
| ![](5A.png?raw=true "5A")    | ![](node_mini.png?raw=true "mini")  | ![](node_nano.png?raw=true "nano")   |

The difference between boards are following:

| № | Criterion            | 5A      | Mini     | Nano          |
| - | -------------------- | ------- | -------- | ------------- |
| 1 | development status   | tested  | tested   | testing stage |
| 1 | dc-dc availability   | yes     | yes      | no            |
| 2 | input voltage        | 2S-12S  | 2S-6S    | 4.8-5.6 V     |
| 3 | input current sensor | yes     | no       | no            |
| 4 | auxilliary pins      | no      | 2        | no            |

## Content
  - [1. UAVCAN interface](#1-uavcan-interface)
  - [2. Hardware specification](#2-hardware-specification)
  - [3. Wire](#3-wire)
  - [4. Main function description](#4-main-function-description)
  - [5. Auxiliary functions description](#5-auxiliary-functions-description)
  - [6. Parameters](#6-parameters)
  - [7. Led indication](#7-led-indication)
  - [8. Usage example on a table](#8-usage-example-on-a-table)
  - [9. PX4 integration](#9-px4-integration)
  - [10. Versions](#10-versions)

## 1. UAVCAN interface

This node interacts with the following messages:

| № | type      | message  |
| - | --------- | -------- |
| 1 | subscriber | [uavcan.equipment.esc.RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) |
| 2 | subscriber | [ArrayCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#arraycommand) |
| 3 | publisher   | [uavcan.equipment.esc.Status](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#status-2) |
| 4 | publisher   | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) |
| 5 | publisher   | [uavcan.protocol.debug.LogLevel](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#logmessage) |

Besides required and highly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports the following application-level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Hardware specification

UAVCAN-PWM mini scheme:

![can_pwm_mini_scheme](can_pwm_mini_scheme.png?raw=true "can_pwm_mini_scheme")

## 3. Wire

This board has 3 connectors which are described in the table below.

| № | Connector | Description |
| - | --------- | ----------- |
| 1 | UCANPHY Micro (JST-GH 4) | Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal. Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not exceed 1 A per connector. |
| 2 | 6-pin Molex  ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670), [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Contacts support up to 100 V, 2 A per contact. But the board may work only with 2S-6S. |
| 3 | SWD | STM32 firmware updating using [programmer-sniffer](doc/programmer_sniffer/README.md). |



UAVCAN-PWM also has 2 groups of connectors designed to connect a servo or ESC. An example of connection shown in a picture below.

![can_pwm_mini_scheme](servo_connection.jpg?raw=true "can_pwm_mini_scheme")
Fig. Example of servo connection to a A1 channel of UAVCAN-PWM mini node.

## 4. Main function description

This node receives [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) that has an array with up to 20 channels and it can process up to 2 (4) of any of them. Each channel is normalized into [-8192, 8191].

Output for each desired RawCommand channel is PWM signal with frequency 50 Hz and duration from 900 to 2000 us. Typically, 900 us means the minimal position of servo or stopped motor on the ESC and 2000 us is a maximum. But this range might be different depending on your actuator and desired angle of control of your servo. You also may want to inverse the output of your servo and set a default position of your servo other than just a min or max, for example, a middle.

Configuration of such mapping might be done using 4 parameters: `channel`, `min`, `max`, and `def` which exist for each PWM-channel. They are described in `6. Parameters` section.

Below you can see the visualization of this mapping.

![mapping](can_pwm_mapping.png?raw=true "mapping")

Fig. UAVCAN->PWM mapping

## 5. Auxiliary functions description

**Circuit status**

UAVCAN-PWM node as well as any other our nodes measure `5V` and `Vin` voltages and send them in 2 [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) messages.

These voltages might be visualized using our custom [custom uavcan_gui_tool](https://github.com/PonomarevDA/uavcan_gui_tool).

![online_nodes](online_nodes.png?raw=true "online_nodes")

The first message has `circuit_id=NODE_ID*10 + 0` and following 3 significant fields:
1. voltage - is the 5V voltage
2. current - is the max current for the last 0.5 seconds (supported only by `5A` node)
3. error_flags - might have ERROR_FLAG_OVERVOLTAGE or ERROR_FLAG_UNDERVOLTAGE or non of them

The second message has `circuit_id=NODE_ID*10 + 1` and following 3 significant fields:
1. voltage - is the Vin voltage
2. current - is the average current for the last 0.5 seconds (supported only by `5A` node)
3. error_flags - ERROR_FLAG_UNDERVOLTAGE or non of them. There is no ERROR_FLAG_OVERVOLTAGE flag because the expected max Vin voltage is unknown.

Below you can see an example of current consumption with 5V voltage power supply:

![max and avg current plot](current_plot.png?raw=true "max and avg current plot")
Fig. Max and average current measurement

Here the cyan color plot is current in ampers with max filter, yellow is current in ampers with average filter. Picks happens when servo was changed his position.

```
Note: only `5A` node supports current measurement.
```

**Esc status**

If you use esc firmware, it will send [uavcan.equipment.esc.Status](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#status-2) message with rpm, voltage and current given as feedback from `esc flame` via uart.

**Log messages**

5 second after enabling, the node may publish [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) message with his status.

A visualization of this message in `uavcan_gui_tool` in case of error shown on a picture below.

![log_messages](log_messages.png?raw=true "log_messages")

Fig. Visualization of log messages in uavcan_gui_tool on case of error

At that moment it support only 2 types of messages:
- If initialization is sucessfull and log level is DEBUG (0), it sends `sys inited` message.
- If initialization is failed, it always sends the `init failed` message where source field is a clue where error occured every 15 seconds. You should not use this node in such condition. Tipically, firmware or hardware is wrong.

This message might be used in PX4 as [logmessage](https://github.com/PX4/PX4-Autopilot/blob/master/src/drivers/uavcan/logmessage.hpp) feature.

```
Note: the 5 seconds delay is added to prevent possible flood.
```

## 6. Parameters

Below you can see a picture from `uavcan_gui_tool` with a whole list of parameters.

![scheme](can_pwm_params.png?raw=true "scheme")

**UAVCAN->PWM mapping configuration**

Mainly parameters are dedicated to UAVCAN-PWM mapping configuration. Here we have 2 or 4 groups `A1`, `A2`, `B1`, `B2` of parameters. Below you can see a table with their description:

| № | Parameter name | Description  |
| - | -------------- | -------- |
| 1 | channel        | Specify here a desired `RawCommand` channel you want to map into a particular PWM pin. Default value -1 means disable. |
| 2 | min            | PWM duration when RawCommand = 0. |
| 3 | max            | PWM duration when RawCommand = 8191. |
| 4 | def            | PWM duration when RawCommand < 0 or when there is no RawCommand for a few seconds. |

**Power check**

Such parameters as `enable_5v_check` and `enable_vin_check` are dedicated for enabling/disabling 5V and Vin check:
- If the 5V check is enabled, the node state will be `ERROR` if the 5V voltage is less than 4.5V or bigger than 5.5V
- If Vin check is enabled, the node state will be `ERROR` if the 5V voltage is less than 4.5V.

**Node name customization**

By default this node have general purpose name `inno.can.pwm_node`. This name might be changed to a more specific name by changing the parameter `name`.

The list of available names is shown below.

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

You should send the corresponded number of your desired name, store the parameter inside the node and, restart it.

## 7. Led indication

This board has an internal led that may allow you to understand possible problems. It blinks from 1 to 10 times within 4 seconds. By counting the number of blinks you can define the code of current status.

| Number of blinks | Uavcan health   | Description                     |
| ---------------- | -------------- | ------------------------------- |
| 1                | OK             | Everything is ok.                |
| 2                | OK             | There is no RawCommand at least for the last 0.5 secons, PWM state is reset to the default state. |
| 3                | WARNING        | This node can't see any other nodes in UAVCAN network, check your cables. |
| 4                | ERROR          | There is a problem with circuit voltage, look at the circuit status message to get details. It may happen when you power it from SWD, otherwise, be careful with a power supply. |
| 5                | CRITICAL       | There is a problem on the periphery initialization level. Probably you load the wrong firmware. |

## 8. Usage example on a table

It is recommended to debug it with [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool). You can set up parameters, connect the servo to one of the channels, and check it using `ESC panel` as shown below.

![esc_panel](esc_panel.png?raw=true "esc_panel")

## 9. PX4 integration

You can integrate this node with PX4 by performing following steps:

1. According to the [PX4 user guide](https://docs.px4.io/master/en/uavcan/) you need to set `UAVCAN_ENABLE` parameter to `3` value
2. You need to manually set node id to each nodes you are going to use.
3. You need to manually configurate nodes channels according to your mixer.

An example of configuration for [Generic Quadcopter](https://dev.px4.io/master/en/airframes/airframe_reference.html#quadrotor-x) airframe that uses 2 motors for each node is shown below:

| Node id | Node name          | A1_channel      | A2_channel     | Description     |
| ------- | ------------------ | --------------- | -------------- | --------------- |
| 50      | inno.esc.left (5)  | 1 (rear left)   | 2 (front left) | Left motors     |
| 51      | inno.esc.right (6) | 0 (front right) | 3 (rear right) | Right motors    |

[Standard VTOL](https://dev.px4.io/master/en/airframes/airframe_reference.html#standard-vtol) airframe with corresponded [vtol_AAERT](https://github.com/PX4/PX4-Autopilot/blob/master/ROMFS/px4fmu_common/mixers/vtol_AAERT.aux.mix) aux mixer might have the same configuration as `Generic Quadcopter` + additional configuration for control surfaces:

| Node id | Node name                      | A1_channel      | A2_channel     | Description     |
| ------- | ------------------------------ | --------------- | -------------- | --------------- |
| 60      | inno.servos.aileron_left (9)   | 4               | -1 (unused)    | AUX1: Aileron 1 |
| 61      | inno.servos.aileron_right (10) | 4               | -1 (unused)    | AUX2: Aileron 2 |
| 62      | inno.servos.elevators (11)     | 5               | -1 (unused)    | AUX3: Elevator  |
| 63      | inno.servos.rudders (12)       | 6               | -1 (unused)    | AUX4: Rudder    |
| 64      | inno.can_pwm (0)               | 7               | -1 (unused)    | AUX5: Throttle  |

Number of used channels for node depends on configuration of your vehicle. You are free to use more nodes for ESC example based on `Generic Quadcopter` or less nodes for servo example based on `Generic Quadcopter` airframe.

## 10. Versions

| Version        | Date         | Description                       |
| -------------- | ------------ | --------------------------------- |
| v0.3.0 295786c | Apr 21, 2021 | First released version.           |
| v0.3.0 0b55576 | May 31, 2021 | Add esc-flame feedback support    |
| v0.4.0 9b873da | Nov 03, 2021 | Add uavcan-pwm-5a node support    |
| v0.4.0 946e326 | Nov 17, 2021 | Add ArrayCommand support          |
| v0.5.0         | 2022         | Add log messages                  |

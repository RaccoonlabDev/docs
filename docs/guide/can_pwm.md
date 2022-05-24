# UAVCAN PWM node

UAVCAN-PWM node is dedicated to controlling servos and ESCs. It receives [RawCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#rawcommand) / [ArrayCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#arraycommand) UAVCAN messages from the CAN bus and maps it into typical for servos and ESC controllers PWM signal.

This node is capable to work with 2 ESC/servo simultaniusly (though UAVCAN-PWM node Mini has 2 auxilliary channels which might be used as PWM as well).

At that moment we have 3 types of such UAVCAN-PWM boards, so-called `5A`, [Mini](https://raccoonlab.org/store/tproduct/360882105-682589711231-uavcan-mini-node) and [Micro](https://raccoonlab.org/store/tproduct/390642159-203551776911-uavcan-micro-node). They are illustrated below.

| UAVCAN-PWM node 5A | UAVCAN-PWM node Mini | UAVCAN-PWM node Micro |
| ------- | ------- | -------- |
| ![](../../assets/can_pwm/5A.png?raw=true "5A")    | ![](../../assets/can_pwm/node_mini.png?raw=true "mini")  | ![](../../assets/can_pwm/node_micro.png?raw=true "micro")   |

The difference between boards are following:

| № | Criterion            | 5A      | Mini     | Micro         |
| - | -------------------- | ------- | -------- | ------------- |
| 1 | dc-dc availability   | yes     | yes      | no            |
| 2 | input voltage        | 2S-12S  | 2S-6S    | 4.8-5.6 V     |
| 3 | input current sensor | yes     | no       | no            |
| 4 | auxilliary pins      | no      | 2        | no            |
| 5 | Vin voltage sensor   | yes     | yes      | -             |

## 1. UAVCAN interface

This node interacts with the following messages:

| № | type      | message  |
| - | --------- | -------- |
| 1 | subscriber | [uavcan.equipment.esc.RawCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#rawcommand) |
| 2 | subscriber | [uavcan.equipment.actuator.ArrayCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#arraycommand) |
| 3 | publisher   | [uavcan.equipment.esc.Status](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#status-2) |
| 4 | publisher   | [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) |
| 5 | publisher   | [uavcan.protocol.debug.LogMessage](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#logmessage) |

Besides required and highly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports the following application-level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Hardware specification

Scheme is shown on the picture below.

![can_pwm_mini_scheme](../../assets/can_pwm/can_pwm_mini_scheme.png?raw=true "can_pwm_mini_scheme")
Fig. UAVCAN-PWM mini scheme

:::warning
ESC Flame issue.
On the picture above there is a general hardware pinout. In fact, in esc flame software uses UART2 in a single-wire mode where it uses pin named TX2 as RX.
:::

Please, check [5.2 Esc flame](#52-esc-flame) and [5.3 Auxilliary B1, B2 channels](#53-auxilliary-b1-b2-channels) to get a proper connection way for auxilliary pins.

## 3. Wire

This board has 3 connectors which are described in the table below.

| № | Connector | Description |
| - | --------- | ----------- |
| 1 | UCANPHY Micro (JST-GH 4) | Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal. Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not exceed 1 A per connector. |
| 2 | 6-pin Molex  ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670), [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Contacts support up to 100 V, 2 A per contact. But the board may work only with 2S-6S. |
| 3 | SWD | STM32 firmware updating using [programmer-sniffer](programmer_sniffer.md). |



UAVCAN-PWM also has 2 groups of connectors designed to connect a servo or ESC. An example of connection shown in a picture below.

![can_pwm_mini_scheme](../../assets/can_pwm/servo_connection.jpg?raw=true "can_pwm_mini_scheme")
Fig. Example of servo connection to a A1 channel of UAVCAN-PWM mini node.

## 4. Main function description

This node receives setpoint that might be represented as [RawCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#rawcommand) or [ArrayCommand]() depending on `command_type` parameter value. The node can process up to 2 (4 for can-mini) setpoints at the same time.

Output for each desired setpoint is PWM signal with frequency 50 Hz and duration from 900 to 2000 us. Typically, 900 us means the minimal position of servo or stopped motor on the ESC and 2000 us is a maximum. But this range might be different depending on your actuator and desired angle of control of your servo. You also may want to inverse the output of your servo and set a default position of your servo other than just a min or max, for example, a middle.

Configuration of such mapping might be done using 4 parameters: `channel`, `min`, `max`, and `def` which exist for each PWM-channel. They are described in `6. Parameters` section.

**RawCommand mapping**

RawCommand is an array that contains up to 20 setpoints called channels. Each raw command channel is normalized into [-8192, 8191]. Since the node supprots only one direction of rotation, all values below 0 are parsed as default values.

Below you can see the visualization of this mapping.

![mapping](../../assets/can_pwm/can_pwm_mapping.png?raw=true "mapping")

Fig. UAVCAN->PWM mapping

**ArrayCommand mapping**

```
This feature appeared from v0.4.0.
```

`ArrayCommand` is an array that contains up to 15 messages of type `uavcan.equipment.actuator.Command`. The most important fields of `Command` message are `actuator_id` and `command_value`.

Compared to RawCommand, if you need to send command only to, let's say, actuator with id=15, you don't need to send all other channels from 0 to 14 as well.

Another difference is that ArrayCommand might be normalized in any way. The node supports only unitless type ([-1; +1]).

`ArrayCommand` mapping looks similar to `RawCommand` mapping. If input value is negative, the output PWM value is default.

## 5. Auxiliary functions description

### 5.1 Circuit status

UAVCAN-PWM node as well as any other our nodes measure `5V` and `Vin` voltages and send them in 2 [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) messages.

These voltages might be visualized using our custom [custom uavcan_gui_tool](https://github.com/PonomarevDA/uavcan_gui_tool).

![online_nodes](../../assets/can_pwm/online_nodes.png?raw=true "online_nodes")

The first message has `circuit_id=NODE_ID*10 + 0` and following 3 significant fields:
1. voltage - is the 5V voltage
2. current - is the max current for the last 0.5 seconds (supported only by `5A` node)
3. error_flags - might have ERROR_FLAG_OVERVOLTAGE or ERROR_FLAG_UNDERVOLTAGE or non of them

The second message has `circuit_id=NODE_ID*10 + 1` and following 3 significant fields:
1. voltage - is the Vin voltage
2. current - is the average current for the last 0.5 seconds (supported only by `5A` node)
3. error_flags - ERROR_FLAG_UNDERVOLTAGE or non of them. There is no ERROR_FLAG_OVERVOLTAGE flag because the expected max Vin voltage is unknown.

Below you can see an example of current consumption with 5V voltage power supply:

![max and avg current plot](../../assets/can_pwm/current_plot.png?raw=true "max and avg current plot")

Fig. Max and average current measurement

Here the cyan color plot is current in ampers with max filter, yellow is current in ampers with average filter. Picks happens when servo was changed his position.

```
Note: only `5A` node supports current measurement.
```

### 5.2 Esc flame

If you are using [Tmotor esc flame](https://store.tmotor.com/category.php?id=20) it might be possible to get feedback from it via UART port.

In this case, the UAVCAN-PWM node will send [uavcan.equipment.esc.Status](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#status-2) for each of up to 2 activated channels (A1 and A2).

It will fill following field of this message:

| № | Field name | Description |
| - | --------- | ----------- |
| 1 | error_count | This field is used for debug only. The value is incremented after receiving of each byte. If it doesn't change, typically your UART connection is broken. |
| 2 | voltage | Voltage on the regulator. |
| 3 | rpm | Rotation per minute. |
| 4 | esc_index | Index of esc. From 0 to 31. |

Other fields such as current and temperature are not supproted.

To enable this feature, your need to load a special firmware called `can_pwm_esc_flame` (or `can_pwm_with_feedback` that is the same).

PWM connection for A1 and A2 channels remains the same. Feedback conenction via UART is shown on the picture below.

<img src="../../assets/can_pwm/esc_feedback.png" alt="drawing" width="200"/>

Fig. Pinout for `pwm-mini` node with `can_pwm_with_feedback` firmware

This feature was tested on [FLAME 80A 12S V2.0](https://store.tmotor.com/goods.php?id=830).

### 5.3 Auxilliary B1, B2 channels

If you load `can_pwm_four_channels` firmware for can-mini node (that is the default one for this board) you are able to use up to 4 channels. Channels A1 and A2 are the main channels (becase they are common for all boards) and B1 and B2 are auxilliary. 

PWM connection for A1 and A2 channels remains the same. Auxilliary channels connection is shown on the picture below.

<img src="../../assets/can_pwm/auxilliary_channels_b1_b2.png" alt="drawing" width="200"/>

Fig. Pinout for `pwm-mini` node with `can_pwm_four_channels` firmware

:::warning
Since there is no special 5V pin for B1 and B2 channels, you must use external power.
:::

### 5.4 Node info

Every firmware store following info that might be received as a response on NodeInfo request. It stores:
- software version,
- hardware version (doen't work yet),
- an unique identifier.

![node_info](../../assets/can_pwm/node_info.png?raw=true "node_info")

### 5.4 Log messages

The node may inform you when something happen using [uavcan.protocol.debug.LogMessage](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#logmessage).

At that moments the node may publishes messages in 2 ways:
1. 5 second after enabling. Here we can have one of following messages:
- If everything is ok, the log level is `DEBUG` and the message is `sys inited`
- If the node have power problems, the log level is `ERROR`,
- If the hardware and software diagnostic fails during initialization, you will get a `CRITICAL` level message. This should not happen in normal condition, but if so, don't use it in production. In this case, the node repeats the message each 15 seconds.
2. When TTL timeout occure. This message has log level `WARNING`.

A visualization of this message in `uavcan_gui_tool` in case of error shown on a picture below.

![log_messages](../../assets/can_pwm/log_messages.png?raw=true "log_messages")

Fig. Visualization of log messages in uavcan_gui_tool on case of error

This message might be used in PX4 as [logmessage](https://github.com/PX4/PX4-Autopilot/blob/master/src/drivers/uavcan/logmessage.hpp) feature.

### 5.5 Time to live

Every received setpoint has his own time to live timestamp.

If the timeout specified in parameters is exceeded, the setpoint will be equal to default value.

Typically, the value of this parameter should be at least in 2 times more that setpoint publish rate.

### 5.6 Watchdog

The node performs the diagnostic during all of the working time. In case of freeze, it will automatically reboot in 0.6 seconds.

### 5.7 Flight time recorder

The flight time recorder feature allows you to record total time when the node is armed. It might be usefull for application where hardware resource is essential. Some devices such as internal combustion engine is recommended to update in a relatively short period of time, let's say 300-400 hours.

The flight recorded time is stored in flash memory. The limitation of working with flash memory is following:
- it takes time to erase and write data to the memory,
- the erasing resource of flash memory is limited.
Since we don't want to interfare on the node during arm, the tine updating is performed only after 0.5 second after node goes into disarm state.

Since PX4 doesn't support [ArmingStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#armingstatus) yet, the arm/disarm state is estimated by RawCommand. If all values of these commands are zero or negative, it is estimated as disarm. If any of commands values are positive, it is estimated as arm.

## 6. Parameters

Below you can see a picture from `uavcan_gui_tool` with the latest list of parameters.

The actual list of parameters on your node depends on firmware version.

![params](../../assets/can_pwm/params.png?raw=true "params")

Fig. The latest list of parameters

A brief description of all parameters shown in the table below.

| №         | Parameter name   | Reboot required | Description |
| --------- | ---------------- | --------------- | ----------- |
| 0         | ID               | true            | Node ID     |
| 1         | log_level        | true            | Specify what level of log can be sent. |
| 2,6,10,14 | ch               | false           | Index of setpoint channel. |
| 3,7,11,15 | min              | false           | PWM duration when setpoint is min. |
| 4,8,12,16 | max              | false           | PWM duration when setpoint is max. |
| 5,9,13,17 | def              | false           | PWM duration when setpoint is negative or there is no setpoint at all. |
| 18        | command_type     | true            | 0 means RawCommand, 1 means ArrayCommand |
| 19        | cmd_ttl_ms       | false           | [Time to live](https://en.wikipedia.org/wiki/Time_to_live) timeout |
| 20        | enable_5v_check  | false           | Set ERROR status if 5V voltage is out of range 4.5 - 5.5 V |
| 21        | enable_vin_check | false           | Set ERROR status if Vin voltage is less than 4.5 V |
| 22        | flight_time_sec  | false           | The total flight time in seconds. |
| 23        | name             | true            | Name of the node |

The detailed description of some of these parameters is shown in the chapters below.

### 6.1. Log level

According to the [LogLevel](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#loglevel) message, we have 4 log levels:
- debug
- info
- warning
- errors

`log_level` parameter might have values described in the table below.

| Param value | DEBUG | INFO | WARNING | ERROR | Description            |
| ----------- | ----- | ---- | ------- | ----- | ---------------------- |
| 0           | +     | +    | +       | +     | Log everythng          |
| 1           | -     | +    | +       | +     | At least INFO level    |
| 2           | -     | -    | +       | +     | At least WARNING level |
| 3           | -     | -    | -       | +     | At least ERROR level   |
| 4           | -     | -    | -       | -     | Disable logging        |

0 - log everything, 1 - discard less than info level, 2 - discard less than warn level, 3 -log only errors, 4 - disable logging

### 6.2. Mapping configuration

Mainly parameters are dedicated to UAVCAN-PWM mapping configuration. Here we have 2 or 4 groups `A1`, `A2`, `B1`, `B2` of parameters. Below you can see a table with their description:

| Param name  | Description                                                                             |
| ----------- | --------------------------------------------------------------------------------------- |
| xx_ch       | Index of setpoint channel (RawCommand or ArrayCommand). Default value -1 means disable. |
| xx_min      | PWM duration when setpoint is min (RawCommand is 0 or Command is 0.0)                   |
| xx_max      | PWM duration when setpoint is max (RawCommand is 8191 or Command is 1.0)                |
| xx_default  | PWM duration when setpoint is negative or there is no setpoint at all                   |

### 6.3. Voltage checks

Such parameters as `enable_5v_check` and `enable_vin_check` are dedicated for enabling/disabling 5V and Vin check:
- If the 5V check is enabled, the node state will be `ERROR` if the 5V voltage is less than 4.5V or bigger than 5.5V
- If Vin check is enabled, the node state will be `ERROR` if the 5V voltage is less than 4.5V.

### 6.4. Node name customization

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

## 8. Debugging on a table

It is recommended to debug this node and perform configuration with [gui_tool](https://github.com/UAVCAN/gui_tool). This utility allows to easily use full functionallity of this node.

At the beggining, you may start with devices connection shown on the picure below.

![can_pwm_test_on_table](../../assets/can_pwm/can_pwm_test_on_table.png?raw=true "can_pwm_test_on_table")

Fig. Servo connection to the PWM-node

Here, the PWM-mini node is connected with 2 devices:
- a UAVCAN sniffer via CAN (the sniffer is connected to PC via USB and power the node),
- a servo is connected via A1 channel.

Initially, according to the [7. Led indication](#7-led-indication), the node should blink 3 times because it doesn't receive any CAN-frames.

After running `gui_tool` in non-anonymous mode, the node starts receving CAN-frames. Since it still doesn't receive any setpoints, it should blink 2 times.

The next step is to open either `ESC panel` or `Actuator panel` as shown below.

![esc_panel](../../assets/can_pwm/esc_and_actuator_panels.png?raw=true "esc_panel")

Now node should blink only 1 time per the period.

Configuration might be done via UAVCAN parameters as it described in sections [5. Auxiliary functions description](#5-auxiliary-functions-description) and [6. Parameters](#6-parameters).

Since the servo is connected to `A1` channel, by modifying `A1_channel` from `-1` to any value from `0` to `10` we may set the desired RawCommand index that the node will be subscribes on.

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

Here is a list with released stable version of the firmwares.

1. PWM-MINI with 4 pwm channels:

| Version | Date         | SHA     | Link     |
| ------- | ------------ | ------- | -------- |
| v0.3.0  | Apr 05, 2021 | 04866c1 | [link](https://github.com/InnopolisAero/inno_uavcan_node_binaries/releases/tag/v0.3.0-stable) |
| v0.3.0.1| Mar 28, 2022 | 699cbd6 | [link](https://github.com/InnopolisAero/inno_uavcan_node_binaries/releases/tag/v0.5.2-stable) |

2. PWM-MINI with esc flame feedback:

| Version | Date         | SHA     | Link     |
| ------- | ------------ | ------- | -------- |
| v0.3.2  | May 31, 2021 | 0b55576 | [link](https://github.com/InnopolisAero/inno_uavcan_node_binaries/releases/tag/v0.3.2) |
| v0.3.2.1| Mar 28, 2022 | 3aaaacf | [link](https://github.com/InnopolisAero/inno_uavcan_node_binaries/releases/tag/v0.5.2-stable) |

3. PWM-MICRO with 2 channels:

| Version | Date         | SHA     | Link     |
| ------- | ------------ | ------- | -------- |
| v0.5.2.1| Apr 5, 2022  | a208527 | [link](https://github.com/InnopolisAero/inno_uavcan_node_binaries/releases/tag/v0.5.2-stable) |
| v0.5.7  | May 06, 2022 | f951dc6 | [link](https://github.com/InnopolisAero/inno_uavcan_node_binaries/releases/tag/v0.5.8-stable) |

History of all changes (including dev):

| Version           | Date         | Description                                                            |
| ----------------- | ------------ | ---------------------------------------------------------------------- |
| v0.3.0    04866c1 | Apr 05, 2021 | PWM-MINI with 4 channels first release                                 |
| v0.3.0.1  699cbd6 | Mar 28, 2022 | PWM-MINI with 4 channels with extended RC channels amount (10 -> 20)   |
| v0.3.1    295786c | Apr 21, 2021 | Internal refactoring a little bit                                      |
| v0.3.2    0b55576 | May 31, 2021 | PWM-MINI with esc-flame feedback first release                         |
| v0.3.2.1  3aaaacf | Mar 28, 2022 | PWM-MINI with esc-flame with extended RC channels amount (10 -> 20)    |
| v0.4.0    9b873da | Nov 03, 2021 | PWM-5A first release                                                   |
| v0.4.0    946e326 | Nov 17, 2021 | Add ArrayCommand support                                               |
| v0.5.0    45a925f | Feb 07, 2022 | Add LogMessages                                                        |
| v0.5.1    b626feb | Mar 30, 2022 | Add Watchdog                                                           |
| v0.5.2    c4ab2be | Mar 31, 2022 | Add Flight time recorder                                               |
| v0.5.2.1  a208527 | Apr 5, 2022  | PWM-MINI with extended RC channels amount (10 -> 20)                   |
| v0.5.7    f951dc6 | May 06, 2022 | Use individual TTL for each setpoint instead of a single one           |

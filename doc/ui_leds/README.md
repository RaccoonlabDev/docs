# UAVCAN UI LEDS node

This node sets the same color as autopilot has ([ui leds](https://docs.px4.io/master/en/getting_started/led_meanings.html#ui-led)) during disarm and sets a specific solid/blinking color ([aviation navigation lights](https://en.wikipedia.org/wiki/Navigation_light#Aviation_navigation_lights)) when armed.

![ui_leds](ui_leds.jpg?raw=true "ui_leds")

```
Note: there are different hardware implementation of this board with different number of LEDs. On the picture above you can see only one of them.
```

## Content
  - [1. UAVCAN interface](#1-uavcan-interface)
  - [2. Hardware specification](#2-hardware-specification)
  - [3. Wire](#3-wire)
  - [4. Main function description](#4-main-function-description)
  - [5. Auxiliary functions description](#5-auxiliary-functions-description)
  - [6. Parameters](#6-parameters)
  - [7. Led indication](#7-led-indication)
  - [8. Debugging on a table](#8-debugging-on-a-table)
  - [9. PX4 integration](#9-px4-integration)

## 1. UAVCAN interface

This node interacts with the following messages:

| № | type      | message  |
| - | --------- | -------- |
| 1 | subscriber | [uavcan.equipment.esc.RawCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#rawcommand) |
| 2 | subscriber | [uavcan.equipment.indication.LightsCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#lightscommand) |
| 3 | publisher   | [uavcan.protocol.debug.LogMessage](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#logmessage) |

Besides required and highly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports the following application-level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Hardware specification

![lights_scheme](lights_scheme.png?raw=true "lights_scheme")

## 3. Wire

This board has 3 connectors which are described in the table below.

| № | Connector | Description |
| - | --------- | ----------- |
| 1 | UCANPHY Micro (JST-GH 4) | Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal. Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not exceed 1 A per connector. |
| 2 | 6-pin Molex  ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670), [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Contacts support up to 100 V, 2 A per contact. But the board may work only with 2S-6S. |
| 3 | SWD | STM32 firmware updating using [programmer-sniffer](doc/programmer_sniffer/README.md). |

## 4. Main function description

The node receives [LightsCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#lightscommand) and [RawCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#rawcommand) and sets the led color corresponded to the UAVCAN parameters.

It works in 2 modes:
1. If there is no [RawCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#rawcommand) or his value is equal or less than zero, the led value will be based on [LightsCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#lightscommand) value. Depending on ID configured in node parameters and PX4 parameters, it might RGB UI led value or some UAVCAN light operation mode. Study [PX4 user manual LED meaning section](https://docs.px4.io/master/en/getting_started/led_meanings.html) and [PX4 UAVCAN parameters](https://docs.px4.io/v1.12/en/advanced_config/parameter_reference.html#uavcan).
2. Otherwese, the value of LED will be defined by UAVCAN parameter. It might be solid, blinking or pulsing lighting.

See [6. Parameters](#6-parameters) section for mode details.

## 5. Auxiliary functions description

### 5.1 Node info

Every firmware store following info that might be received as a response on NodeInfo request. It stores:

- software version,
- hardware version (doen't work yet),
- an unique identifier.

![node_info](node_info.png?raw=true "node_info")

### 5.2 Log messages

The node may inform you when something happen using [uavcan.protocol.debug.LogMessage](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#logmessage).

At that moments the node may publishes messages only 5 second after enabling. Here we can have one of following messages:
- If everything is ok, the log level is `DEBUG` and the message is `sys inited`
- If the node have power problems, the log level is `ERROR`,
- If the hardware and software diagnostic fails during initialization, you will get a `CRITICAL` level message. This should not happen in normal condition, but if so, don't use it in production. In this case, the node repeats the message each 15 seconds.

A visualization of this message in `uavcan_gui_tool` in case of error shown on a picture below.

![log_messages](log_messages.png?raw=true "log_messages")

Fig. Visualization of log messages in uavcan_gui_tool after initialization with log_level=0

This message might be used in PX4 as [logmessage](https://github.com/PX4/PX4-Autopilot/blob/master/src/drivers/uavcan/logmessage.hpp) feature.

## 6. Parameters

Below you can see a picture from `gui_tool` with a whole list of parameters.

Configuration of mapping can be performed using `gui_tool` or even `QGC`. Below you can see the table with these params in `gui_tool`.

![params](params.png?raw=true "params")

Table with parameters description:

| № | Parameter name | Reboot required | Description  |
| - | -------------- | --------------- | ------------ |
| 1 | log_level | true | Specify what level of log can be sent. |
| 2 | rgb_leds_max_intensity | false | Input uavcan commands linearly scales into intensity from 0 to this value. Max value is 255. |
| 3 | rgb_leds_id | true | Id for uavcan command that will be expected by the node. By default 0 id corresponds ui led. |
| 4 | rgb_leds_default_color | false | The color during arming state. See table below with more info. |
| 5 | rgb_leds_light_type | false | The type of lighting during arming state. It might be solid, blink or pulsing lighing. See table below with more info. |
| 6 | rgb_leds_num_of_leds | true | Number of leds on the board. |
| 7 | rgb_leds_blink_period_ms | false | Make sense only when `rgb_leds_default_color` is 1. |
| 8 | rgb_leds_blink_duty_cycle_pct | false | Make sense only when `rgb_leds_default_color` is 1. |

Table with default colors:

| № | Color       |
| - | ----------- |
| 0 | red         |
| 1 | green       |
| 2 | blue        |
| 3 | magenta     |
| 4 | yellow      |
| 5 | cyan        |
| 6 | white       |
| 7 | turned off  |

Table with light types:

| № | Type        |
| - | ----------- |
| 0 | solid       |
| 1 | blink       |
| 2 | pulsing     |

## 7. Led indication

This board has an internal led that may allows you to understand possible problems. It blinks from 1 to 10 times within 4 seconds. By counting the number of blinks you can define the code of current status.

| Number of blinks | Uavcan health   | Description                     |
| ---------------- | -------------- | ------------------------------- |
| 1                | OK             | Everything is ok.                |
| 2                | OK             | There is no RawCommand at least for the last 0.5 seconds, the PWM state is reset to default state. |
| 3                | WARNING        | This node can't see any other nodes in the UAVCAN network, check your cables. |
| 4                | ERROR          | There is a problem with circuit voltage, look at the circuit status message to get details. It may happen when you power it from SWD, otherwise, be careful with the power supply. |
| 5                | CRITICAL       | There is a problem with the periphery initialization level. Probably you load the wrong firmware. |

## 8. Debugging on a table

Since `gui_tool` doesn't support sending [LightsCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#lightscommand), it is recommended to debug the node with Autopilot. You can use this utility only for parameter configuration. Go to the [9. PX4 integration](#9-px4-integration) section.

## 9. PX4 integration

You can integrate this node with PX4 by performing following steps:
1. According to the PX4 user guide the `UAVCAN_ENABLE` must be set to one of the non-zero values.
2. You need to manually set node id to each nodes you are going to use.
3. You might be interested in configuration the following parameters as well: `UAVCAN_LGT_ANTCL`, `UAVCAN_LGT_LAND`, `UAVCAN_LGT_NAV`, `UAVCAN_LGT_STROB`.

[![ui_leds](https://img.youtube.com/vi/s0HAyvo1ACk/0.jpg)](https://youtu.be/s0HAyvo1ACk)

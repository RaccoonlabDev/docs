# UI LEDS node

This node sets the same color as autopilot has ([ui leds](https://docs.px4.io/master/en/getting_started/led_meanings.html#ui-led)) during disarm and sets a specific solid/blinking color ([aviation navigation lights](https://en.wikipedia.org/wiki/Navigation_light#Aviation_navigation_lights)) when armed.

![ui_leds](ui_leds.jpg?raw=true "ui_leds")

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
| 2 | subscriber | [uavcan.equipment.indication.LightsCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#lightscommand) |

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

(in process)

Configuration of mapping can be performed using `uavcan_gui_tool` or even `QGC`. Below you can see the table with these params in `uavcan_gui_tool`.

![params](params.png?raw=true "params")

Table with parameters decsription:

| № | Parameter name | Description  |
| - | -------------- | -------- |
| 1 | rgb_leds_max_intensity | Input uavcan commands linearly slales into intensity from 0 to this value. Max value is 255. |
| 2 | rgb_leds_id | Id fo uavcan command that will be excepted by the node. By default 0 id corresponds ui led |
| 3 | rgb_leds_default_color | The color during arming state. See table below with more info |
| 4 | rgb_leds_default_color | The type of lighting during arming state. See table below with more info |
| 5 | rgb_leds_blink_period_ms | Make sense only when `rgb_leds_default_color` is 1 |
| 6 | rgb_leds_blink_duty_cycle_pct | Make sense only when `rgb_leds_default_color` is 1 |

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

## 5. Auxiliary functions description

(in process)

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

(in process)

## 8. UAV usage example

(not tested in real applications yet)


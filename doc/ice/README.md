# UAVCAN Internal Combustion Engine node

This board is dedicated to controlling the internal combustion engine such as [DLE-20](http://rcstv.ru/static/fileunit/107b61373aea5dbedd58c2029d3c781fe909c3d9/DLE%2020%20Hobbico%20Manual%20Best.pdf).

It maps particular channels of [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) messages into 3 control signals:
1. Throttle PWM (frequency 50 Hz and duration from 900 to 2000),
2. Ignition GPIO output pin.
3. Starter GPIO output pin.

It returns [uavcan.equipment.ice.reciprocating.Status](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#status-4) with RPM and engine state and [uavcan.equipment.ice.FuelTankStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#fueltankstatus) with fuel tank level based on:
1. RPM sensor (Hall sensor, input capture timer),
2. fuel tank sensor (MS4525DO, i2c).

![starter](starter.png?raw=true "starter")

## Content

  - [1. UAVCAN interface](#1-uavcan-interface)
  - [2. Hardware specification](#2-hardware-specification)
  - [3. Wire](#3-wire)
  - [4. Main function description](#4-main-function-description)
  - [- 4.1. Params description](#41-params-description)
  - [- 4.2. RPM measurement algorithm](#42-rpm-measurement-algorithm)
  - [- 4.3. Engine controlling algorithm](#43-engine-controlling-algorithm)
  - [5. Auxiliary functions description](#5-auxiliary-function-description)
  - [6. Led indication](#6-led-indication)
  - [7. Usage example on a table](#7-usage-example-on-a-table)
  - [8. UAV usage example](#8-uav-usage-example)

## 1. UAVCAN interface

This node interacts with the following messages:

| № | type      | message  |
| - | --------- | -------- |
| 1 | subscriber | [uavcan.equipment.esc.RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) |
| 2 | publisher   | [uavcan.equipment.ice.reciprocating.Status](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#status-4) |
| 3 | publisher   | [uavcan.equipment.ice.FuelTankStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#fueltankstatus) |

Besides required and highly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports the following application-level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Hardware specification

(in progress)

## 3. Wire

This board has 4 connectors which may deliver a power to this device. They are described in the table below.

| № | Connector | Description |
| - | --------- | ----------- |
| 1 | Power socket | This board consumes more power than a typical UAVCAN node, so it is powered using an additional socket. |
| 2 | UCANPHY Micro (JST-GH 4) | Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal. Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not exceed 1 A per connector. |
| 3 | 6-pin Molex  ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670), [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Contacts support up to 100 V, 2 A per contact. But the board may work only with 2S-6S. |
| 4 | SWD | STM32 firmware updating using [programmer-sniffer](doc/programmer_sniffer/README.md). |

It also has following board-specific connectors:

| № | Connector        | Description    |
| - | ---------------- | -------------- |
| 5 | Fuel tank sensor | in process...  |
| 6 | Starter          | in process...  |
| 7 | Spark ignition   | in process...  |
| 8 | Throttle         | in process...  |


## 4. Main function description

### 4.1. Params description

Below you can see the list of existing parameters.

![parameters](parameters.png?raw=true "parameters")

In the tables below you can see a detailed description of such parameters.

**Fuel tank parameters**

| № | Parameter name       | Description  |
| - | -------------------  | ------------ |
| 1 | fuel_tank_pub_period | Period between fuel tank message publication |
| 2 | fuel_tank_pub_min_press | Calibration value of diff pressure corresponded 0% of fuel tank |
| 3 | fuel_tank_pub_max_press | Calibration value of diff pressure corresponded 100% of fuel tank |

**Spark ignition parameters**

| № | Parameter name         | Description  |
| - | ---------------------- | ------------ |
| 4 | spark_ignition_offset  | If raw command more than that value, spark ignition will be turned on, otherwise turned off |
| 5 | spark_ignition_ch/mode | Index of RawCommand channel; -1 means disable this feature |
| 6 | spark_ignition_min     | Deprecated. PWM duration corresponded to turned off state |
| 7 | spark_ignition_max     | Deprecated. PWM duration corresponded to turned on state |
| 8 | spark_ignition_default | Deprecated. PWM duration corresponded to state when there is no RawCommand for last half-second |

**Starter parameters**

| № | Parameter name                | Description  |
| - | ----------------------------- | ------------ |
| 9 | starter_offset                | If raw command more than that value, spark ignition will be turned on, otherwise turned off |
| 10| starter_ch/mode               | Index of RawCommand channel; -1 means disable this feature |
| 11| starter_min_rpm_treshold      | Starter might be turned on only if rpm less then that value |
| 12| starter_max_rpm_treshold      | Deprecated |
| 13| starter_try_duration          | Starter algorithm parameter sets the period during which the starter will try to run the engine |
| 14| starter_delay_before_next_try | Starter algorithm parameter sets the period during which the starter will wait before next try |

**ESC status publication paramters**
| № | Parameter name | Description  |
| - | -------------- | ------------ |
| 15| esc_pub_period | Period between EscStatus publication. It has info about starter voltage and current |
| 16| esc_index      | Index of corresponded EscStatus message; -1 means disable publication |

**Throttle**
| № | Parameter name   | Description  |
| - | ---------------- | ------------ |
| 17| throttle_ch/mode | Index of RawCommand channel; -1 means disable this feature |
| 18| throttle_min     | PWM duration corresponded to RawCommand=0 |
| 19| throttle_max     | PWM duration corresponded to RawCommand=8191 |
| 20| throttle_default | PWM duration corresponded to RawCommand < 0 or when there is no RawCommand for last half second |

### 4.2. RPM measurement algorithm

2 types of RPM measurement algorithms and filtration are implemented.



```
Old algorithm:
Using interrupts and input capture it remembers the time when last and previous impulses were captured.
Every 10 ms it calculates the frequency of impulses using current and previous time and puts this value to some ring buffer with size 20.
Every 100 ms it gets median value from this buffer and publishes `esc_status` uavcan msg. This frequency and `esc index` can be modified using parameters.
```

### 4.3. Engine controlling algorithm

The engine is controlled using `starter`, `ignition` and `throttle` are used to control the engine. They all use `RawCommand` as a control input.

1. The throttle state is directly controlled by RawCommand. It means that the input command value is one-to-one mapped into PWM duration. The lower and higher borders of duration are defined in corresponding parameters.
2. The engine ignition has 2 states. When it is enabled it has max pwm duration, else it has min duration. The value of RawCommand of the corresponding channel is higher than some offset means enabled. You can set up offset in parameters.
3. The starter has 2 states like ignition but the logic is a little different. If the input channel value is greater than offset, it will perform an attempt to run an engine with a duration up to a certain time. If an attempt is unsuccessful, it will turn off for a certain time (to signalize that it's unsuccessful), and then try again. If the median speed for last second is greater than some certain value it will stop attempts. Durations and offsets can be set up in parameters.

In any way, if the last RawCommand with corresponding channel value message is received more than 2 seconds ago, all states of controlled devices will be switched to default.

## 5. Auxiliary functions description

(in progress)

## 6. Led indication

- when the starter is enabled, led is on
- when the starter is disabled, led is off

## 7. Usage example on a table

(in progress)

## 8. UAV usage example

This node has been successfully tested on VTOL. Here is an example of RPM and RawCommand values collected from one of the flight logs.

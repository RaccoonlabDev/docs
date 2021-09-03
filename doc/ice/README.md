# internal combustion engine

This board is dedicated for controlling the internal combsution engine.

It to map particular channels of [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) messages into 3 control signals:
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

This node interracts with following messages:

| № | type      | message  |
| - | --------- | -------- |
| 1 | subscriber | [uavcan.equipment.esc.RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) |
| 2 | publisher   | [uavcan.equipment.ice.reciprocating.Status](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#status-4) |
| 3 | publisher   | [uavcan.equipment.ice.FuelTankStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#fueltankstatus) |

Beside required and hightly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports following application level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | service consumer | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | service consumer   | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | service consumer   | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Hardware specification

(in process)

## 3. Wire

(in process)

It also has SWD socket that is dedicated for updating firmware using [programmer-sniffer](doc/programmer_sniffer/README.md) device.

## 4. Main function description

### 4.1. Params description

Below you can see the list of existance parameters.

![parameters](parameters.png?raw=true "parameters")

### 4.2. RPM measurement algorithm

```
Old algorithm:
Using interrupts and input capture it remembers the time when last and previous impulses were captured.
Every 10 ms it calculates the frequncy of impulses using current and previous time and put this value to some ring buffer with size 20.
Every 100 ms it gets median value from this buffer and publishes `esc_status` uavcan msg. This frequency and `esc index` can be modified using parameters.
```

### 4.3. Engine controlling algorithm

The engine is controlled using `starter`, `ignition` and `throttle` are used to control engine. They all use `RawCommand` as control input.

1. The throttle state is directly controlled by RawCommand. It means that input command value is one-to-one mapped into pwm duration. The lower and higher borders of duration are defined in corresponding parameters.
2. The engine ignition has 2 states. When it is enabled it has max pwm duration, else it has min duration. The value of RawCommand of corresponding channel higher than some offset means enabled. You can setup offset in parameters.
3. The starter has 2 states like ignition but logic is a little different. If input channel value is greater than offset, it will perform an attempt to run engine with duration up to certain time. If attempt is unsuccessful, it will turn off for certain time (to signalize that it's unsuccessful), and then try again. If median speed for last second is greater than some certain value it will stop attempt. Durations and offsets can be setup in parameters.

In any way, if last RawCommand with corresponding channel value message is received more than 2 seconds ago, all states of controlled devices will be switched to default.

## 5. Auxiliary functions description

(in process)

## 6. Led indication

- when starter is enabled, led is on
- when starter is disabled, led is off

## 7. Usage example on a table

(in process)

## 8. UAV usage example

(in process)

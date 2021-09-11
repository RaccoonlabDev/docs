## uavcan_wifi_bridge

This board is a bridge between UAVCAN/CAN and UDP/WiFi.

![wifi_bridge](wifi_bridge.png?raw=true "wifi_bridge")

## Content
  - [1. UAVCAN interface](#1-uavcan-interface)
  - [2. Hardware specification](#2-hardware-specification)
  - [3. Wire](#3-wire)
  - [4. Main function description](#4-main-function-description)
  - [5. Auxiliary functions description](#5-auxiliary-function-description)
  - [6. Led indication](#6-led-indication)
  - [7. Usage example on a table](#7-usage-example-on-a-table)
  - [8. UAV usage example](#8-uav-usage-example)
  - [9. Performance tests](#9-performance-tests)


## 1. UAVCAN interface

This node doesn't send any messages and subscribes on all of them.

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

(in process)

## 4. Main function description

This node is suitable for remote configuration UAVCAN network nodes or logging data stream.

![params](params.png?raw=true "params")

## 5. Auxiliary functions description

(none)

## 6. Led indication

This board has 2 leds. One in dedicated for STM32 microcontroller, another one is for EPS8266.

Both leds that allows you to understand possible problems. They blink from 1 to 5 times for 2 seconds, then waits for 2 seconds. By counting number of blinks you can define the code of current status.

STM32 blinks meaning:

| Number of blinks | Uavcan helth   | Description                     |
| ---------------- | -------------- | ------------------------------- |
| 1                | OK             | UART and CAN are receiving and working |
| 2                | WARNING        | There is no RX data from uart |
| 3                | WARNING        | There is no RX data from CAN |
| 4                | WARNING        | There is no RX data at all |
| 5                | CRITICAL       | There is a problem on periphery initialization level. Probably you load wrong firmware. |

## 7. Usage example on a table

(in process)

## 8. UAV usage example

(in process)

## 9. Performance tests

At that moment this board supports stream up to 1200 messages per second. This limit will be increased soon after some optimization.

![frames_rate](frames_rate.png?raw=true "frames_rate")

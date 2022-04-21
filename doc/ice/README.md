# UAVCAN Internal Combustion Engine node

This board is dedicated to controlling an internal combustion engine such as [DLE-20](http://rcstv.ru/static/fileunit/107b61373aea5dbedd58c2029d3c781fe909c3d9/DLE%2020%20Hobbico%20Manual%20Best.pdf) or [DLE-35](http://manuals.hobbico.com/dle/dleg0435-manual.pdf) using Electronic Ignition Module.

Based on input command [RawCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#rawcommand) it activates ignition, starts a starter to run the engine and turn the starter off when the internal combustion engine is working. It measures several engine parameters such as engine rotation speed and sends it to UAVCAN network as [uavcan.equipment.ice.reciprocating.Status](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#status-4) message. It also might be equipped with fuel tank sensor based on differential pressure sensor, so the node will send [uavcan.equipment.ice.FuelTankStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#fueltankstatus) message.

![starter](starter.png?raw=true "starter")

## Content

  - [1. UAVCAN interface](#1-uavcan-interface)
  - [2. Hardware specification](#2-hardware-specification)
  - [3. Wire](#3-wire)
  - [4. Main function description](#4-main-function-description)
    - [4.1. Gas throttle](#41-gas-throttle)
    - [4.2. Spark Ignition](#42-spark-ignition)
    - [4.3. Starter](#43-starter)
    - [4.4. RPM measurement](#44-rpm-measurement)
    - [4.5. Kill switch](#45-kill-switch)
  - [5. Auxiliary functions description](#5-auxiliary-function-description)
    - [5.1. Circuit status](#51-circuit-status)
    - [5.2. Node info](#52-node-info)
    - [5.3. Log messages](#53-log-messages)
    - [5.4. Watchdog](#54-watchdog)
  - [6. Parameters](#6-parameters)
    - [6.1. Common parameters](#61-common-parameters)
    - [6.2. Spark ignition](#62-spark-ignition)
    - [6.3. Starter](#63-starter)
    - [6.4. ESC status](#64-esc-status)
    - [6.5. Throttle](#65-throttle)
    - [6.6. Circuit status](#66-circuit-status)
  - [7. Led indication](#7-led-indication)
  - [8. Debugging on a table](#8-debugging-on-a-table)
  - [9. PX4 integration](#9-px4-integration)


## 1. UAVCAN interface

This node interacts with the following messages:

| № | type      | message  |
| - | --------- | -------- |
| 1 | subscriber | [uavcan.equipment.esc.RawCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#rawcommand) |
| 2 | publisher   | [uavcan.equipment.ice.reciprocating.Status](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#status-4) |
| 3 | publisher   | [uavcan.equipment.ice.FuelTankStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#fueltankstatus) |

Besides required and highly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports the following application-level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Hardware specification

(in progress)

## 3. Wire

This board has 4 connectors which may deliver a power to this device. They are described in the table below.

| № | Connector | Description |
| - | --------- | ----------- |
| 1 | Power socket (XT30) | This board consumes more power than a typical UAVCAN node, so it is powered using an additional socket. |
| 2 | UCANPHY Micro (JST-GH 4) | Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal. Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not exceed 1 A per connector. |
| 3 | 6-pin Molex  ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670), [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Contacts support up to 100 V, 2 A per contact. But the board may work only with 2S-6S. |
| 4 | SWD | STM32 firmware updating using [programmer-sniffer](doc/programmer_sniffer/README.md). |

It also has following board-specific connectors:

| № | Connector        | Description     |
| - | ---------------- | --------------- |
| 5 | Fuel tank sensor based on MS4525DO | i2c             |
| 6 | Starter          | GPIO output pin |
| 7 | Spark ignition   | GPIO output pin |
| 8 | Throttle (pin 3) | PWM with frequency 50 Hz and duration from 900 to 2000   |
| 8 | RPM sensor (pin 6) | Input capture |

## 4. Main function description

On the input the node has [RawCommand](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#rawcommand) message.

The node conrols 3 devices: `Starter`, `Spark Ignition` and `Gas Throttle`. The control of these devices is performed in their own task, it means their logic are independed from each other.

Internally, the node has a safety mechanism called kill-switch. If the setpoint is not appear for 2 seconds, it will automatically change the state of each devices to default.

### 4.1. Gas throttle

Gas throttle is responsible for thrust created by an engine. The output PWM is linearly controlled by RawCommand. The lower and higher borders of duration are defined in corresponding parameters. Check correponded parameters in the section [6.5. Throttle](#65-throttle).

### 4.2. Spark Ignition

Spark Ignition allows to enable or disable engine. It is controlled by a simple GPIO output pin that has 2 states. If the value of RawCommand of the corresponding channel is higher than some offset, it will be enabled. Otherwise it will be disabled. Check correponded parameters in the section [6.2. Spark ignition](#62-spark-ignition).

### 4.3. Starter

Starter allows to automatically run an engine. It is implemented as GPIO output pin, so it has 2 states. If the input channel value is greater than the offset, it will perform an attempt to run an engine with a duration up to a certain time. If an attempt is unsuccessful, it will turn off for a certain time (to signalize that it's unsuccessful), and then try again. If the median speed for last second is greater than some certain value it will stop attempts. Durations and offsets can be set up in parameters. Check correponded parameters in the section [6.3. Starter](#63-starter)

### 4.4. RPM measurement

This sensor is based on hall-sensor. It counts the number of impulses for the last short period of time, filtrate the data, fills the [uavcan.equipment.ice.reciprocating.Status](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#status-4) message and sends it.

### 4.5. Kill switch

For the safety reasons, if there is no RawCommand for last 0.5 seconds, the node will set all controlled values to the default states. It means, that that Starter will be turned off, Spark Ignition will be disabled and Gas Throttle will be in the default possition according to the specified in parameters value. 


## 5. Auxiliary functions description

### 5.1. Circuit status

This node as well as any other our nodes measure `5V` and `Vin` voltages and send them in 2 [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) messages.

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

### 5.2. Node info

Every firmware store following info that might be received as a response on NodeInfo request. It stores:
- software version,
- an unique identifier.

![node_info](node_info.png?raw=true "node_info")

### 5.3. Log messages

(will appear in further versions of software)

### 5.4. Watchdog

The node constantly performs updating watchdog values. If update is not happed for at least 0.5 seconds, it cause a hardware reset of microcontoller. This feature allows a node to leave a hang state if it is happend.

## 6. Parameters

Below you can see a picture from `gui_tool` with a whole list of parameters.

![parameters](parameters.png?raw=true "parameters")

All paramters are divided into several groups. Their description is provided in the tables balow.

### 6.1. Common parameters

Following parameters are common for any nodes.

| № | Parameter name | Reboot required | Description  |
| - | -------------- | --------------- | ------------ |
| 0 | ID             | true            | Node ID      |
| 20| err            | false           | If something unexpected goes wrong, the node writes code of occured error into this value, save it and reboot. The node will continue to function, but it will keep ERROR status until this value is manually cleared. Normally, this value should be always zero. If it is not, you may contact us. |
| 21| name           | true            | Unused. Reserved. In future the node name will might be configurated using this parameter. |

### 6.2. Spark ignition

| № | Parameter name        | Reboot required | Description  |
| - | --------------------- | --------------- | ------------ |
| 1 | spark_ignition_offset | false           | If raw command more than that value, spark ignition will be turned on, otherwise turned off |
| 2 | spark_ignition_ch     | false           | Index of RawCommand channel; -1 means disable this feature |

### 6.3. Starter

| № | Parameter name                | Reboot required | Description  |
| - | ----------------------------- | --------------- | ------------ |
| 3 | starter_offset                | false           | If RawCommand more than that value, spark ignition will be turned on, otherwise turned off |
| 4 | starter_ch                    | false           | Index of RawCommand channel; -1 means disable this feature |
| 5 | starter_rpm_treshold          | false           | Starter might be turned on only if rpm less then that value |
| 6 | starter_try_duration          | false           | Period in milliseconds during which the starter will try to run the engine |
| 7 | starter_delay_before_next_try | false           | Period in milliseconds during which the starter will wait between attempts |

### 6.4. ESC status

| № | Parameter name | Reboot required | Description  |
| - | -------------- | --------------- | ------------ |
| 8 | esc_pub_period | false           | Period between EscStatus publication. It has info about starter voltage and current |
| 9 | esc_index      | false           | Index of corresponded EscStatus message; -1 means disable publication |

### 6.5. Throttle

| № | Parameter name   | Reboot required | Description  |
| - | ---------------- | --------------- | ------------ |
| 10| throttle_ch      | false           | Index of RawCommand channel; -1 means disable this feature |
| 11| throttle_min     | false           | PWM duration corresponded to RawCommand=0 |
| 12| throttle_max     | false           | PWM duration corresponded to RawCommand=8191 |
| 13| throttle_default | false           | PWM duration corresponded to RawCommand < 0 or when there is no RawCommand for last half second |

### 6.6. Circuit status

| № | Parameter name   | Reboot required | Description  |
| - | ---------------- | --------------- | ------------ |
| 14| enable_5v_check  | false           | Set ERROR status if 5V voltage is out of range 4.5 - 5.5 V |
| 15| enable_vin_check | false           | Set ERROR status if Vin voltage is less than 4.5 V |

## 7. Led indication

- when the starter is enabled, led is on
- when the starter is disabled, led is off

## 8. Debugging on a table

(in progress)

## 9. PX4 integration

This node has been successfully tested on VTOL. Here is an example of RPM and RawCommand values collected from one of the flight logs.

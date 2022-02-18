## UAVCAN Airspeed node

This board is a wrapper under [MS4525DO airspeed sensor](https://www.te.com/commerce/DocumentDelivery/DDEController?Action=showdoc&DocId=Data+Sheet%7FMS4525DO%7FB2%7Fpdf%7FEnglish%7FENG_DS_MS4525DO_B2.pdf%7FCAT-BLPS0002) that allows to use it through the UAVCAN network.

It reads measurements from the sensor via i2c and publishes temperature and differential pressure.

![airspeed](airspeed.png?raw=true "airspeed")

## Content
  - [1. UAVCAN interface](#1-uavcan-interface)
  - [2. Hardware specification](#2-hardware-specification)
  - [3. Wire](#3-wire)
  - [4. Main function description](#4-main-function-description)
  - [5. Auxiliary functions description](#5-auxiliary-function-description)
  - [6. Parameters](#6-parameters)
  - [7. Led indication](#7-led-indication)
  - [8. Usage example on a table](#8-usage-example-on-a-table)
  - [9. UAV usage example](#9-uav-usage-example)

## 1. UAVCAN interface

This node sends the following messages with fixed rate:

| № | type      | message  |
| - | --------- | -------- |
| 1 | publisher   | [uavcan.equipment.air_data.RawAirData](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawairdata) |
| 2 | publisher   | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) |

Beside required and highly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports the following application-level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Hardware specification

![airspeed_scheme](airspeed_scheme.jpg?raw=true "airspeed_scheme")

## 3. Wire

This board has 3 connectors which are described in the table below.

| № | Connector | Description |
| - | --------- | ----------- |
| 1 | UCANPHY Micro (JST-GH 4) | Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal. Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not exceed 1 A per connector. |
| 2 | 6-pin Molex  ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670), [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | This wire supports up to 100 V, 2 A per contact, but board's DC-DC is limited by 60V. We recommend using no more than 30V on this bus. |
| 3 | SWD | STM32 firmware updating using [programmer-sniffer](doc/programmer_sniffer/README.md). |

## 4. Main function description

This node measures differential pressure and temperature with high rate (100 Hz by default) and publishes averaged data with a low rate (10 Hz should be enough for PX4 Autopilot otherwise it will anyway perform average filter). Publication and measurement rates might be configured using node parameters, but it is recommended to use default values.

According to [MS4525DO datasheet](https://www.te.com/commerce/DocumentDelivery/DDEController?Action=showdoc&DocId=Data+Sheet%7FMS4525DO%7FB2%7Fpdf%7FEnglish%7FENG_DS_MS4525DO_B2.pdf%7FCAT-BLPS0002), the sensor has the following range of measured data:
- differential pressure is from -1 psi to +1 psi or from -6894.757 pa to +6894.757 pa.
- temperature is from -50 to +150 Celcius or from 223 to 423 Kelvin.

If we consider temperature ~288 Kelvin and pressure 101325 Pa according to the ISA model differential pressure interval above should be enough for up to 100 m/sec airspeed that is suitable for a wide area of small VTOL application.


## 5. Auxiliary functions description

**Circuit status**

It sends 2 [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) messages with measured `5V` and `Vin`.

The first message has `circuit_id=NODE_ID*10 + 0` and following 2 significant fields:
1. voltage - is the `5V` voltage
2. error_flags - might have `ERROR_FLAG_OVERVOLTAGE` or `ERROR_FLAG_UNDERVOLTAGE` or non of them

The second message has `circuit_id=NODE_ID*10 + 1` and following 2 significant fields:
1. voltage - is the `Vin` voltage
2. error_flags - `ERROR_FLAG_UNDERVOLTAGE` or non of them. There is no `ERROR_FLAG_OVERVOLTAGE` flag because the expected max `Vin` voltage is unknown.

**Calibration**

By setting `airspeed_calib_request` parameter to 1 the node goes into the calibration mode for 10 seconds where it summarizes all measured differential pressures and in the end divides the sum by the number of measurements. The negative resulted averaged value is written into the `airspeed_calibration_offset` parameter. This offset is added to the differential pressure of each measurement. During the calibration process, the node has `INITIALIZATION` mode. After the initialization process, the node doesn't save parameters to the flash memory, you need to do it manually.
As an alternative, you may always manually set `airspeed_calibration_offset` parameter.

```
Note. Using params to start the calibration process is not the best solution. But this is the only way to start it from the QGC side. Current PX4 supports only centralized calibration on the autopilot side.
```

**Enable/disable**

This function allows you to start and stop publishing via UAVCAN in real-time without physical disconnect.

**Software version**

`GetNodeInfo` response contains a software version that allows you to differentiate one firmware from another. See `Node Properties` window in `uavcan gui tool`.

**Hardware version**

Not implemented yet.

**Hardware unique ID**

GetNodeInfo response contains hardware unique ID that allows you to differentiate one board from another. See `Node Properties` window in `uavcan gui tool`.


## 6. Parameters

The list of parameters is shown in the picture below:

![scheme](airspeed_params.png?raw=true "scheme")

| № | Param name   | Description |
| - | ------------ | ----------- |
| 0 | ID           | You should manually choose the node ID. On the bus, a few nodes with the same ID should not exist. |
| 1 | airspeed_enable | 0 - disable data publication, 1 - enable |
| 2 | airspeed_pub_period | Period of message publication |
| 3 | airspeed_measurement_period | Period of data measurement |
| 4 | airspeed_calibration_offset | The published differential pressure = measured pressure + this offset |
| 5 | airspeed_calibration_request | Automatic calibration request. See this feature description for details. |
| 6 | enable_5v_check | Set ERROR status if 5V voltage is out of range 4.5 - 5.5 V |
| 7 | enable_vin_check | Set ERROR status if Vin voltage is less than 4.5 V |
| 8 | name | If specified value != 0, use custom node name. There are no custom names yet, but it might be extended if you need it. |
| 9 | live_minutes | Not implemented yet. |

## 7. Led indication

There is an internal led that may allow you to understand possible problems. It blinks from 1 to 10 times within 4 seconds. By counting a number of blinks you can define the current status of the node.

| Number of blinks | Uavcan health   | Description                     |
| ---------------- | -------------- | ------------------------------- |
| 1                | OK             | Everything is ok.                |
| 2                | OK             | There is no RawCommand at least for the last 0.5 seconds (it's ok, just in case). |
| 3                | WARNING        | This node can't see any other nodes in UAVCAN network, check your cables. |
| 4                | ERROR          | There is a problem with circuit voltage, look at the circuit status message to get details. It may happen when you power it from SWD since it has only 3.3 V, otherwise, be careful with the power supply. This check might be turned off using params. |
| 5                | CRITICAL       | There is a problem with the periphery initialization level. Probably you load the wrong firmware. |


## 8. Usage example on a table

You may initially try this device on a table using [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool). You can check the message sent by this node.

Here you can see an example of a message when a device is on a table and there is no wind.

![scheme](airspeed_message.png?raw=true "scheme")

And plot created in the same conditions:

![airspeed_plot](airspeed_plot.png?raw=true "airspeed_plot")

Here we have an offset in measurements. It might be calibrated during the calibration process.

## 9. UAV usage example

This node has been tested several times on the VTOL application.

**PX4 Parameters setting before usage**

Normally, to use it with your PX4-based Autopilot you need to set up the following parameters:
- `UAVCAN_ENABLE`,
- `UAVCAN_SUB_ASPD` (since 1.13.1).
It is also recommended to set up `ASPD_DO_CHECKS`.

**Node parameters setup using QGC**

At that moment the best way to set up the node parameters is to use `MAVLink console`.

By typing `uavcan status` in MAVLink console you should be able to see this device.

To perform calibration on the sensor side from QGC you should type:
1. `uavcan param list 74` - check is calibration feature is supported
2. `uavcan param set 74 airspeed_calib_request 1` to start calibration
3. `uavcan param save 74` - to save new calibration parameters.

![airspeed_qgc](airspeed_qgc.png?raw=true "airspeed_qgc")

Here 74 is our node id. It has a calibration offset -69.

After that, the node is ready for use.

**Flight log example**

Here you may see the screenshot from the log from the real flight in FW mode.

![px4_log_airspeed_2021_11_12](px4_log_airspeed_2021_11_12.png?raw=true "px4_log_airspeed_2021_11_12")

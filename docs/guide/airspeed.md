# UAVCAN Airspeed node

This board is a wrapper under [MS4525DO airspeed sensor](https://www.te.com/commerce/DocumentDelivery/DDEController?Action=showdoc&DocId=Data+Sheet%7FMS4525DO%7FB2%7Fpdf%7FEnglish%7FENG_DS_MS4525DO_B2.pdf%7FCAT-BLPS0002) that allows to use it through the UAVCAN network.

It reads measurements from the sensor via i2c and publishes temperature and differential pressure.

![airspeed](../../assets/airspeed/airspeed.png?raw=true "airspeed")

## 1. UAVCAN interface

This node sends the following messages with fixed rate:

| № | type      | message  |
| - | --------- | -------- |
| 1 | publisher   | [uavcan.equipment.air_data.RawAirData](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#rawairdata) |
| 2 | publisher   | [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) |

Beside required and highly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports the following application-level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Hardware specification

![airspeed_scheme](../../assets/airspeed/airspeed_scheme.jpg?raw=true "airspeed_scheme")

## 3. Wire

This board has 3 connectors which are described in the table below.

| № | Connector | Description |
| - | --------- | ----------- |
| 1 | UCANPHY Micro (JST-GH 4) | Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal. Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not exceed 1 A per connector. |
| 2 | 6-pin Molex  ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670), [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | This wire supports up to 100 V, 2 A per contact, but board's DC-DC is limited by 60V. We recommend using no more than 30V on this bus. |
| 3 | SWD | STM32 firmware updating using [programmer-sniffer](docs/guide/programmer_sniffer/README.md). |

## 4. Main function description

This node measures differential pressure and temperature with high rate (100 Hz by default) and publishes averaged data with a low rate (10 Hz should be enough for PX4 Autopilot otherwise it will anyway perform average filter). Publication and measurement rates might be configured using node parameters, but it is recommended to use default values.

According to [MS4525DO datasheet](https://www.te.com/commerce/DocumentDelivery/DDEController?Action=showdoc&DocId=Data+Sheet%7FMS4525DO%7FB2%7Fpdf%7FEnglish%7FENG_DS_MS4525DO_B2.pdf%7FCAT-BLPS0002), the sensor has the following range of measured data:
- differential pressure is from -1 psi to +1 psi or from -6894.757 pa to +6894.757 pa.
- temperature is from -50 to +150 Celcius or from 223 to 423 Kelvin.

If we consider temperature ~288 Kelvin and pressure 101325 Pa according to the ISA model differential pressure interval above should be enough for up to 100 m/sec airspeed that is suitable for a wide area of small VTOL application.


## 5. Auxiliary functions description

### 5.1. Circuit status

It sends 2 [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) messages with measured `5V` and `Vin`.

The first message has `circuit_id=NODE_ID*10 + 0` and following 2 significant fields:
1. voltage - is the `5V` voltage
2. error_flags - might have `ERROR_FLAG_OVERVOLTAGE` or `ERROR_FLAG_UNDERVOLTAGE` or non of them

The second message has `circuit_id=NODE_ID*10 + 1` and following 2 significant fields:
1. voltage - is the `Vin` voltage
2. error_flags - `ERROR_FLAG_UNDERVOLTAGE` or non of them. There is no `ERROR_FLAG_OVERVOLTAGE` flag because the expected max `Vin` voltage is unknown.

### 5.2. Calibration

Each differential pressure device has an offset in his measurement and requires a calibration before usage.

There are 2 ways how can you do a calibration:
1. Normally, an autopilot may perfrorm his own calibration of this device. For example, PX4 stores `SENS_DPRES_OFF` calibration parameter in flash adds his value to each measurement from a differential pressure device before converting it to an airspeed. This way might be preffered for a normal user.
2. Alternativelly, for example, if your autopilot doesn't support such calibration, you may perform internal calibration on the node side using uavcan parameters (see [5.2. Calibration](#52-calibration)). This also might be the only possible solution in case if your autopilot doesn't support individual calibration for each differential pressure sensor (PX4 stores a single parameter for all differential pressure devices).

**Calibration on the node side**

In general, calibration is done using 2 parameters:
- `airspeed_calibration_offset` is used for storing an offset in flash memory
- `airspeed_calib_request` is used for sending a request to start an automaticall calibration.

By setting `airspeed_calib_request` parameter to 1 the node goes into the calibration mode for 10 seconds where it summarizes all measured differential pressures and in the end divides the sum by the number of measurements. The negative resulted averaged value is written into the `airspeed_calibration_offset` parameter. This offset is added to the differential pressure of each measurement. During the calibration process, the node has `INITIALIZATION` mode. After the initialization process, the node doesn't save parameters to the flash memory, you need to do it manually.
As an alternative, you may always manually set `airspeed_calibration_offset` parameter.

### 5.3. Enable/disable

This function allows you to start and stop publishing via UAVCAN in real-time without physical disconnect.

### 5.4. Software version

`GetNodeInfo` response contains a software version that allows you to differentiate one firmware from another. See `Node Properties` window in `uavcan gui tool`.

### 5.5. Hardware version

Not implemented yet.

### 5.6. Hardware unique ID

GetNodeInfo response contains hardware unique ID that allows you to differentiate one board from another. See `Node Properties` window in `uavcan gui tool`.


## 6. Parameters

The list of parameters is shown in the picture below:

![scheme](../../assets/airspeed/airspeed_params.png?raw=true "scheme")

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

A good way to get familiar with this device is to try it on the table using [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool).

Below you can see an example of a message when a device is on a table and there is no wind.

![airspeed_message](../../assets/airspeed/airspeed_message.png?raw=true "airspeed_message")

You can create a real-time plot with raw sensor data. Here it is:

![airspeed_plot](../../assets/airspeed/airspeed_plot.png?raw=true "airspeed_plot")

As you can see on the plot, the measurement has an offset. Here it is ~76 Pascal. Although this offset may lead to wrong airspeed estimation on the autopilot level, there are few ways how can you take it into account. See [5.2. Calibration](#52-calibration) for details.

### 8.1. Calibration using gui_tool

Calibration might be started using `uavcan_gui_tool`. The alrorithm is following:
1. Open a `Node Properties` window (the same as on picrure in [6. Parameters](#6-parameters))
2. Set `airspeed_calibration_request` parameter to 1
3. The node will go ibto `INITIALIZATION` mode for 10 second. You will see ib on main window
4. When a node go into `OPERATION` mode, you need to press `Store all` button to save a calibration parameter.
5. (optional) Reboot the device to be sure that the calibration offset is saved successfully.

The calibration is done and device is ready for usage.

## 9. UAV usage example

This node has been tested several times on the VTOL application with autopilot based on PX4 (custom version based on 1.12).

```
!!!PX4 usage issue!!!
All current stable versions (1.12.*) have a bug with wrong filter settings for uavcan differential pressure sensor reported [in this issue](https://github.com/PX4/PX4-Autopilot/issues/18151).
This bug is well described and ways of how to fixe it are suggested here.
Moremore, the fix is made on master branch and it is most probably that it will appear in further 1.13 version.
For those who is based on 1.12.* version, it is might be an option to make a small (few lines) fix in your custom firmware and it will be fine.
```

### 9.1. PX4 Parameters

Normally, to use it with your PX4-based Autopilot you need to set up the following parameters:
- `UAVCAN_ENABLE`,
- `UAVCAN_SUB_ASPD` (since 1.13.1),
- `ASPD_DO_CHECKS` (recommended, but is not necessary),
- `SENS_DPRES_OFF` (this value is added to every differential pressure measurement before airspeed estimation; PX4 calibration process automatically write to this parameter)

### 9.2. QGC node monitoring

Typically, during the first usage, it is recommended play with this node using  `MAVLink console` by typing few simple commands:
- `uavcan status` allows you to see the list of online nodes. You should be able to see this node.
- `listener differential_pressure` returns the raw value of the sensor
- `uorb top differential_pressure` returns the publish rate of the sensor
- `listener airspeed` will output the airspeed estimated by this node

### 9.3. Calibration using QGC

As in said in [5.2. Calibration](#52-calibration) there are 2 ways of calibration process. Here is described how to perform calibration of this node using QGC.

To perform calibration on the sensor side from QGC you should type:
1. `uavcan param list 74` - check is calibration feature is supported
2. `uavcan param set 74 airspeed_calib_request 1` to start calibration
3. `uavcan param save 74` - to save new calibration parameters.

![airspeed_qgc](../../assets/airspeed/airspeed_qgc.png?raw=true "airspeed_qgc")

Here 74 is our node id. It has a calibration offset -69.

After that, you need to manually write 0 to `SENS_DPRES_OFF` parameter.

### 9.4. Flight log example

Here you may see the screenshot from the log from the real flight in FW mode.

![px4_log_airspeed_2021_11_12](../../assets/airspeed/px4_log_airspeed_2021_11_12.png?raw=true "px4_log_airspeed_2021_11_12")

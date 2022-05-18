# UAVCAN Gps+Mag+Baro node

This board has 3 types of sensors:

1. GNSS module: [u-blox 8](https://www.u-blox.com/en/product/max-8-series)
2. Barometer: [BMP280](https://cdn-shop.adafruit.com/datasheets/BST-BMP280-DS001-11.pdf)
3. Magnetometers: [RM3100](https://ekb.terraelectronica.ru/pdf/show?pdf_file=%252Fds%252Fpdf%252FR%252FRM3100.pdf) and/or [HMC5883L](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf)

![gps_mag_baro](../../assets/gps_mag_baro/gps_mag_baro.png?raw=true "gps_mag_baro")

## 1. UAVCAN interface

This node interacts with the following messages:

| № | type      | message  |
| - | --------- | -------- |
| 1 | publisher   | [uavcan.equipment.gnss.Fix](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#fix) |
| 2 | publisher   | [uavcan.equipment.air_data.StaticPressure](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#staticpressure) |
| 3 | publisher   | [uavcan.equipment.air_data.StaticTemperature](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#statictemperature) |
| 4 | publisher   | [uavcan.equipment.ahrs.MagneticFieldStrength](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#magneticfieldstrength) |
| 5 | publisher   | [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) |

Besides required and highly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports the following application-level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Hardware specification

(in progress)

UAVCAN-PWM mini scheme:

![scheme](../../assets/gps_mag_baro/scheme.png?raw=true "scheme")

## 3. Wire

This board has 3 connectors which are described in the table below.

| № | Connector | Description |
| - | --------- | ----------- |
| 1 | UCANPHY Micro (JST-GH 4) | Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal. Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not exceed 1 A per connector. |
| 2 | 6-pin Molex  ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670), [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Contacts support up to 100 V, 2 A per contact. But the board may work only with 2S-6S. |
| 3 | SWD | STM32 firmware updating using [programmer-sniffer](docs/guide/programmer_sniffer/README.md). |

## 4. Main function description

This node primary has 3 features: GPS, magnetometer, and barometer. You may enable or disable any of them using the following UAVCAN parameters `gps_enable`, `mag_enable` and `baro_enable`.

Below you can see an illustration of how it may work in `uavcan_gui_tool`.

![gps_mag_baro](../../assets/gps_mag_baro/gps_mag_baro_msgs.png?raw=true "gps_mag_baro")

### 4.1. GNSS module

The node uses [u-blox 8](https://www.u-blox.com/en/product/max-8-series) GNSS module. It can work either with `NMEA` or [ublox](https://www.u-blox.com/sites/default/files/products/documents/u-blox8-M8_ReceiverDescrProtSpec_%28UBX-13003221%29.pdf) protocol. You may choose desired protocol using UAVCAN parameter `gnss_type`.

```
Note 1: nmea protocol is not tested well yet. Use ubx protocol instead.
```

```
Note 2: During ubx protocol mode, it parses only `UbxNavPvt` message becase it has all necessary information to fill it into Fix message. Turn off all other package.
```

```
Note 3: At this moment you need to manually set up the ublox module before usage.
```

**How to setup U-Blox NEO-M8N-0 bu UART**

- [Download](https://www.u-blox.com/en/product/u-center) and install u-center (not u-center 2).
- Connect to the module by UART at 9600 by default.
- Open View->Configuration view. Go to MSG (Messages), enable "01-07 NAV-PVT" at UART1, disable all other messages. Push "send" at hte bottom of the window to send command. Check that only NAV-PVT goes from the module by opening View->Messages View.
- Again go to Configuration view to PRT (Ports), change the Baudrate to 115200, "send" at the bottom.
- Reconnect to the device at the new baud rate.
- Go to Configuration view to RATE (Rates), set Measurement Period to 60 ms, "send" at the bottom.
- If everything ok, go to Configuration view to CFG (Configuration), select "Save current configuration", "send" at the bottom.

**About workflow**

It communicates with the GNSS module via UART and publishes [uavcan.equipment.gnss.Fix](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#fix). You may either set the default publish rate (the same as receiving) by setting `gps_frequency` to 0 or set any other fixed rate.

Below you can see an example of the `Fix` message.

![gps_msg](../../assets/gps_mag_baro/gps_msg.png?raw=true "gps_msg")

**Performance**

The raw GNSS-module needs 8.7 ms to send a UbxNavPvt package via uart (the baud rate is 115200, a package length is 100 bytes).

This board as a wrapper under GNSS-module needs ~12 ms to get this package via UART, process it and send to CAN-bus.

It means that the time overhead compared to raw module is only ~4ms.

### 4.2. Barometer

The node uses [BMP280](https://cdn-shop.adafruit.com/datasheets/BST-BMP280-DS001-11.pdf) barometer. Communication with the sensor is carried out using I2C. It publishes 2 messages:
- [uavcan.equipment.air_data.StaticPressure](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#staticpressure)
- [uavcan.equipment.air_data.StaticTemperature](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#statictemperature)

Control measurement settings:
- pressure oversampling is 8: high resolution, 19 bit / 0.33 Pa
- temperature oversampling is 8: 19 bit / 0.0006 °C
- the data rate is up to 50 Hz if standby time is less then 0.5 ms
- normal mode

![baro_msg](../../assets/gps_mag_baro/baro_msg.png?raw=true "baro_msg")

![baro_plot](../../assets/gps_mag_baro/baro_plot.png?raw=true "baro_plot")


### 4.3. Magnetometer

The node supports 2 types of magnetometers: [RM3100](https://ekb.terraelectronica.ru/pdf/show?pdf_file=%252Fds%252Fpdf%252FR%252FRM3100.pdf) and [HMC5883L](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf). You may choose the one you need at runtime using UAVCAN parameters.

Before the first measurement, this node performs initialization for the chosen magnetometer. Configuration settings are predefined in firmware and shown in the table below.

1. [HMC5883L](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf):
- i2c bus,
- Continuous-Measurement Mode with Normal measurement configuration,
- the measurement rate is 30 Hz (15 Hz is the default),
- adjustable publish rate up to 30 Hz using UAVCAN parameter,
- number of samples is 2 (1 is the default),
- the sensor field range is ± 1.3 Ga (by default), so digital resolution is 0.92 mG/LSb.

2. [RM3100](https://ekb.terraelectronica.ru/pdf/show?pdf_file=%252Fds%252Fpdf%252FR%252FRM3100.pdf)
- SPI bus
- Continuous Measurement Mode,
- the measurement rate is 75 Hz (37 Hz is the default),
- adjustable publish rate up to 75 Hz using UAVCAN parameter,
- cycle count is 200 (by default), so the gain is 75 LSB/µT, sensitivity is 13 nT,
- field Measurement Range is from -800 to +800 uT.

Both magnetometers publish [uavcan.equipment.ahrs.MagneticFieldStrength](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#magneticfieldstrength).

Below you may see an example of HMC5883L magnetometer raw data.

![mag_HMC5883L_msg](../../assets/gps_mag_baro/mag_HMC5883L_msg.png?raw=true "mag_HMC5883L_msg")

![mag_HMC5883L_plot](../../assets/gps_mag_baro/mag_HMC5883L_plot.png?raw=true "mag_HMC5883L_plot")

## 5. Auxiliary functions description

(in progress)

Also, it has external LEDs. They show the system state at this moment.

## 6. Parameters

The list of parameters is shown in the table below:

|Idx| Name             | Type    |Default| Min | Max | Desctiption |
| - | ---------------- | ------- | ----- | --- | --- | ----------- |
| 0 | ID               | integer | 71    | 0   | 100 | Node identifier |
| 1 | gps_enable       | integer | 1     | 0   | 1   | 0 means disable, 1 means enable gps |
| 2 | gps_type         | integer | 0     | 0   | 2   | 0 means ublox, 1 means nmea (not supported yet), 2 means ublox emulation (debug only) |
| 3 | gps_pub_period   | integer | 0     | 0   | 2000| 0 means publish whith receiving rate, 1-2000 means fixed rate in milliseconds |
| 4 | mag_enable       | integer | 1     | 0   | 1   | 0 means disable, 1 means enable magnetometer |
| 5 | mag_type         | integer | 0     | 0   | 1   | 0 means RM3100, 1 means HMC5883L |
| 6 | mag_pub_frequency| integer | 75    | 1   | 75  | Publish rate. Note that this value is actually limited be the sensor type (mag_type) |
| 7 | baro_enable      | integer | 1     | 0   | 1   | 0 means disable, 1 means enable barometer |
| 8 |baro_pub_frequency| integer | 50    | 1   | 50  | Publish rate |
| 9 | enable_5v_check  | integer | 1     | 0   | 1   | Set ERROR status if 5V voltage is out of range 4.5 - 5.5 V |
| 10| enable_vin_check | integer | 0     | 0   | 1   | Set ERROR status if Vin voltage is less than 4.5 V |
| 11| name             | integer | 0     | 0   | 100 | Custom name of the node. Might be implemented by request. |


## 7. Led indication

This board has an internal led that may allow you to understand possible problems. It blinks from 1 to 10 times within 4 seconds. By counting the number of blinks you can define the code of current status.

| Number of blinks | Uavcan health   | Description                     |
| ---------------- | -------------- | ------------------------------- |
| 1                | OK             | Everything is ok.                |
| 2                | OK             | There is no RawCommand at least for the last 0.5 seconds, PWM state is reset to the default state. |
| 3                | WARNING        | This node can't see any other nodes in the UAVCAN network, check your cables. |
| 4                | ERROR          | There is a problem with circuit voltage, look at the circuit status message to get details. It may happen when you power it from SWD, otherwise be careful with the power supply. |
| 5                | CRITICAL       | There is a problem with the periphery initialization level. Probably you load the wrong firmware. |

## 8. Usage example on a table

(in progress)

## 9. UAV usage example

(in progress)

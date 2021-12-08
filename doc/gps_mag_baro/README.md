## UAVCAN Gps + Magnetometer + Barometer node

This board has 3 types sensors:

1. GNSS module: [u-blox 8](https://www.u-blox.com/en/product/max-8-series)
2. Barometer: [BMP280](https://cdn-shop.adafruit.com/datasheets/BST-BMP280-DS001-11.pdf)
3. Magnetometers: [RM3100](https://ekb.terraelectronica.ru/pdf/show?pdf_file=%252Fds%252Fpdf%252FR%252FRM3100.pdf) and/or [HMC5883L](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf)

![gps_mag_baro](gps_mag_baro.png?raw=true "gps_mag_baro")

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

This node interracts with following messages:

| № | type      | message  |
| - | --------- | -------- |
| 1 | publisher   | [uavcan.equipment.gnss.Fix](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#fix) |
| 2 | publisher   | [uavcan.equipment.air_data.StaticPressure](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#staticpressure) |
| 3 | publisher   | [uavcan.equipment.air_data.StaticTemperature](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#statictemperature) |
| 4 | publisher   | [uavcan.equipment.ahrs.MagneticFieldStrength](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#magneticfieldstrength) |
| 5 | publisher   | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) |

Beside required and hightly recommended functions such as `NodeStatus` and `GetNodeInfo` this node also supports following application level functions:

| № | type      | message  |
| - | --------- | -------- |
| 1 | service consumer | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | service consumer   | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | service consumer   | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |

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

This node primary has 3 features: gps, magnetometer and barometer. You may enable or disable any of them using following UAVCAN parameters `gps_enable`, `mag_enable` and `baro_enable`.

Below you can see an illustration of how it may work in `uavcan_gui_tool`.

![gps_mag_baro](gps_mag_baro_msgs.png?raw=true "gps_mag_baro")

**1. GNSS module**

The node uses [u-blox 8](https://www.u-blox.com/en/product/max-8-series) gnss module. It can work either with `nmea` and [ublox protocol](https://www.u-blox.com/sites/default/files/products/documents/u-blox8-M8_ReceiverDescrProtSpec_%28UBX-13003221%29.pdf) protocol. You may choose desired protocol using UAVCAN parameter `gnss_type`.

During ubx protocol mode it parses only `UbxNavPvt` message.

```
Note 1: nmea protocol is not tested well yet. Use ubx protocol instead.
```

```
Note 2: At this moment you need to manually setup ublox module before usage.
```
**1.2. Setup U-Blox NEO-M8N-0**

[Download](https://www.u-blox.com/en/product/u-center) and install u-center (not u-center 2).

Connect to the module by UART at 9600 by default.

-Open View->Configuration view. Go to MSG (Messages), enable "01-07 NAV-PVT" at UART1, disable all other messages. Push "send" at hte bottom of the window to send command. Check that only NAV-PVT goes from module by opening View->Messages View.
-Again go to Configuration view to PRT (Ports), change the Baudrate to 115200, "send" at the bottom.
-Recoonect to device at new baudrate.
-Go to Configuration view to RATE (Rates), set Measurement Period to 60 ms, "send" at the bottom.
-If everything ok, go to Configuration view to CFG (Configuration), select "Save current configuration", "send" at the bottom.

**1.3 About workflow**
It communicates with gnss module via UART and publishes [uavcan.equipment.gnss.Fix](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#fix). You may either set default publish rate (the same as receiving) by setting `gps_frequency` to 0 or set any other fixed rate.

Below you can see an example of `Fix` message.

![gps_msg](gps_msg.png?raw=true "gps_msg")

**2. Barometer**

The node uses [BMP280](https://cdn-shop.adafruit.com/datasheets/BST-BMP280-DS001-11.pdf) barometer. Communication with sensor is carried out using I2C. It publishes 2 messages:
- [uavcan.equipment.air_data.StaticPressure](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#staticpressure)
- [uavcan.equipment.air_data.StaticTemperature](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#statictemperature)

Control meas settings:
- pressure oversampling is 8: high resolution, 19 bit / 0.33 Pa
- temperature oversampling is 8: 19 bit / 0.0006 °C
- data rate is up tp 50 hz if standy time less then 0.5 ms
- normal mode

![baro_msg](baro_msg.png?raw=true "baro_msg")

![baro_plot](baro_plot.png?raw=true "baro_plot")


**3. Magnetometer**

The node supports 2 types of magnetometers: [RM3100](https://ekb.terraelectronica.ru/pdf/show?pdf_file=%252Fds%252Fpdf%252FR%252FRM3100.pdf) and [HMC5883L](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf). You may choose the one you need at runtime using UAVCAN parameters.

Before first measurement this node performs initialization for choosen magnetometer. Configuration settings are predefined in firmware and shown in the table below.

1. [HMC5883L](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf):
- i2c bus,
- Continuous-Measurement Mode with Normal measurement configuration,
- measurement rate is 30 Hz (15 Hz is default),
- adjustable publish rate up to 30 Hz using UAVCAN parameter,
- number of samples is 2 (1 is default),
- sensor field range is ± 1.3 Ga (by default), so digital resolution is 0.92 mG/LSb.

2. [RM3100](https://ekb.terraelectronica.ru/pdf/show?pdf_file=%252Fds%252Fpdf%252FR%252FRM3100.pdf) and [HMC5883L](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf)
- SPI bus
- Continuous Measurement Mode,
- measurement rate is 75 Hz (37 Hz is default),
- adjustable publish rate up to 75 Hz using UAVCAN parameter,
- cycle count is 200 (by default), so gain is 75 LSB/µT, sensitivity is 13 nT,
- field Measurement Range is from -800 to +800 uT.

Both magnetometers publish [uavcan.equipment.ahrs.MagneticFieldStrength](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#magneticfieldstrength).

Below you may see an example of HMC5883L magnetometer raw data.

![mag_HMC5883L_msg](mag_HMC5883L_msg.png?raw=true "mag_HMC5883L_msg")

![mag_HMC5883L_plot](mag_HMC5883L_plot.png?raw=true "mag_HMC5883L_plot")

## 5. Auxiliary functions description

(in process)

Also it has external leds. They show the system state at this moment.

## 6. Parameters

(in process)

![gps_mag_baro_params](gps_mag_baro_params.png?raw=true "gps_mag_baro_params")

```
Note: actual publish frequency might be less than desired. For example, if you choose 75 hz, it might be 71-72. It is related to error when rounding integers. It's ok.
```

## 7. Led indication

This board has an internal led that may allows you to understand possible problems. It blinks from 1 to 10 times within 4 seconds. By counting number of blinks you can define the code of current status.

| Number of blinks | Uavcan helth   | Description                     |
| ---------------- | -------------- | ------------------------------- |
| 1                | OK             | Everything is ok.                |
| 2                | OK             | There is no RawCommand at least for last 0.5 seconds, PWM state is resetet to default state. |
| 3                | WARNING        | This node can't see any other nodes in UAVCAN network, check your cables. |
| 4                | ERROR          | There is a problem with circuit voltage, look at circuit status message to get details. It may happend when you power it from SWD, otherwise be carefull with power supply. |
| 5                | CRITICAL       | There is a problem on periphery initialization level. Probably you load wrong firmware. |

## 8. Usage example on a table

(in process)

## 9. UAV usage example

(in process)

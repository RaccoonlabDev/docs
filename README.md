
# Uavcan nodes

This repository consist of set of uavcan devices binaries and description how to use UAVCAN nodes.

Uavcan nodes based on [UAVCAN v0 protocol](https://legacy.uavcan.org/).

## Existing UAVCAN devices

At this time the list of well tested uavcan devices are:


| № | Uavcan node        | Node default ID | Version    |
| - | ------------------ |:---------------:| ---------- |
| 1 | programmer-sniffer | -               | v0.3       |
| 2 | can-pwm            | 50-69           | v0.3       |
| 3 | airspeed           | 74              | v0.3       |

Several nodes in development process now:

| № | Uavcan node        | Node default ID | Version    |
| - | ------------------ |:---------------:| ---------- |
| 4 | ice                | 70              | v0.3alpha  |
| 5 | charger            | 80              | v0.3alpha  |
| 6 | inclinometer       | 80              | v0.3alpha  |
| 7 | fuel_tank          | 75              | v0.3alpha  |
| 8 | pmu_cover          | 72              | v0.2alpha  |
| 9 | gps_mag_baro       | 71              | v0.1beta   |
| 10| rangefinder        | 73              | v0.1alpha  |
| 11| wifi_bridge        | -               | v0.1alpha  |


## 1. programmer-sniffer

Programmer-sniffer is a single device that has capability of programmer and UAVCAN sniffer.

**1. How to program a node**

It is suggested to use st-link utility

**1.1. Windows**

1. Install it from [st.com](https://www.st.com/en/development-tools/stsw-link004.html)
2. Use GUI to program a node with desired .bin file


**1.2. Linux**

You need to connect `programmer-sniffer` with  your UAVCAN node via SWD socket and with your PC via USB. Be carefull, don't use CAN socket!

1. Install stlink using [official instructions](https://github.com/stlink-org/stlink#installation)
2. Type following to program it with desired .bin file:

```
st-flash write desired_bin_file.bin 0x8000000
```

where `desired_bin_file.bin` is the the name of binary file

**2. How to use sniffer**

You need to connect `programmer-sniffer` with  your UAVCAN node via CAN socket and with your PC via USB.

There are 2 different CAN sockets. You can use any of them. Be carefull, don't use SWD socket!

After that you can use [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool) utility or something other.

## 2. can-pwm


The main goal of this board is to map [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) messages into PWM. Additionally it indicate own state using [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) messages and led.

The structure scheme illustrated algorithm shown below.

![scheme](doc/can_pwm/can_pwm_scheme.png?raw=true "scheme")

**RawCommand mapping into PWM**

Configuration of mapping can be performed using 4 UAVCAN parameters for each channel via uavcan_gui_tool or QGC as well. UAVCAN message format allows up to 20 channels. This node allows up to 4 PWM pins. These 4 parameters are:

- channel - choose which RawCommand channel you want to map into particular PWM pin
- min - PWM duration corresponded RawCommand=0
- max - PWM duration corresponded RawCommand=8191
- def - initial value of PWM duration or the value to be set when there is no RawCommand for few seconds.

You can see parameters list below.

![scheme](doc/can_pwm/can_pwm_params.png?raw=true "scheme")

**Led blink**

This board has internal led that may allows you to understand possible problems. It blinks from 1 to 10 times within 4 seconds. By counting number of blinks you can define the code of current status.

| Number of blinks | Uavcan helth   | Description                     |
| ---------------- | -------------- | ------------------------------- |
| 1                | OK             | Everything is ok.                |
| 2                | OK             | There is no RawCommand at least for last 0.5 seconds, PWM state is resetet to default state. |
| 3                | WARNING        | This node can't see any other nodes in UAVCAN network, check your cables. |
| 4                | ERROR          | There is a problem with circuit voltage, look at circuit status message to get details. It may happend when you power it from SWD, otherwise be carefull with power supply. |
| 5                | CRITICAL       | There is a problem on periphery initialization level. Probably you load wrong firmware. |


**Circuit status**

This node as well as other nodes sends Circuit status messages that has 5V and Vin voltages measurements.

**Usage examples**
It is recommended to use it firtly with [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool).

## 3. airspeed

This board is a wrapper under [MS4525DO airspeed sensor](https://www.te.com/commerce/DocumentDelivery/DDEController?Action=showdoc&DocId=Data+Sheet%7FMS4525DO%7FB2%7Fpdf%7FEnglish%7FENG_DS_MS4525DO_B2.pdf%7FCAT-BLPS0002) that allow use it through UAVCAN network.

It read measurements from i2c and publishes temperature and differential pressure.

Uavcan message type: [uavcan.equipment.air_data.RawAirData](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawairdata).

**Message example**

![scheme](doc/airspeed/airspeed_message.png?raw=true "scheme")

**Parameters**

![scheme](doc/airspeed/airspeed_params.png?raw=true "scheme")

## 4. internal combustion engine

This board performs inernal combstion engine control and engine speed measurements. It may be usefull for such application as VTOL.

1. Measuring engine speed
Using interrupts and input capture it remembers the time when last and previous impulses were captured.
Every 10 ms it calculates the frequncy of impulses using current and previous time and put this value to some ring buffer with size 20.
Every 100 ms it gets median value from this buffer and publishes `esc_status` uavcan msg. This frequency and `esc index` can be modified using parameters.
2. Controlling engine
Usually starter, ignition and throttle are used to control engine. They all use RawCommand as control input. In any way, if last RawCommand with corresponding channel value message is received more than 2 seconds ago, all states of controlled devices will be switched to default.
- The throttle state is directly controlled by RawCommand. It means that input command value is one-to-one mapped into pwm duration. The lower and higher borders of duration are defined in corresponding parameters.
- The engine ignition has 2 states. When it is enabled it has max pwm duration, else it has min duration. The value of RawCommand of corresponding channel higher than some offset means enabled. You can setup offset in parameters.
- The starter has 2 states like ignition but logic is a little harder. If input channel value is greater than offset, it will perform an attempt to run engine with duration up to certain time. If attempt is unsuccessful, it will turn off for certain time (to signalize that it's unsuccessful), and then try again. If median speed for last second is greater than some certain value it will stop attempt. Durations and offsets can be setup in parameters.

## 5. charger

This board allows to automatically charge a battery.

Algorithm of charging is following:

0. At initialization stage it perform calibration of zero current value for 3 seconds.

1. After that it goes to the WAITING stage where it is trying to detect connected battery by measuring voltage and comparing it with offset value.

2. When battery is detected, it goes to the SIGNALING stage, where it just blinks leds for 2 seconds to signals us about start charging. 

3. Then it goes to the CHARGING stage where it tries to maintains the target current level by regulating dc-dc voltage using control loop shown below.

4. If current is less than some offset value that could mean that battery is charged or disconnected it goes into FINISH stage. If voltage is less than some offset value it returns to the CHARGING stage again.

![scheme](doc/charger/charger.png?raw=true "scheme")

**Parameters**

![scheme](doc/charger/charger_params.png?raw=true "scheme")

## 6. inclinometer

...


## 7. fuel_tank

This board is dedicated for measuring level of fuel.

It publishes [uavcan.equipment.ice.FuelTankStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#fueltankstatus).

**Message example**

![scheme](doc/fuel_tank/fuel_tank_message.png?raw=true "msg")

**Parameters**

![scheme](doc/fuel_tank/fuel_tank_params.png?raw=true "params")

## 8. pmu cover

This board allow to measure voltage and current of battery using ADC.
It publishes [uavcan.equipment.power.BatteryInfo](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#batteryinfo) via UAVCAN with adjustable rate.

## 9. gps_mag_baro

This board can work with 4 sensors:

1. u-blox gps can use one of 2 protocols (depending on his firmware): `nmea` and [ublox protocol](https://www.u-blox.com/sites/default/files/products/documents/u-blox8-M8_ReceiverDescrProtSpec_%28UBX-13003221%29.pdf).
It allows to switch desired protocol using parameters in runtime. As second protocols in a test stage showed better performance, at this moment we used, debuged and tested enough only second version.
Anyway we communicate with GPS using UART and publish [uavcan.equipment.gnss.Fix](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#fix) via UAVCAN with adjustable rate. You can setup zero rate in parameters to publish messages in gps rate (~ 7 msgs per second).

2. barometer [BMP280](https://cdn-shop.adafruit.com/datasheets/BST-BMP280-DS001-11.pdf)
Communication with sensor is carried out using I2C.
It publishes 2 messages:
   - [uavcan.equipment.air_data.StaticPressure](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#staticpressure)
   - [uavcan.equipment.air_data.StaticTemperature](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#statictemperature)

3. [RM3100](https://ekb.terraelectronica.ru/pdf/show?pdf_file=%252Fds%252Fpdf%252FR%252FRM3100.pdf) and [HMC5883L](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf) magnetometrs
The first works via SPI and the second works via I2C.
In both ways we publish [uavcan.equipment.ahrs.MagneticFieldStrength2](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#magneticfieldstrength2).

Also it has external leds. They show the system state at this moment.

If you want details of external leds working, look at Sensors/leds.c module.

## 10. rangefinder

Sensor: [LW20](https://www.mouser.com/datasheet/2/321/28055-LW20-SF20-LiDAR-Manual-Rev-7-1371848.pdf), connected via i2c.

Published data: range in meters.

Uavcan message type: [uavcan.equipment.range_sensor.Measurement](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#measurement).

Algorithm: just measure and publish.

### 11. can_uart_bridge

This board aimed at converting all received messages from UART to corresponded frames in CAN and
send them, and the same from CAN to UART.

Led description:

- this node blinks from 1 to 5 times for 2 seconds, then waits for 2 seconds
- number of blinking indicates the current state of board
- 1 pulse means that all is ok: UART and CAN are receiving and working ok at least for the last 4
seconds
- 2 pulses means that there is no RX data from uart for last period of time
- 3 pulses means that there is no RX data from CAN for last period of time
- 4 pulses means that there is no RX data at all for last period of time
- 5 pulses are reserved for future usage

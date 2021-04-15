
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
| 1 | ice                | 70              | v0.3alpha  |
| 2 | charger            | 80              | v0.3alpha  |
| 3 | inclinometer       | 80              | v0.3alpha  |
| 4 | fuel_tank          | 75              | v0.3alpha  |
| 5 | pmu_cover          | 72              | v0.2alpha  |
| 6 | gps_mag_baro       | 71              | v0.1beta   |
| 7 | rangefinder        | 73              | v0.1alpha  |
| 8 | wifi_bridge        | -               | v0.1alpha  |


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

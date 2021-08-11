# can-pwm

The main goal of this board is to map [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) messages into typical for servos and ESCs PWM (frequency 50 Hz and duration from 900 to 2000 us).

Depending on firmware it works in 2 modes:
1. servo/esc mode: up to 4 channels named A1, A2, B1, B2,
2. (experimental) [esc flame](https://store.tmotor.com/category.php?id=20): up to 2 channels named A1, A2 and feedback with RPM and voltage

The illustration of this board and pin numeration shown below.

![scheme](can_pwm.png?raw=true "scheme")

It is recommended to use only first 2 channels (A1, A2) because other channels have non-standard pins position yet.

```
TODO: check is GND and 5V on the picrure above are correct!!! Is it depends on the board?
```

## Content
  - [1. How to connect](#1-how-to-connect)
  - [2. Mapping and params](#2-mapping-and-params)
  - [3. Led indication](#3-led-indication)
  - [4. Circuit status](#4-circuit-status)
  - [5. Usage example](#5-usage-example)

## 1. How to connect

You can power this board using one of 2 CAN-sockets:

- the little one - it has 5V
- the big one - it up to 20V

It also has SWD socket that is dedicated for updating firmware using [programmer-sniffer](doc/programmer_sniffer/README.md) device.

## 2. Mapping and params

This node receives [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) which has array with up to 20 channels and it is able to process up to 4 of them.

Configuration of such mapping might be done using 4 sets (named A1, A2, B1, B2) of following params:
- channel - choose which `RawCommand` channel you want to map into particular PWM pin; -1 means disable, 0-20 - specific channel
- min - PWM duration corresponded lower value of RawCommand
- max - PWM duration corresponded highest level of RawCommand
- def - default value of PWM; the corresponded channel will have this PWM duration if there is no RawCommand for few seconds or this command has negative value 


Note, that value of `min` param might be more than value of `max` param and `def` value might be out of `min`/`max` range. It's up to you.

Below you can see visualization of this mapping.

![mapping](can_pwm_mapping.png?raw=true "mapping")

Configuration of mapping can be performed using `uavcan_gui_tool` or even `QGC`. Below you can see the table with these params in `uavcan_gui_tool`.


![scheme](can_pwm_params.png?raw=true "scheme")

## 3. Led indication

This board has internal led that may allows you to understand possible problems. It blinks from 1 to 10 times within 4 seconds. By counting number of blinks you can define the code of current status.

| Number of blinks | Uavcan helth   | Description                     |
| ---------------- | -------------- | ------------------------------- |
| 1                | OK             | Everything is ok.                |
| 2                | OK             | There is no RawCommand at least for last 0.5 seconds, PWM state is resetet to default state. |
| 3                | WARNING        | This node can't see any other nodes in UAVCAN network, check your cables. |
| 4                | ERROR          | There is a problem with circuit voltage, look at circuit status message to get details. It may happend when you power it from SWD, otherwise be carefull with power supply. |
| 5                | CRITICAL       | There is a problem on periphery initialization level. Probably you load wrong firmware. |


## 4. Circuit status

It also sends [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) messages with measured `5V` and `Vin`.

## 5. Usage example

It is recommended to debug it with [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool). You can setup parameters, connect servo to one of the channels and check it using `ESC panel` as shown below.

![esc_panel](esc_panel.png?raw=true "esc_panel")
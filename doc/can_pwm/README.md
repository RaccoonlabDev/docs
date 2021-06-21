## can-pwm

The main goal of this board is to map [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) messages into PWM with frequency 50 Hz and duration from 900 to 2000 us that is what typical servo needs. This board supports up to 4 channels named A1, A2, B1, B2.

It also sends [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) messages with measured `5V` and `Vin`.

The illustration of this board and pin numeration shown below.

![scheme](can_pwm.png?raw=true "scheme")

You can power this board using one of 2 CAN-sockets:

- the little one - it has 5V
- the big one - it up to 20V

**RawCommand mapping into PWM**

Configuration of mapping can be performed using 4 UAVCAN parameters for each channel via `uavcan_gui_tool` or `QGC` as well. UAVCAN message format allows up to 20 channels. This node allows up to 4 PWM pins. These 4 parameters are:

- channel - choose which `RawCommand` channel you want to map into particular PWM pin
- min - PWM duration corresponded RawCommand=0
- max - PWM duration corresponded RawCommand=8191
- def - initial value of PWM duration or the value to be set when there is no RawCommand for few seconds.

You can see parameters list below.

![scheme](can_pwm_params.png?raw=true "scheme")

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

It is recommended to use it firtly with [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool). You can setup parameters, connect servo to one of the channel and check it using `ESC panel` as shown below.

![esc_panel](esc_panel.png?raw=true "esc_panel")
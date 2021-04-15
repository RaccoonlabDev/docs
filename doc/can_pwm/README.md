# can-pwm node

This board may be used as [UAVCAN ESC](https://docs.px4.io/master/en/uavcan/escs.html) node with PX4 Autopilot.

It support only UAVCAN v0 at this moment.

This board is based on stm32f103tbu microcontroller.

The main goal of this board is to map [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) messages into PWM. Additionally it indicate own state using [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) messages and led.

The structure scheme illustrated algorithm shown below.

![scheme](can_pwm_scheme.png?raw=true "scheme")

**RawCommand mapping into PWM**

Configuration of mapping can be performed using 4 UAVCAN parameters for each channel via uavcan_gui_tool or QGC as well. UAVCAN message format allows up to 20 channels. This node allows up to 4 PWM pins. These 4 parameters are:

- channel - choose which RawCommand channel you want to map into particular PWM pin
- min - PWM duration corresponded RawCommand=0
- max - PWM duration corresponded RawCommand=8191
- def - initial value of PWM duration or the value to be set when there is no RawCommand for few seconds.

You can see parameters list below.

![params](can_pwm_params.png?raw=true "params")

**Led blink**

Internal led blinks from 1 to 10 times and then wait for few seconds.
Number of blinks corresponds to a particular error. You can use following list to understand it:

1. OK
2. OK - there is no RawCommand at least for last 0.5 seconds (this status is cleared
automaticaly 4 seconds after receiving a message). When this status appears, Node will set PWM
duration of all channels to default.
3. Warning - there is no communication on UAVCAN level (no RX or no TX at all). Check your cables.
4. Error - there is a problem with circuit voltage, look at circuit status message to get details
6. Critical - there is a problem on periphery initialization level. This should never happen.

**Circuit status**

This node as well as other nodes send Circuit status messages that has 5V and Vin voltages measurements. 

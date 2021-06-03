## charger

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
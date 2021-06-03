## internal combustion engine

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
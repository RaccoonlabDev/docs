## UAVCAN Gps + Magnetometer + Barometer node

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
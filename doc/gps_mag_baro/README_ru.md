## UAVCAN Gps + магнитометр + барометр

Эта плата имеет 3 типа датчиков:

1. GNSS модуль: [u-blox 8](https://www.u-blox.com/en/product/max-8-series)
2. Барометр: [BMP280](https://cdn-shop.adafruit.com/datasheets/BST-BMP280-DS001-11.pdf)
3. Магнитометры: [RM3100](https://ekb.terraelectronica.ru/pdf/show?pdf_file=%252Fds%252Fpdf%252FR%252FRM3100.pdf) и/или [HMC5883L](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf)

![gps_mag_baro](gps_mag_baro.png?raw=true "gps_mag_baro")

## Содержание
  - [1. Интерфейс UAVCAN](#1-uavcan-interface)
  - [2. спецификация оборудования](#2-hardware-specification)
  - [3. Подключение](#3-wire)
  - [4. Описание основных функций](#4-main-function-description)
  - [5. Описание вспомогательных функций](#5-auxiliary-function-description)
  - [6. Параметры](#6-parameters)
  - [7. Светодиодная индикация](#7-led-indication)
  - [8. Пример использования на стенде](#8-usage-example-on-a-table)
  - [9. Пример использования в БПЛА](#9-uav-usage-example)

## 1. Интерфейс UAVCAN <a name="1-uavcan-interface"></a> 

Этот узел взаимодействует посредством следующих сообщений:

| № | тип | сообщение |
| - | --------- | -------- |
| 1 | publisher | [uavcan.equipment.gnss.Fix](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#fix) |
| 2 | publisher | [uavcan.equipment.air_data.StaticPressure](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#staticpressure) |
| 3 | publisher | [uavcan.equipment.air_data.StaticPressure](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#staticpressure) |
| 4 | publisher | [uavcan.equipment.ahrs.MagneticFieldStrength](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#magneticfieldstrength)| |
| 5 | publisher | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus)|

Помимо необходимых и очень рекомендуемых функций, таких как `NodeStatus` и `GetNodeInfo`, этот узел также поддерживает следующие функции прикладного уровня:

| № | тип | сообщение |
| - | --------- | -------- |
| 1 | service consumer | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam)|
| 2 | service consumer | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode)|
| 3 | service consumer | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 3. Подключение <a name="3-wire"></a> 
 
Вы можете запитать эту плату, используя один из 2 CAN-разъемов:

1. UCANPHY Micro (JST-GH 4).
```
Примечание спецификации физического уровня UAVCAN/CAN.
Устройства, подающие питание на шину, должны обеспечивать 4,9-5,5 В на линии питания шины, номинальное напряжение 5,0 В.
Устройства, получающие питание от шины, должны ожидать 4,0-5,5 В на линии питания шины. Ток не должен
превышать 1 А на каждый разъем.
```
2. 6-контактный разъем Molex серии 502585 ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670) и [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600))

```
До 100 В, 2 A на контакт
```

Он также имеет разъем SWD, предназначенный для обновления прошивки с помощью устройства [programmer-sniffer](doc/programmer_sniffer/README.md).

## 4. Описание основных функций  <a name="4-main-function-description"></a> 

Этот узел имеет 3 функции: gps, магнитометр и барометр. Вы можете включить или отключить любую из них, используя следующие параметры UAVCAN `gps_enable`, `mag_enable` и `baro_enable`.

Ниже показана иллюстрация того, как это может работать в `uavcan_gui_tool`.

![gps_mag_baro](gps_mag_baro_msgs.png?raw=true "gps_mag_baro")

**4.1 Модуль GNSS**

Узел использует [u-blox 8](https://www.u-blox.com/en/product/max-8-series) gnss модуль. Он может работать как с протоколом `nmea`, так и с протоколом [ublox protocol](https://www.u-blox.com/sites/default/files/products/documents/u-blox8-M8_ReceiverDescrProtSpec_%28UBX-13003221%29.pdf). Вы можете выбрать желаемый протокол с помощью параметра UAVCAN `gnss_type`.

В режиме протокола ubx он анализирует только сообщение `UbxNavPvt`.

```
Примечание 1: протокол nmea еще недостаточно протестирован. Используйте вместо него протокол ubx.
```

```
Примечание 2: В данный момент вам необходимо вручную настроить модуль ublox перед использованием.
```

**Установка U-Blox NEO-M8N-0 bu UART**

- [Скачать](https://www.u-blox.com/en/product/u-center) и установить u-center (не u-center 2).
- Подключитесь к модулю по UART со скоростью 9600 по умолчанию.
- Откройте View->Configuration view. Перейдите к MSG (Сообщения), включите "01-07 NAV-PVT" на UART1, отключите все остальные сообщения. Нажмите "send" в нижней части окна, чтобы отправить команду. Проверьте, что из модуля идет только NAV-PVT, открыв View->Messages View.
- Снова перейдите в Configuration view к PRT (Ports), измените Baudrate на 115200, "send" внизу.
- Переподключитесь к устройству на новой скорости передачи данных.
- Перейдите в меню Configuration view к RATE (Rates), установите Measurement Period на 60 мс, "send" внизу.
- Если все в порядке, перейдите к просмотру конфигурации в CFG (Configuration), выберите "Save current configuration" (Сохранить текущую конфигурацию), "send" (отправить) внизу.

**Работа**

Модуль связывается с модулем gnss через UART и публикует [uavcan.equipment.gnss.Fix](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#fix). Вы можете либо установить скорость публикации по умолчанию (такую же, как при приеме), установив `gps_frequency` в 0, либо установить любую другую фиксированную скорость.

Ниже приведен пример сообщения `Fix`.

![gps_msg](gps_msg.png?raw=true "gps_msg")

**4.2. Барометр** 

В узле используется барометр [BMP280](https://cdn-shop.adafruit.com/datasheets/BST-BMP280-DS001-11.pdf). Связь с датчиком осуществляется с помощью I2C. Он публикует 2 сообщения:
- [uavcan.equipment.air_data.StaticPressure](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#staticpressure)
- [uavcan.equipment.air_data.StaticTemperature](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#statictemperature).

Настройки контрольных измерений:
- передискретизация давления - 8: высокое разрешение, 19 бит / 0,33 Па
- дискретизация температуры - 8: 19 бит / 0,0006 °C
- скорость передачи данных до 50 Гц, если время ожидания менее 0,5 мс
- нормальный режим

![baro_msg](baro_msg.png?raw=true "baro_msg")

![baro_plot](baro_plot.png?raw=true "baro_plot")


**4.3. Магнитометр**

Узел поддерживает 2 типа магнитометров: [RM3100](https://ekb.terraelectronica.ru/pdf/show?pdf_file=%252Fds%252Fpdf%252FR%252FRM3100.pdf) и [HMC5883L](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf). Вы можете выбрать нужный вам во время выполнения программы, используя параметры UAVCAN.

Перед первым измерением этот узел выполняет инициализацию для выбранного магнитометра. Настройки конфигурации предопределены в прошивке и показаны в таблице ниже.

1. [HMC5883L](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf):
- шина i2c,
- Режим непрерывных измерений с нормальной конфигурацией измерений,
- частота измерения 30 Гц (по умолчанию 15 Гц),
- регулируемая частота публикации до 30 Гц с помощью параметра UAVCAN,
- количество выборок - 2 (по умолчанию - 1),
- диапазон поля датчика ± 1,3 Ga (по умолчанию), цифровое разрешение 0,92 mG/LSb.

2. [RM3100](https://ekb.terraelectronica.ru/pdf/show?pdf_file=%252Fds%252Fpdf%252FR%252FRM3100.pdf) и [HMC5883L](https://cdn-shop.adafruit.com/datasheets/HMC5883L_3-Axis_Digital_Compass_IC.pdf)
- шина SPI
- Режим непрерывного измерения,
- частота измерений 75 Гц (по умолчанию 37 Гц),
- регулируемая частота публикации до 75 Гц с помощью параметра UAVCAN,
- количество циклов - 200 (по умолчанию), коэффициент усиления - 75 LSB/мкТл, чувствительность - 13 нТл,
- диапазон измерения поля от -800 до +800 мкТл.

Оба магнитометра публикуют [uavcan.equipment.ahrs.MagneticFieldStrength](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#magneticfieldstrength).

Ниже приведен пример исходных данных магнитометра HMC5883L.

![mag_HMC5883L_msg](mag_HMC5883L_msg.png?raw=true "mag_HMC5883L_msg")

![mag_HMC5883L_plot](mag_HMC5883L_plot.png?raw=true "mag_HMC5883L_plot")

## 5. Описание вспомогательных функций <a name="5-auxiliary-function-description"></a> 

(в процессе)

Также у него есть внешние светодиоды. Они показывают состояние системы в данный момент.

## 6. Параметры <a name="6-parameters"></a> 

(в процессе)

![gps_mag_baro_params](gps_mag_baro_params.png?raw=true "gps_mag_baro_params")

```
Примечание: фактическая частота публикации может быть меньше желаемой. Например, если вы выбрали 75 Hz, она может быть 71-72. Это связано с ошибкой при округлении целых чисел. Это нормально.
```

## 7. Светодиодная индикация <a name="7-led-indication"></a> 

Эта плата имеет внутренний светодиод, который может помочь вам понять возможные проблемы. Он мигает от 1 до 10 раз в течение 4 секунд. Подсчитав количество миганий, можно определить код текущего состояния.

| Количество миганий | Состояние | Описание |
| ---------------- | -------------- | ------------------------------- |
| 1 | OK | Все в порядке.                |
| 2 | OK | Нет RawCommand, по крайней мере, в течение последних 0,5 секунд, состояние ШИМ возвращено в состояние по умолчанию. |
| 3 | ПРЕДУПРЕЖДЕНИЕ | Этот узел не видит другие узлы в сети UAVCAN, проверьте кабели. |
| 4 | ERROR | Есть проблема с напряжением цепи, посмотрите сообщение о состоянии цепи, чтобы узнать подробности. Это может произойти при питании от SWD, в противном случае будьте осторожны с питанием. |
| 5 | CRITICAL | Проблема на уровне инициализации периферии. Возможно, вы загрузили неправильную прошивку. |

## 8. Пример использования на таблице <a name="8-usage-example-on-a-table"></a> 

(в процессе)

## 9. Пример использования БПЛА <a name="9-uav-usage-example"></a> 

(в процессе)
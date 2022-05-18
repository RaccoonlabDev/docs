## UAVCAN-дальномер

Плата UAVCAN-дальномер включает в себя реализацию драйверов для взаимодействия по i2c/uart с дальномерами, такими как [LW20/C](https://www.mouser.com/datasheet/2/321/28055-LW20-SF20-LiDAR-Manual-Rev-7-1371848.pdf), [TF-Luna](https://files.seeedstudio.com/wiki/Grove-TF_Mini_LiDAR/res/SJ-PM-TF-Luna-A03-Product-Manual.pdf). Считанные и измерения с датчика отправляются по шине UAVCAN.

![rangefinder](rangefinder.jpg?raw=true "rangefinder")
Рис. Прототип, использующий lightware LW20

## Содержание
  - [1. Интерфейс UAVCAN](#1-uavcan-interface)
  - [2. Технические характеристики](#2-hardware-specification)
  - [3. Соединение](#3-wire)
  - [4. Описание основных функций](#4-main-function-description)
  - [5. Описание вспомогательных функций](#5-auxiliary-function-description)
  - [6. Параметры](#6-parameters)
  - [7. Светодиодная индикация](#7-led-indication)
  - [8. Пример использования на стенде](#8-usage-example-on-a-table)
  - [9. Пример использования в БПЛА](#9-uav-usage-example)

## 1. Интерфейс UAVCAN <a name="1-uavcan-interface"></a> 

Узел публикует следующие сообщения:

| № | тип | сообщение |
| - | --------- | -------- |
| 1 | publisher | [uavcan.equipment.range_sensor.Measurement](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#measurement) |
| 2 | publisher | [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) |

Помимо необходимых и очень рекомендуемых функций, таких как `NodeStatus` и `GetNodeInfo`, узел также поддерживает следующие функции прикладного уровня:

| № | тип | сообщение |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Спецификация оборудования <a name="2-hardware-specification"></a> 

(в процессе)

![scheme](../can_pwm/can_pwm_mini_scheme.png?raw=true "scheme")

## 3. Подключение <a name="3-wire"></a> 

На плате имеется 3 разъема, описание которых преставлено в таблице ниже.

| № | Разъем | Описание |
| - | --------- | ----------- |
| 1 | UCANPHY Micro (JST-GH 4) | Примечание спецификации физического уровня UAVCAN/CAN. Устройства, подающие питание на шину, должны обеспечивать 4,9-5,5 В на линии питания шины, номинальное напряжение 5,0 В. Устройства, получающие питание от шины, должны ожидать 4,0-5,5 В на линии питания шины. Ток не должен превышать 1 А на каждый разъем. |
| 2 | 6-контактный разъем Molex серии 502585 ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670) и [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Разъем поддерживает до 100 В, 2 A на контакт, но плата работает только с 2S-6S. |
| 3 | SWD | Предназначен для обновления прошивки с помощью устройства [programmer-sniffer](docs/guide/programmer_sniffer/README.md). |

## 4. Описание основных функций <a name="4-main-function-description"></a> 

Этот узел измеряет и публикует дальность с регулируемой частотой (по умолчанию 10 Гц). Скорость публикации и измерения может быть настроена с помощью параметров узла, но рекомендуется использовать значения по умолчанию.

## 5. Описание вспомогательных функций <a name="5-auxiliary-function-description"></a> 

**Состояние цепи**

Узел также посылает сообщения [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) с измеренными `5V` и `Vin`.

## 6. Параметры <a name="6-parameters"></a> 

Доступный список параметров показан в таблице ниже:

|Idx| Name             | Type    |Default| Min | Max | Desctiption |
| - | ---------------- | ------- | ----- | --- | --- | ----------- |
| 0 | ID               | integer | 73    | 0   | 100 | Идентификатор узла |
| 1 | log_level        | integer | 3     | 0   | 4   | Узел будет отправлять отладочные сообщения с уровнем не ниже, чем указан в данном параметре. 0 - debug, 1 - info, 2 - warn, 3 - error, 4 - отключить отправку отладочных сообщений |
| 2 | rng_measurement_period | integer | 100     | 10   | 2000   | Период измерения и публикации сообщений. |
| 3 | rng_type         | integer | 0     | 0   | 2   | Тип датчика. См. таблицу ниже. |
| 4 | rng_id           | integer | 0     | 0   | 255  | Идентификатор датчика. См. [uavcan сообщение]([uavcan.equipment.range_sensor.Measurement](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#measurement)) |
| 5 | enable_5v_check  | integer | 1     | 0   | 1   | Устанавливает статус ERROR если напряжение 5V вне диапазона 4.5 - 5.5 V |
| 6 | enable_vin_check | integer | 0     | 0   | 1   | Устанавливает статус ERROR если напряжение Vin меньше 4.5 V |
| 7 | name             | integer | 0     | 0   | 100 | Пользовательское имя узла. Может быть реализовано по запросу. |

Using parameters you may specify type of sensor (now it supports only LW20/C)

| rng_type               | Тип датчика               |
| ---------------------- | ------------------------- |
| 0                      | LW20/C (i2c)              |
| 1                      | TF-Luna (uart)            |
| 2                      | Garmin lite v3 (i2c)      |
| 3                      | vl53l0x (i2c)             |

## 7. Светодиодная индикация <a name="7-led-indication"></a> 

Данная плата имеет внутренний индикатор, который может помочь вам понять возможные проблемы. Он мигает от 1 до 10 раз в течение 4 секунд. Подсчитав количество миганий, можно определить код текущего состояния.

| Количество миганий | Uavcan health | Описание | 
| ---------------- | -------------- | ------------------------------- |
| 1 | OK | Все в порядке                |
| 2 | OK | Нет RawCommand, по крайней мере, в течение последних 0.5 секунд (это не проблема для данной платы, просто на всякий случай). |
| 3 | WARNING | Этот узел не видит других узлов в сети UAVCAN, проверьте кабели или нет входящих данных от датчика. |
| 4 | ERROR | Есть проблема с напряжением цепи, посмотрите сообщение о состоянии цепи, чтобы узнать подробности. Это может произойти при подаче питания от SWD, в противном случае будьте осторожны с питанием. Эта проверка может быть отключена с помощью параметров. |
| 5 | CRITICAL | Есть проблема на уровне инициализации периферии. Возможно, вы загрузили неправильную прошивку. |


## 8. Пример использования на стенде <a name="8-usage-example-on-a-table"></a> 
Рекомендуется отлаживать датчик с помощью [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool). Вы можете проверить сообщение, отправленное этим узлом.

Пример сообщения показан ниже.

![scheme](rangefinder_message.png?raw=true "scheme")

## 9. Пример использования в БПЛА <a name="#9-uav-usage-example"></a> 

(раздел дополняется)

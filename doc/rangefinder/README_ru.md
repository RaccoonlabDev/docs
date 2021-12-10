## UAVCAN-дальномер

Эта плата является преобразователем для датчика [LW20/C](https://www.mouser.com/datasheet/2/321/28055-LW20-SF20-LiDAR-Manual-Rev-7-1371848.pdf) (или аналога), которая позволяет использовать этот датчик на шине UAVCAN.

Она считывает измерения с датчика через интерфейс i2c и публикует дальность в метрах в шину.

![rangefinder](rangefinder.jpg?raw=true "rangefinder")

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

Этот узел взаимодействует посредством следующих сообщений:

| № | тип | сообщение |
| - | --------- | -------- |
| 1 | publisher | [uavcan.equipment.range_sensor.Measurement](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#measurement) |
| 2 | publisher | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) |

Помимо необходимых и очень рекомендуемых функций, таких как `NodeStatus` и `GetNodeInfo`, этот узел также поддерживает следующие функции прикладного уровня:

| № | тип | сообщение |
| - | --------- | -------- |
| 1 | service consumer | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam)|
| 2 | service consumer | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode)|
| 3 | service consumer | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Спецификация оборудования <a name="2-hardware-specification"></a> 

(в процессе)

## 3. Подключение <a name="3-wire"></a> 

Вы можете запитать эту плату, используя один из 2 CAN-разъемов:

1. 4-контактный CAN-разъем (`UCANPHY Micro - JST-GH 4`). Этот разъем описан в [UAVCAN/CAN Physical Layer Specification](https://forum.uavcan.org/t/uavcan-can-physical-layer-specification-v1-0/1471). Краткое примечание из стандарта ниже: 
```
Примечание спецификации физического уровня UAVCAN/CAN.
Устройства, подающие питание на шину, должны обеспечивать 4,9-5,5 В на линии питания шины, номинальное напряжение 5,0 В.
Устройства, получающие питание от шины, должны ожидать 4,0-5,5 В на линии питания шины. Ток не должен
превышать 1 А на каждый разъем.
```
2. 6-контактный CAN-разъем (``разъем 502585 серии Molex``: [502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670) и [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600))

```
До 100 В, 2 A на контакт
```

Он также имеет SWD разъем, предназначенный для обновления прошивки с помощью устройства [programmer-sniffer](doc/programmer_sniffer/README.md).

## 4. Описание основных функций <a name="4-main-function-description"></a> 

Этот узел измеряет и публикует дальность с регулируемой частотой (по умолчанию 10 Гц). Скорость публикации и измерения может быть настроена с помощью параметров узла, но рекомендуется использовать значения по умолчанию.

## 5. Описание вспомогательных функций <a name="5-auxiliary-function-description"></a> 

**Состояние цепи**

Узел также посылает сообщения [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) с измеренными `5V` и `Vin`.

## 6. Параметры <a name="6-parameters"></a> 

Доступный список параметров показан на рисунке ниже:

![схема](rangefinder_params.png?raw=true "параметры")

С помощью параметров можно указать тип датчика (сейчас поддерживается только LW20/C)

| rangefinder_type значение | соответствующий тип датчика |
| ---------------------- | ------------------------- |
| 0 | LW20/C |
| 1 | vl53l0x |.

## 7. Светодиодная индикация <a name="7-led-indication"></a> 

Данная плата имеет внутренний индикатор, который может помочь вам понять возможные проблемы. Он мигает от 1 до 10 раз в течение 4 секунд. Подсчитав количество миганий, можно определить код текущего состояния.

| Количество миганий | Uavcan helth | Описание | 
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

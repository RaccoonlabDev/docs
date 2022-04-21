## Узел зарядного устройства UAVCAN Charger node

Эта плата позволяет автоматически заряжать аккумулятор.

![charger](charger.png?raw=true "charger")

## Содержание
  - [1. Интерфейс UAVCAN](#1-uavcan-interface)
  - [2. Спецификация оборудования](#2-hardware-specification)
  - [3. Соединение](#3-wire)
  - [4. Описание основных функций](#4-main-function-description)
  - [5. Описание вспомогательных функций](#5-auxiliary-function-description)
  - [6. Светодиодная индикация](#6-led-indication)
  - [7. Пример использования на столе](#7-usage-example-on-a-table)
  - [8. Пример использования БПЛА](#8-uav-usage-example)

## 1. Интерфейс UAVCAN <a name="1-uavcan-interface"></a> 

Этот узел взаимодействует посредством следующих сообщений:

| № | тип | сообщение |
| - | --------- | -------- |
| 1 | publisher | inno_msgs.charging_status |
| 2 | publisher | inno_msgs.charging_response |
| 3 | publisher | [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) | [uavcan.equipment.power.CircuitStatus](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus) |
| 4 | subscriber | inno_msgs.charging_control | |
| 5 | subscriber | [uavcan.equipment.power.BatteryInfo](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#batteryinfo) |

Помимо необходимых и очень рекомендуемых функций, таких как `NodeStatus` и `GetNodeInfo`, этот узел также поддерживает следующие функции прикладного уровня:

| № | тип | сообщение |
| - | --------- | -------- |
| 1 | потребитель услуг | [uavcan.protocol.param](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#uavcanprotocolparam)|
2 | 2 | потребитель услуг | [uavcan.protocol.RestartNode](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#restartnode)|
| 3 | потребитель услуг | [uavcan.protocol.GetTransportStats](https://dronecan.github.io/Specification/7._List_of_standard_data_types/#gettransportstats) |

**Описание нестандартных сообщений**

1. inno_msgs.ChargingControl

| № | тип | имя | значение |
| - | ----- | ----------- | ------------------------------------------- |
| 1 | uint8 | cmd | 0 - отключить, 1 - калибровать, 2 - включить обычную зарядку, 3 - включить "экстремальную" зарядку, 4 - включить режим экономии, 5 - ничего не делать.

2. inno_msgs.ChargingStatus публикуется этим узлом с постоянной скоростью, которая может быть настроена с помощью параметров uavcan. В таблице ниже описаны его поля:

| № | тип | имя | значение |
| - | ----------------------- | ----------- | ------------------------------------------- |
| 1 |inno_msgs.ChargingControl|executing_cmd| команда, выполняемая в данный момент |
| 2 | uint8 | stage | состояние автомата в этот момент |
| 3 | uint8 | state_of_charge_pct | состояние зарядки soc в %, 127, если неизвестно |
| 4 | uint16 | dac_value | Необработанное значение ЦАП от o до 4095 | .
| 5 | float16 | capacity | интегрированная емкость во время зарядки, мАч |
| 6 | float16 | received_battery_voltage | received_battery_voltage | напряжение, полученное от BatteryInfo, вольт | 
| 7 | float16 | measured_dc_dc_voltage | выходное напряжение постоянного тока, измеренное с помощью АЦП |
| 8 | float16 | mesured_battery_current | выходной ток, измеренный с помощью АЦП | 
| 9 | float16 | measured_shunt_current | измеренный входной ток, измеренный с помощью АЦП | 
10| float16 | measured_temperature | пока не реализовано.|

## 2. Спецификация аппаратного обеспечения <a name="2-hardware-specification"></a> 

(раздел заполняется)

## 3. Соединение  <a name="3-wire"></a> 

На плате имеется 3 разъема, описание которых преставлено в таблице ниже.

| № | Разъем | Описание |
| - | --------- | ----------- |
| 1 | UCANPHY Micro (JST-GH 4) | Примечание спецификации физического уровня UAVCAN/CAN. Устройства, подающие питание на шину, должны обеспечивать 4,9-5,5 В на линии питания шины, номинальное напряжение 5,0 В. Устройства, получающие питание от шины, должны ожидать 4,0-5,5 В на линии питания шины. Ток не должен превышать 1 А на каждый разъем. |
| 2 | 6-контактный разъем Molex серии 502585 ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670) и [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Разъем поддерживает до 100 В, 2 A на контакт, но плата работает только с 2S-6S. |
| 3 | SWD | Предназначен для обновления прошивки с помощью устройства [programmer-sniffer](doc/programmer_sniffer/README.md). |


## 4. Описание основных функций <a name="4-main-function-description"></a> 

Этот узел может быть описан как машина состояний.

После загрузки узел находится на стадии `калибровки` - он измеряет выходной ток dc/dc преобразователя с помощью АЦП несколько раз и вычисляет среднее необработанное значение АЦП - смещение, которое соответствует нулевому току. После этапа калибровки узел переходит на этап `ожидания`, где он готов к дальнейшей работе. Этап калибровки может быть повторен только по специальной команде.

Если узел получает команду начала зарядки, он переходит в состояние `сигнализации` и затем начинает процесс зарядки.

Процесс зарядки делится на 2 основных этапа. Он начинается со стадии `зарядки постоянным током (CC)`, затем переходит в стадию `зарядки постоянным напряжением (CV)`.


Если напряжение батареи больше максимального (батарея заряжена) или меньше определенного напряжения (батарея не подключена), или прием данных прекращается, устройство переходит на этап `контроль окончания`. После некоторых проверок он переходит состояние `финиш` или `ожидание` или даже переходит на предыдущую стадию.

Вся машина состояний может быть проиллюстрирована с помощью следующей схемы:

![charger](state_machine.png?raw=true "charger")

Типичный двухэтапный процесс зарядки можно проиллюстрировать с помощью следующей схемы:

![схема](normal_charging_process.png?raw=true "scheme")

На обоих этапах этот узел использует внутренний регулятор для поддержания постоянного тока/напряжения.

Таблица с параметрами показана ниже.

![scheme](params.png?raw=true "scheme")

## 5. Описание вспомогательных функций <a name="5-auxiliary-functions-description"></a> 

(в процессе)

## 6. Светодиодная индикация <a name="6-led-indication"></a> 

(в процессе)

## 7. Пример использования на столе <a name="7-usage-example-on-a-table"></a> 

(в процессе)

## 8. Пример использования в реальных условиях <a name="8-uav-usage-example"></a> 

(в процессе)


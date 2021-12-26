## Узел управления питанием UAVCAN PMU node


Эта плата контролирует аккумулятор (напряжение и ток) и позволяет управлять зарядкой, источником и нагрузкой. Она может быть полезна для приложений, где необходимо контролировать питание дрона, включая бортовой компьютер и процесс зарядки.

![pmu_cover](pmu_cover.png?raw=true "pmu_cover")

## Содержание
  - [1. интерфейс UAVCAN](#1-uavcan-interface)
  - [2. спецификация оборудования](#2-hardware-specification)
  - [3. Провод](#3-wire)
  - [4. описание основных функций](#4-main-function-description)
  - [5. описание вспомогательных функций](#5-auxiliary-function-description)
  - [6. параметры](#6-parameters)
  - [7. светодиодная индикация](#7-led-indication)
  - [8. Пример использования на столе](#8-usage-example-on-a-table)
  - [9. Пример использования БПЛА](#9-uav-usage-example)

## 1. Интерфейс UAVCAN <a name="1-uavcan-interface"></a> 

Этот узел взаимодействует посредством следующих сообщений:

| № | тип | сообщение |
| - | --------- | -------- |
| 1 | publisher | [uavcan.equipment.power.BatteryInfo](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#batteryinfo) |
| 2 | publisher | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) 
| 3 | publisher | inno_msgs.PmuStatus |
| 4 | subscriber | inno_msgs.PmuChargerControl |
| 5 | subscriber | inno_msgs.PmuPowerControl |
| 6 | subscriber | inno_msgs.PmuLoadControl | |


| № | тип | сообщение |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam)|
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode)|
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |


## 4. Описание основных функций <a name="4-main-function-description"></a> 

Данная плата мониторит:
1. напряжение батареи (PA0, k=13.91)
2. Напряжение 5 В (PA1, k=2)
3. состояние контактов зарядного устройства (PB4)
4. ток нагрузки (PA3, 60 ампер ~ 3,15 В)

и осуществляет управление:
1. подключение зарядного устройства (PB6)
2. включение нагрузки (автопилот, двигатели и т.д.) (PB7)
3. включить компьютер (PB5)

![battery_info_msg](battery_info_msg.png?raw=true "battery_info_msg")

![pmu_status_msg](pmu_status_msg.png?raw=true "pmu_status_msg")

## 6. Параметры <a name="6-parameters"></a> 

![pmu_params](pmu_params.png?raw=true "pmu_params")

## 8. Пример использования на стенде <a name="8-usage-example-on-a-table"></a> 

```python
broadcast(uavcan.thirdparty.inno_msgs.PmuChargerControl(cmd=0))
broadcast(uavcan.thirdparty.inno_msgs.PmuChargerControl(cmd=1))

broadcast(uavcan.thirdparty.inno_msgs.PmuPowerControl(cmd=0))
broadcast(uavcan.thirdparty.inno_msgs.PmuPowerControl(cmd=1))

broadcast(uavcan.thirdparty.inno_msgs.PmuLoadControl(cmd=0))
broadcast(uavcan.thirdparty.inno_msgs.PmuLoadControl(cmd=1))
```
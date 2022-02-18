## Программатор и сниффер UAVCAN

UAVCAN сниффер и программатор имеет два устройства на одной плате:
- USB-UAVCAN адаптер для подключения вашего ПК к шине UAVCAN с SLCAN для мониторинга шины CAN в реальном времени и анализа передачи UAVCAN с помощью [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool).
- SWD программатор для обновления прошивки ваших узлов UAVCAN.

Это устройство в основном предназначено для разработчиков в области робототехники (БПЛА/БВС, АНПА, БЭК, наземных роботов и т.д.), работающих с UAVCAN и PX4/Ardupilot. Но он также может быть использован для прослушивания CAN-шины и программирования любого другого совместимого микроконтроллера.

![programmer_sniffer](programmer_sniffer.png?raw=true "programmer_sniffer")

## Содержание
  - [1. Технические характеристики](#1-wire)
  - [2. Подключение](#2-wire)
  - [3. Использование программатора](#3-programmer-usage)
  - - [3.1. Windows](#31-windows)
  - - [3.2. Linux](#32-linux)
  - [4. Использование сниффера](#4-sniffer-usage)
  - [5. Светодиодная индикация](#5-led-indication)
  - [6. Примеры применения](#6-application-examples)

## 1. Технические характеристики

Схема представлена в [этом репозитории](https://github.com/sainquake/UAVCAN-Sniffer-STM-Programmer), PDF-версия доступна [по ссылке](https://github.com/sainquake/UAVCAN-Sniffer-STM-Programmer/blob/master/Project%20Outputs%20for%20CAN_SNIFFER/Output.PDF)

![CAD](https://github.com/sainquake/UAVCAN-Sniffer-STM-Programmer/blob/master/CAD/CAN_SNIFFER.JPG?raw=true "CAD")

## 2. Подключение

На плате имеется 4 разъема, описание которых преставлено в таблице ниже.

| № | Разъем | Описание |
| - | --------- | ----------- |
| 1 | USB Type-C | Предназначен для подключения к ПК |
| 2 | UCANPHY Micro (JST-GH 4) | Примечание спецификации физического уровня UAVCAN/CAN. Устройства, подающие питание на шину, должны обеспечивать 4,9-5,5 В на линии питания шины, номинальное напряжение 5,0 В. Устройства, получающие питание от шины, должны ожидать 4,0-5,5 В на линии питания шины. Ток не должен превышать 1 А на каждый разъем. |
| 3 | 6-контактный разъем Molex серии 502585 ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670) и [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Разъем поддерживает до 100 В, 2 A на контакт, но плата работает только с 2S-6S. |
| 4 | SWD | Предназначен для обновления прошивки с помощью устройства [programmer-sniffer](doc/programmer_sniffer/README.md). |

```
!!!ВНИМАНИЕ!!!
Будьте внимательны, 4-контактные гнезда CAN и SWD выглядят одинаково, но неправильное подключение может привести к некоторым проблемам. Названия этих разъемов отмечены на обратной стороне платы.
```

## 3. Использование программатора

Вы можете программировать свои устройства любым удобным для вас способом. Самым простым способом, на наш взгляд, является использование утилиты st-link.

### 3.1. Windows

1. Установите утилиту `ST-LINK` с [официального сайта](https://www.st.com/en/development-tools/stsw-link004.html).
2. Используйте графический интерфейс для программирования узла с нужным .bin файлом

### 3.2. Linux

1. Установите `st-link`, используя [инструкцию из официального репозитория github](https://github.com/stlink-org/stlink#installation).
2. Введите следующее для программирования устройства с помощью нужного .bin файла:

```bash
st-flash write desired_bin_file.bin 0x8000000
```

где `desired_bin_file.bin` - имя двоичного файла.


## 4. Использование сниффера

Вам необходимо подключить `programmer-sniffer` к вашему UAVCAN-узлу через CAN-сокет и к вашему ПК через USB.

На плате есть 2 различных разъема CAN. Вы можете использовать любой из них.

```
Будьте осторожны, не используйте SWD вместо разъема CAN!
```

После этого вы можете использовать утилиту [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool) или что-то другое.

![app_setup](app_setup.png?raw=true "app_setup")

В меню Application Setup необходимо установить значение `1000000` как для шины can, так и для скорости передачи данных адаптера.

После этого окно uavcan_gui_tool будет выглядить следующем образом:

![uavcan_gui_tool](uavcan_gui_tool.png?raw=true "uavcan_gui_tool")

## 5. Светодиодная индикация

(раздел дополнятеся)

## 6. Примеры применения

В качестве примера, данное устройство может подойти для такого применения, как [Программно-аппаратная UAVCAN-HITL симуляция БПЛА](https://github.com/InnopolisAero/innopolis_vtol_dynamics).

![alt text](https://github.com/InnopolisAero/innopolis_vtol_dynamics/blob/master/img/sniffer_connection.png?raw=true)

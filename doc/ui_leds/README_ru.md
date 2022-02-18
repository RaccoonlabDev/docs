# UAVCAN UI LEDS node

Этот узел устанавливает тот же цвет, что и у автопилота ([ui leds](https://docs.px4.io/master/en/getting_started/led_meanings.html#ui-led)) в режиме disarm и устанавливает определенный сплошной/мигающий цвет ([aviation navigation lights](https://en.wikipedia.org/wiki/Navigation_light#Aviation_navigation_lights)) в режиме armed.

![ui_leds](ui_leds.jpg?raw=true "ui_leds")

## Содержание
  - [1. Интерфейс UAVCAN](#1-uavcan-interface)
  - [2. Спецификация оборудования](#2-hardware-specification)
  - [3. Соединение](#3-wire)
  - [4. Описание основных функций](#4-main-function-description)
  - [5. Описание вспомогательных функций](#5-auxiliary-functions-description)
  - [6. Светодиодная индикация](#6-diagn)
  - [7. Пример использования](#7-usage-example-on-a-table)
  - [8. Пример использования БПЛА](#8-uav-usage-example)

## 1. Интерфейс UAVCAN <a name="3-wire"></a> 

Этот узел взаимодействует посредством следующих сообщений:

| № | тип | сообщение |
| - | --------- | -------- |
| 1 | subscriber | [uavcan.equipment.esc.RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand)|
| 2 | subscriber | [uavcan.equipment.indication.LightsCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#lightscommand)|

Помимо необходимых и очень рекомендуемых функций, таких как `NodeStatus` и `GetNodeInfo`, этот узел также поддерживает следующие функции прикладного уровня:

| № | тип | сообщение |
| - | --------- | -------- |
| 1 | RPC-service | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Спецификация оборудования <a name="2-hardware-specification"></a> 

(раздел дополняется)

## 3. Соединение <a name="3-wire"></a> 

На плате имеется 3 разъема, описание которых преставлено в таблице ниже.

| № | Разъем | Описание |
| - | --------- | ----------- |
| 1 | UCANPHY Micro (JST-GH 4) | Примечание спецификации физического уровня UAVCAN/CAN. Устройства, подающие питание на шину, должны обеспечивать 4,9-5,5 В на линии питания шины, номинальное напряжение 5,0 В. Устройства, получающие питание от шины, должны ожидать 4,0-5,5 В на линии питания шины. Ток не должен превышать 1 А на каждый разъем. |
| 2 | 6-контактный разъем Molex серии 502585 ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670) и [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Разъем поддерживает до 100 В, 2 A на контакт, но плата работает только с 2S-6S. |
| 3 | SWD | Предназначен для обновления прошивки с помощью устройства [programmer-sniffer](doc/programmer_sniffer/README.md). |

## 4. Описание основных функций <a name="4-main-function-description"></a> 

(раздел дополняется)

Конфигурация маппинга может быть выполнена с помощью `uavcan_gui_tool` или даже `QGC`. Ниже приведена таблица с этими параметрами в `uavcan_gui_tool`.

![params](params.png?raw=true "params")

Таблица с расшифровкой параметров:

| № | Имя параметра | Описание |
| - | -------------- | -------- |
| 1 | rgb_leds_max_intensity | Входные команды uavcan линейно масштабируются по интенсивности от 0 до этого значения. Максимальное значение - 255. |
| 2 | rgb_leds_id | Идентификатор uavcan команды, которую воспринимает узел. По умолчанию id 0 соответствует ui led |
| 3 | rgb_leds_default_color | Цвет в режиме arming. Более подробную информацию см. в таблице ниже. |
| 4 | rgb_leds_default_color | Тип свечения в состоянии arming. Более подробную информацию см. в таблице ниже. |
| 5 | rgb_leds_blink_period_ms | Период моргания. Имеет смысл только тогда, когда `rgb_leds_default_color` равен 1 |
| 6 | rgb_leds_blink_duty_cycle_pct | Имеет смысл, только если `rgb_leds_default_color` равен 1 |

Таблица с цветами по умолчанию:

| № | Цвет |
| - | ----------- |
| 0 | красный |
| 1 | зеленый |
| 2 | синий |
| 3 | пурпурный |
| 4 | желтый |
| 5 | голубой |
| 6 | белый |
| 7 | выключен |

Таблица с типами освещения:

| № | Тип |
| - | ----------- |
| 0 | сплошной |
| 1 | мигающий |
| 2 | пульсирующий |

## 5. Описание вспомогательных функций  <a name="5-auxiliary-function-description"></a> 

(раздел дополняется)

## 6. Светодиодная индикация  <a name="6-diagn"></a> 

Данная плата имеет внутренний светодиод, который может позволить вам определить возможные проблемы. Он мигает от 1 до 10 раз в течение 4 секунд. Подсчитав количество миганий, можно определить код текущего состояния.

| Количество миганий | состояние Uavcan | Описание |
| ---------------- | -------------- | ------------------------------- |
| 1 | OK | Все в порядке.                |
| 2 | OK | Нет RawCommand, по крайней мере, в течение последних 0,5 секунд, состояние ШИМ возвращено в состояние по умолчанию. |
| 3 | ПРЕДУПРЕЖДЕНИЕ | Этот узел не видит другие узлы в сети UAVCAN, проверьте кабели. |
| 4 | ОШИБКА | Есть проблема с напряжением цепи, посмотрите сообщение о состоянии цепи, чтобы узнать подробности. Это может произойти при питании от SWD, в противном случае будьте осторожны с питанием. |
| 5 | CRITICAL | Проблема на уровне инициализации периферии. Возможно, вы загрузили неправильную прошивку. |

## 7. Пример использования  <a name="7-usage-example-on-a-table"></a> 

(раздел дополняется)

## 8. Пример использования на БПЛА  <a name="8-uav-usage-example"></a> 

Пример использования на БПЛА cмотрите в этом видео:

[![ui_leds](https://img.youtube.com/vi/s0HAyvo1ACk/0.jpg)](https://youtu.be/s0HAyvo1ACk)

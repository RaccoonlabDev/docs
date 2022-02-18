# Узлы UAVCAN-Node

Узлы UAVCAN Node предназначены, прежде всего, для управления сервоприводами и регуляторами моторов (ESC). Они принимают UAVCAN сообщения [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) от шины CAN и преобразуют их сигнал PWM для управления сервоприводами и регуляторами ESC.

Узел имеет 2 канала (A1 и A2), которые предназначены для прямого соединения с сервоприводами или контроллерами ESC.

Разработано 3 варианта таких плат: `Node-Mini`, `Node-Nano` и `PWM-5A`.

Внешний вид трех модификаций UAVCAN-PWM узла представлен в таблице ниже.

| UAVCAN-PWM node 5A | UAVCAN-PWM node Mini | UAVCAN-PWM node Nano |
| ------- | ------- | -------- |
| ![](5A.png?raw=true "5A")    | ![](node_mini.png?raw=true "mini")  | ![](node_nano.png?raw=true "nano")   |

Сравнение характеристик трёх модификаций представлено в таблице ниже:
    
| № | Характеристика                 | PWM-5A  | Node-Mini     | Node-Nano     |
| - | ------------------------------ | ------- | --------      | ------------- |
| 0 | Стадия разработки              | готова  | готова        | тестируется   |
| 1 | Наличие DC/DC преобразователя  | есть    | есть          | нет           |
| 2 | входное напряжение             | 2S-12S  | 2S-6S         | 4.8-5.6 V     |
| 3 | Датчик тока                    | есть     | нет            | нет           |
| 4 | Дополнительные пины            | нет     | 2             | нет           |

## Содержание
  - [1. Интерфейс UAVCAN](#1-uavcan-interface)
  - [2. Технические характеристики](#2-hardware-specification)
  - [3. Подключение](#3-wire)
  - [4. Основные функции](#4-main-function-description)
  - [5. Дополнительные функции](#5-auxiliary-functions-description)
  - [6. Параметры](#6-parameters)
  - [7. LED-индикация](#7-led-indication)
  - [8. Usage example on a table](#8-usage-example-on-a-table)
  - [9. UAV usage example](#9-uav-usage-example)

## 1. Интерфейс UAVCAN <a name="1-uavcan-interface"></a> 

Узел взаимодействует посредством следующих сообщений:

| № | Тип       | Сообщение  |
| - | --------- | -------- |
| 1 | subscriber | [uavcan.equipment.esc.RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand) |
| 2 | publisher   | [uavcan.equipment.esc.Status](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#status-2) |
| 3 | publisher   | [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) |

Помимо необходимых и очень рекомендуемых функций, таких как `NodeStatus` и `GetNodeInfo`, узел также поддерживает следующие функции прикладного уровня:

| № | Тип       | Сообщение |
| - | --------- | --------  |
| 1 | RPC-service | [uavcan.protocol.param](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#uavcanprotocolparam) |
| 2 | RPC-service | [uavcan.protocol.RestartNode](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#restartnode) |
| 3 | RPC-service | [uavcan.protocol.GetTransportStats](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#gettransportstats) |

## 2. Технические характеристики <a name="2-hardware-specification"></a> 

(раздел дополнятеся)

Габаритный чертеж UAVCAN-Node-Mini:

![can_pwm_mini_scheme](can_pwm_mini_scheme.png?raw=true "can_pwm_mini_scheme")

## 3. Подключение <a name="3-wire"></a> 

На плате имеется 3 разъема, описание которых преставлено в таблице ниже.

| № | Разъем | Описание |
| - | --------- | ----------- |
| 1 | UCANPHY Micro (JST-GH 4) | Примечание спецификации физического уровня UAVCAN/CAN. Устройства, подающие питание на шину, должны обеспечивать 4,9-5,5 В на линии питания шины, номинальное напряжение 5,0 В. Устройства, получающие питание от шины, должны ожидать 4,0-5,5 В на линии питания шины. Ток не должен превышать 1 А на каждый разъем. |
| 2 | 6-контактный разъем Molex серии 502585 ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670) и [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Разъем поддерживает до 100 В, 2 A на контакт, но плата работает только с 2S-6S. |
| 3 | SWD | Предназначен для обновления прошивки с помощью устройства [programmer-sniffer](doc/programmer_sniffer/README.md). |

UAVCAN-PWM узел также имеет 2 группы разъемов, предназначенных для подключения серв или ESC, управляемых ШИМ. Пример подключения представлен на рисунке ниже.

![can_pwm_mini_scheme](servo_connection.jpg?raw=true "can_pwm_mini_scheme")
Рис. Пример подключения сервы к каналу А1 узла UAVCAN-PWM mini

## 4. Основные функции <a name="4-main-function-description"></a> 

Узел получает сообщение UAVCAN [RawCommand](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawcommand), которое имеет массив до 20 каналов и может обрабатывать до 2 (4) из них. Каждый канал нормализован в диапазоне [-8192, 8191].
Выходом для каждого заданного канала RawCommand является сигналом ШИМ с частотой 50 Гц и длительностью от 900 до 2000 мкс. Обычно 900 мкс означает минимальное положение сервопривода или остановленного двигателя на ESC, а 2000 мкс – максимальное управляющее воздействие. Но этот диапазон может отличаться в зависимости от вашего мотора или желаемого угла управления вашим сервоприводом. Вы также можете инвертировать выход вашего сервопривода и установить положение сервопривода по умолчанию, отличное от минимального или максимального, например, среднее.

Конфигурация сопоставления (мапинга) команды RawCommand и выходного уровня может быть выполнена с использованием 4 параметров: `channel`, `min`, `max` и `def`, которые существуют для каждого канала ШИМ, как подробнее показано в разделе `6. Параметры`.

Ниже вы можете увидеть визуализацию этого сопоставления.

![mapping](can_pwm_mapping.png?raw=true "mapping")

Рис. Настройка соответствия вход-выход UAVCAN->PWM

## 5. Дополнительные функции <a name="5-auxiliary-functions-description"></a> 

**Состояние цепи CircuitStatus**

Узел UAVCAN-node отправляет 2 сообщения [uavcan.equipment.power.CircuitStatus](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#circuitstatus) с измеренными `5V` и `Vin`.

Первое сообщение имеет идентификатор `circuit_id=NODE_ID*10 + 0` и следующие 3 значимых поля:
1. voltage - напряжение 5В
2. current - максимальный ток за последние 0,5 секунды (поддерживается только узлом `PWM-5A`)
3. error_flags - может быть выставлен в значение ERROR_FLAG_OVERVOLTAGE или ERROR_FLAG_UNDERVOLTAGE

Второе сообщение имеет идентификатор `circuit_id=NODE_ID*10 + 1` и следующие 3 значимых поля:
1. voltage - напряжение Vin
2. current - среднее значение тока за последние 0,5 секунды (поддерживается только узлом `PWM-5A`)
3. error_flags - может быть выставлен флаг ERROR_FLAG_UNDERVOLTAGE. Флаг ERROR_FLAG_OVERVOLTAGE отсутствует, потому что ожидаемое максимальное напряжение Vin неизвестно.

Ниже приведен пример потребляемого тока при напряжении питания 5 В:

![max and avg current plot](current_plot.png?raw=true "max and avg current plot")

Рис. Измерение максимального и среднего тока

Здесь голубой цвет графика - ток в амперах с максимальным фильтром, желтый - ток в амперах со средним фильтром. Пики соотвествуют моментам, когда сервопривод меняет свое положение.

```
Примечание: только узел `PWM-5A` поддерживает измерение тока. Все узлы поддерживают измерение `5V` и `Vin`.
```

**Состояние ESC**

Если вы используете прошивку ESC, она будет посылать сообщение [uavcan.equipment.esc.Status](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#status-2) с оборотами, напряжением и током в качестве обратной связи от `esc flame` через uart.

## 6. Параметры <a name="6-parameters"></a> 

Ниже показан рисунок из `uavcan_gui_tool` со списком всех параметров.

![scheme](can_pwm_params.png?raw=true "scheme")

**Конфигурация сопоставления вход-выход UAVCAN->PWM**

Здесь есть 2 или 4 группы параметров `A1`, `A2`, `B1`, `B2`. Ниже приведена таблица с их описанием:

| № | Имя параметра  | Описание |
| - | -------------- | -------- |
| 1 | channel        | Specify here a desired `RawCommand` channel you want to map into particular PWM pin. Default value -1 means disable. |
| 2 | min            | Длительность ШИМ при RawCommand = 0. |
| 3 | max            | Длительность ШИМ при RawCommand = 8191. |
| 4 | def            | Длительность ШИМ при RawCommand < 0 или когда нет RawCommand в течение нескольких секунд. |

**Проверка питания**

Такие параметры, как `enable_5v_check` и `enable_vin_check` предназначены для включения/выключения проверки `5V` и `Vin`:
- Если включена проверка `5V`, состояние узла будет `ERROR`, если напряжение `5V` меньше 4.5V или больше 5.5V.
- Если включена проверка `Vin`, состояние узла будет `ERROR`, если напряжение `Vin` меньше 4.5В.

**Настройка имени узла**

По умолчанию этот узел имеет имя общего назначения `inno.can.pwm_node`. Это имя может быть изменено на более конкретное путем изменения параметра `name`.

Список доступных имен приведен ниже.

| Param value | Node name                 |
| ----------- | ------------------------- |
| 0           | default                   |
| 1           | inno.esc.right_front      |
| 2           | inno.esc.left_rear        |
| 3           | inno.esc.left_front       |
| 4           | inno.esc.right_rear       |
| 5           | inno.esc.left             |
| 6           | inno.esc.right            |
| 7           | inno.esc.front            |
| 8           | inno.esc.rear             |
| 9           | inno.servos.aileron_left  |
| 10          | inno.servos.aileron_right |
| 11          | inno.servos.elevators     |
| 12          | inno.servos.rudders       |

Необходимо отправить соответствующий номер желаемого имени, сохранить параметр внутри узла и перезапустить его.

## 7. Светодиодная индикация <a name="7-led-indication"></a> 

Эта плата имеет внутренний индикатор, который может позволить вам понять возможные проблемы. Он мигает от 1 до 10 раз в течение 4 секунд. Подсчитав количество миганий, можно определить код текущего состояния.

| Количество миганий | Состояние   | Описание                     |
| ----------------   | -------------- | ------------------------------- |
| 1                  | OK             | Все в порядке.                |
| 2                  | OK             | Отсутствие команды RawCommand в течение последних 0,5 секунд, состояние ШИМ возвращается в состояние по умолчанию. |
| 3                  | WARNING        | Этот узел не видит другие узлы в сети UAVCAN, проверьте кабели. |
| 4                  | ERROR          | Существует проблема с напряжением цепи, посмотрите сообщение о состоянии цепи, чтобы узнать подробности. Это может произойти при питании от SWD, в противном случае проверьте питание. |
| 5                  | CRITICAL       | Существует проблема на уровне инициализации периферии. Возможно, вы загрузили неправильную прошивку. |

## 8. Пример запуска на стенде <a name="8-usage-example-on-a-table"></a> 

Рекомендуется проводить отладку с помощью [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool). Вы можете настроить параметры, подключить сервопривод к одному из каналов и проверить его с помощью `ESC панели`, как показано ниже.

![esc_panel](esc_panel.png?raw=true "esc_panel")

## 9. Использование на БПЛА <a name="9-uav-usage-example"></a> 

Этот узел многократно испытан на нескольких мультикоптерах и VTOL-самолетах.


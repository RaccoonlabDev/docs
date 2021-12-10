## Узел моста UAVCAN WiFi

Эта плата является мостом между UAVCAN/CAN и UDP/WiFi.

![wifi_bridge](wifi_bridge.png?raw=true "wifi_bridge")

## Содержание
  - [1. Интерфейс UAVCAN](#1-uavcan-interface)
  - [2. Спецификация оборудования](#2-hardware-specification)
  - [3. Подключение](#3-wire)
  - [4. Описание основных функций](#4-main-function-description)
  - [5. Описание вспомогательных функций](#5-auxiliary-function-description)
  - [6. Светодиодная индикация](#6-led-indication)
  - [7. Пример использования на стенде](#7-usage-example-on-a-table)
  - [8. Пример использования с БПЛА](#8-uav-usage-example)
  - [9. Тесты производительности](#9-performance-tests)


## 1. Интерфейс UAVCAN <a name="1-uavcan-interface"></a> 

Этот узел не отправляет никаких [(]переодических] сообщений и подписывается на все из них.

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

- маленький - на нем 5В
- большой - до 30 В

(в процессе)

## 4. Описание основных функций <a name="4-main-function-description"></a> 

Этот узел подходит для удаленной конфигурации узлов сети UAVCAN или регистрации потока данных.

![params](params.png?raw=true "params")

## 5. Описание вспомогательных функций <a name="5-auxiliary-function-description"></a> 

(нет)

## 6. Светодиодная индикация <a name="6-led-indication"></a> 

Данная плата имеет 2 светодиода. Один из них предназначен для индикации состония микроконтроллера STM32, другой - для EPS8266.

Оба светодиода позволяют понять возможные проблемы. Они мигают от 1 до 5 раз в течение 2 секунд, а затем ждут 2 секунды. Подсчитав количество миганий, можно определить код текущего состояния.

Значение миганий светодиода STM32:

| Количество миганий | Состояние | Описание |
| ---------------- | -------------- | ------------------------------- |
| 1 | OK | UART и CAN принимают и работают.
| 2 | ПРЕДУПРЕЖДЕНИЕ | Нет данных RX от UART |
| 3 | ПРЕДУПРЕЖДЕНИЕ | Нет данных RX от CAN | 
| 4 | ПРЕДУПРЕЖДЕНИЕ | Нет данных RX вообще |
| 5 | CRITICAL | Проблема на уровне инициализации периферии. Возможно, вы загрузили неправильную прошивку. |

## 7. Пример использования на стенде <a name="7-usage-example-on-a-table"></a> 

(в процессе)

## 8. Пример использования БПЛА <a name="8-uav-usage-example"></a> 

(в процессе)

## 9. Тесты производительности <a name="9-performance-tests"></a> 

На данный момент эта плата поддерживает поток до 1200 сообщений в секунду. Этот предел будет увеличен в ближайшее время после некоторой оптимизации.



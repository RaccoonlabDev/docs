## UAVCAN Sniffer and Programmer

UAVCAN sniffer and programmer has two devices on one board:
- USB-UAVCAN adapter to connect your PC to UAVCAN bus with SLCAN for real-time monitoring of CAN bus and UAVCAN transfer dissection with [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool)
- SWD programmer to update the firmware of your UAVCAN nodes.

This device is mainly intended for developers in robotics (UAV, UGV, AUV, USV, etc.), working with UAVCAN and PX4/Ardupilot. But it might be used for sniffering CAN-bus and programming any other microcontoller as well.

![programmer_sniffer](programmer_sniffer.png?raw=true "programmer_sniffer")

## Content
  - [1. Wire](#1-wire)
  - [2. Hardware specification](#2-wire)
  - [3. Wire](#3-wire)
  - [4. Programmer usage](#4-programmer-usage)
  - - [4.1. Windows](#41-windows)
  - - [4.2. Linux](#42-linux)
  - [5. Sniffer usage](#5-sniffer-usage)
  - [6. Led indication](#6-led-indication)
  - [7. Application examples](#7-application-examples)

## 1. Wire

This device connects to PC via USB-C interface.

It has 2 types of CAN-intarfaces:
- `UCANPHY Micro (4 pin)` socket that is standart UAVCAN socket, described in [UAVCAN/CAN Physical Layer Specification](https://forum.uavcan.org/t/uavcan-can-physical-layer-specification-v1-0/1471)
- `Molex CLIK-Mate 502585-0670 6 pin` socket 

It has also SWD socket.

```
WARNING: Be carefull, 4-pin CAN and SWD sockets look similar, but wrong connection may cause to some problems. These sockets are marked on the back side of the board.
```

## 2. Hardware specification

(in process)

## 3. Wire

(in process)

## 4. Programmer usage

You may program your devices in any way you want. The easiest way in our opinion is to use st-link utility.


### 4.1. Windows

1. Install `ST-LINK utility` from [the official site](https://www.st.com/en/development-tools/stsw-link004.html)
2. Use GUI to program a node with desired .bin file


### 4.2. Linux

1. Install `st-link` using [the instruction from the official github repository](https://github.com/stlink-org/stlink#installation)
2. Type following to program your device with desired .bin file:

```bash
st-flash write desired_bin_file.bin 0x8000000
```

where `desired_bin_file.bin` is the the name of binary file.

## 5. Sniffer usage

You need to connect `programmer-sniffer` with  your UAVCAN node via CAN socket and with your PC via USB.

There are 2 different CAN sockets. You can use any of them.

```
Be carefull, don't use SWD instead of CAN socket!
```

After that you can use [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool) utility or something other.

![app_setup](app_setup.png?raw=true "app_setup")

In Application Setup menu you need to set `1000000` to both can bus and adapter baud rates.

After that you will get get following window:

![uavcan_gui_tool](uavcan_gui_tool.png?raw=true "uavcan_gui_tool")

## 6. Led indication

(in process)

## 7. Application examples

As an example, this device might be suitable for such application as [UAVCAN HITL simulation](https://github.com/InnopolisAero/innopolis_vtol_dynamics).

![alt text](https://github.com/InnopolisAero/innopolis_vtol_dynamics/blob/master/img/sniffer_connection.png?raw=true)
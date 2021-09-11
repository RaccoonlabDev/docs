## programmer-sniffer

Programmer-sniffer is a single device with capability of programmer and UAVCAN sniffer based on SLCAN.

![programmer_sniffer](programmer_sniffer.png?raw=true "programmer_sniffer")

## Content
  - [1. Wire](#1-wire)
  - [2. Hardware specification](#2-wire)
  - [3. Led indication](#3-led-indication)
  - [4. Programmer usage](#4-programmer-usage)
  - - [4.1. Windows](#41-windows)
  - - [4.2. Linux](#42-linux)
  - [5. Sniffer usage](#5-sniffer-usage)
  - [6. Application examples](#6-application-examples)

## 1. Wire

```
WARNING: Be carefull, CAN and SWD sockets look similar, but wrong connection may cause to some problems. These sockets are marked on the back side of the board.
```

## 2. Hardware specification

(in process)

## 3. Led indication

(in process)

## 4. Programmer usage

It is suggested to use st-link utility


### 4.1. Windows

1. Install it from [st.com](https://www.st.com/en/development-tools/stsw-link004.html)
2. Use GUI to program a node with desired .bin file


### 4.2. Linux

You need to connect `programmer-sniffer` with  your UAVCAN node via SWD socket and with your PC via USB. Be carefull, don't use CAN socket!

1. Install stlink using [official instructions](https://github.com/stlink-org/stlink#installation)
2. Type following to program it with desired .bin file:

```bash
st-flash write desired_bin_file.bin 0x8000000
```

where `desired_bin_file.bin` is the the name of binary file

## 5. Sniffer usage

You need to connect `programmer-sniffer` with  your UAVCAN node via CAN socket and with your PC via USB.

There are 2 different CAN sockets. You can use any of them. Be carefull, don't use SWD socket!

After that you can use [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool) utility or something other.

![app_setup](app_setup.png?raw=true "app_setup")

![uavcan_gui_tool](uavcan_gui_tool.png?raw=true "uavcan_gui_tool")

## 6. Application examples

As an example, this device might be suitable for such application as [UAVCAN HITL simulation](https://github.com/InnopolisAero/innopolis_vtol_dynamics).

![alt text](https://github.com/InnopolisAero/innopolis_vtol_dynamics/blob/master/img/sniffer_connection.png?raw=true)
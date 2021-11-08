## UAVCAN Sniffer and Programmer

UAVCAN sniffer and programmer has two devices on one board:
- USB-UAVCAN adapter to connect your PC to UAVCAN bus with SLCAN for real-time monitoring of CAN bus and UAVCAN transfer dissection with [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool)
- SWD programmer to update the firmware of your UAVCAN nodes.

This device is mainly intended for developers in robotics (UAV, UGV, AUV, USV, etc.), working with UAVCAN and PX4/Ardupilot. But it might be used for sniffering CAN-bus and programming any other microcontoller as well.

![programmer_sniffer](programmer_sniffer.png?raw=true "programmer_sniffer")

## Content
  - [1. Hardware specification](#1-wire)
  - [2. Wire](#2-wire)
  - [3. Programmer usage](#3-programmer-usage)
  - - [3.1. Windows](#31-windows)
  - - [3.2. Linux](#32-linux)
  - [4. Sniffer usage](#4-sniffer-usage)
  - [5. Led indication](#5-led-indication)
  - [6. Application examples](#6-application-examples)

## 1. Hardware specification

(in process)

## 2. Wire

This device has 4 sockets:

![wire](wire.png?raw=true "wire")


1. USB Type-C for connection with PC
2. 4-pin CAN-socket (`UCANPHY Micro - JST-GH 4`). This socket is described in [UAVCAN/CAN Physical Layer Specification](https://forum.uavcan.org/t/uavcan-can-physical-layer-specification-v1-0/1471). Short note from the standard below: 
```
UAVCAN/CAN Physical Layer Specification note.
Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal.
Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not
exceed 1 A per connector.
```
3. 6-pin CAN-socket (`Molex series 502585 connector`: [502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670) and [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600))

```
Up to 100 V, 2 A per contact
```

4. It also has SWD socket that is dedicated for updating firmware using [programmer-sniffer](doc/programmer_sniffer/README.md) device.

```
WARNING: Be carefull, 4-pin CAN and SWD sockets look similar, but wrong connection may cause to some problems. Names of these sockets are marked on the back side of the board.
```

## 3. Programmer usage

You may program your devices in any way you want. The easiest way in our opinion is to use st-link utility.


### 3.1. Windows

1. Install `ST-LINK utility` from [the official site](https://www.st.com/en/development-tools/stsw-link004.html)
2. Use GUI to program a node with desired .bin file


### 3.2. Linux

1. Install `st-link` using [the instruction from the official github repository](https://github.com/stlink-org/stlink#installation)
2. Type following to program your device with desired .bin file:

```bash
st-flash write desired_bin_file.bin 0x8000000
```

where `desired_bin_file.bin` is the the name of binary file.

## 4. Sniffer usage

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

## 5. Led indication

(in process)

## 6. Application examples

As an example, this device might be suitable for such application as [UAVCAN HITL simulation](https://github.com/InnopolisAero/innopolis_vtol_dynamics).

![alt text](https://github.com/InnopolisAero/innopolis_vtol_dynamics/blob/master/img/sniffer_connection.png?raw=true)
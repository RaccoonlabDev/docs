## programmer-sniffer

Programmer-sniffer is a single device with capability of programmer and UAVCAN sniffer.

![programmer_sniffer](programmer_sniffer.png?raw=true "programmer_sniffer")

```
WARNING: Be carefull, CAN and SWD sockets look similar, but wrong connection may cause to some problems. These sockets are marked on the back side of the board.
```

**1. How to program a node**

It is suggested to use st-link utility

**1.1. Windows**

1. Install it from [st.com](https://www.st.com/en/development-tools/stsw-link004.html)
2. Use GUI to program a node with desired .bin file


**1.2. Linux**

You need to connect `programmer-sniffer` with  your UAVCAN node via SWD socket and with your PC via USB. Be carefull, don't use CAN socket!

1. Install stlink using [official instructions](https://github.com/stlink-org/stlink#installation)
2. Type following to program it with desired .bin file:

```bash
st-flash write desired_bin_file.bin 0x8000000
```

where `desired_bin_file.bin` is the the name of binary file

**2. How to use sniffer**

You need to connect `programmer-sniffer` with  your UAVCAN node via CAN socket and with your PC via USB.

There are 2 different CAN sockets. You can use any of them. Be carefull, don't use SWD socket!

After that you can use [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool) utility or something other.

![app_setup](app_setup.png?raw=true "app_setup")

![uavcan_gui_tool](uavcan_gui_tool.png?raw=true "uavcan_gui_tool")
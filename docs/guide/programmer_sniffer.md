# UAVCAN Sniffer and Programmer

UAVCAN sniffer and programmer has two devices on one board:
- USB-UAVCAN adapter to connect your PC to UAVCAN bus with SLCAN for real-time monitoring of CAN bus and UAVCAN transfer dissection with [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool)
- SWD programmer to update the firmware of your UAVCAN nodes.

This device is mainly intended for developers in robotics (UAV, UGV, AUV, USV, etc.), working with UAVCAN and PX4/Ardupilot. But it might be used for sniffing CAN-bus and programming other microcontroller as well.

![programmer_sniffer](../../assets/programmer_sniffer/programmer_sniffer.png?raw=true "programmer_sniffer")

## 1. Hardware specification

Schematic represented in [this repo](https://github.com/sainquake/UAVCAN-Sniffer-STM-Programmer), and PDF version is [here](https://github.com/sainquake/UAVCAN-Sniffer-STM-Programmer/blob/master/Project%20Outputs%20for%20CAN_SNIFFER/Output.PDF)

![CAD](https://github.com/sainquake/UAVCAN-Sniffer-STM-Programmer/blob/master/CAD/CAN_SNIFFER.JPG?raw=true "CAD")

## 2. Wire

This board has 4 connectors which are described in the table below.

| № | Connector | Description |
| - | --------- | ----------- |
| 1 | USB Type-C | Dedicated for connection with PC |
| 21 | UCANPHY Micro (JST-GH 4) | Devices that deliver power to the bus are required to provide 4.9–5.5 V on the bus power line, 5.0 V nominal. Devices that are powered from the bus should expect 4.0–5.5 V on the bus power line. The current shall not exceed 1 A per connector. |
| 3 | 6-pin Molex  ([502585-0670](https://www.molex.com/molex/products/part-detail/pcb_receptacles/5025850670), [502578-0600](https://www.molex.com/molex/products/part-detail/crimp_housings/5025780600)) | Contacts support up to 100 V, 2 A per contact. But the board may work only with 2S-6S. |
| 4 | SWD | STM32 firmware updating using [programmer-sniffer](docs/guide/programmer_sniffer/README.md). |


```
!!!WARNING!!!
Be careful, 4-pin CAN and SWD connectors look similar, but the wrong connection may cause some problems. Names of these connectors are marked on the backside of the board.
```

## 3. Programmer usage

You may program your devices in any way you want. The easiest way in our opinion is to use st-link utility.


### 3.1. Windows

1. Install `ST-LINK utility` from [the official site](https://www.st.com/en/development-tools/stsw-link004.html)
2. Download desired firmware here https://github.com/InnopolisAero/inno_uavcan_node_binaries/releases
3. Open `ST-LINK utility`, connect programmer to PC by USB
4. Connect target device to programmer by SWD, as shown in picture (IMPORTANT! Check right way of connection on picture)


5. Choose option `Target -> Connect`. Device should connect, else you can see 2 types of error whitch shown on pictures below.


7. You should see `Devie ID` if everything fine (as shown in picture below)


9. Choose `file -> open file ...` and navigate to firmware .bin file dowloaded in p.2

pic pic


11. Choose `Target -> Program & Verify ... CTRL+P`
12. You should see `Verification...OK` if everythin is ok.


### 3.2. Linux

1. Install `st-link` using [the instruction from the official GitHub repository](https://github.com/stlink-org/stlink#installation)
2. Type the following to program your device with desired .bin file:

```bash
st-flash write desired_bin_file.bin 0x8000000
```

where `desired_bin_file.bin` is the name of the binary file.

## 4. Sniffer usage

You need to connect `programmer-sniffer` with your UAVCAN node via CAN socket and with your PC via USB.

There are 2 different CAN sockets. You can use any of them.

```
Be careful, don't use SWD instead of CAN socket!
```

After that, you can use [uavcan_gui_tool](https://github.com/UAVCAN/gui_tool) utility or something other.

![app_setup](../../assets/programmer_sniffer/app_setup.png?raw=true "app_setup")

In the Application Setup menu you need to set `1000000` to both can bus and adapter baud rates.

After that you will get following window:

![uavcan_gui_tool](../../assets/programmer_sniffer/uavcan_gui_tool.png?raw=true "uavcan_gui_tool")

## 5. Led indication

(in progress)

## 6. Application examples

As an example, this device might be suitable for such applications as [UAVCAN HITL simulation](https://github.com/InnopolisAero/innopolis_vtol_dynamics).

![alt text](https://github.com/InnopolisAero/innopolis_vtol_dynamics/blob/master/img/sniffer_connection.png?raw=true)

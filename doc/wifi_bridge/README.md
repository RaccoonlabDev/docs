## can_uart_bridge

This board aimed at converting all received messages from UART to corresponded frames in CAN and
send them, and the same from CAN to UART.

Led description:

- this node blinks from 1 to 5 times for 2 seconds, then waits for 2 seconds
- number of blinking indicates the current state of board
- 1 pulse means that all is ok: UART and CAN are receiving and working ok at least for the last 4
seconds
- 2 pulses means that there is no RX data from uart for last period of time
- 3 pulses means that there is no RX data from CAN for last period of time
- 4 pulses means that there is no RX data at all for last period of time
- 5 pulses are reserved for future usage
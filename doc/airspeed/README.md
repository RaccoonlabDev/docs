## airspeed

This board is a wrapper under [MS4525DO airspeed sensor](https://www.te.com/commerce/DocumentDelivery/DDEController?Action=showdoc&DocId=Data+Sheet%7FMS4525DO%7FB2%7Fpdf%7FEnglish%7FENG_DS_MS4525DO_B2.pdf%7FCAT-BLPS0002) that allow use it through UAVCAN network.

It read measurements from i2c and publishes temperature and differential pressure.

Uavcan message type: [uavcan.equipment.air_data.RawAirData](https://legacy.uavcan.org/Specification/7._List_of_standard_data_types/#rawairdata).

**Message example**

![scheme](airspeed_message.png?raw=true "scheme")

**Parameters**

![scheme](airspeed_params.png?raw=true "scheme")
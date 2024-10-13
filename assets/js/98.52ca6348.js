(window.webpackJsonp=window.webpackJsonp||[]).push([[98],{670:function(e,t,a){e.exports=a.p+"assets/img/t-view.42a0bfba.png"},802:function(e,t,a){"use strict";a.r(t);var r=a(14),i=Object(r.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"cyphal-dronecan-uav-lights-node"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#cyphal-dronecan-uav-lights-node"}},[e._v("#")]),e._v(" Cyphal/DroneCAN UAV Lights node")]),e._v(" "),t("p",[e._v("The node is designed for light unmanned aerial (UAV) and other vehicles.")]),e._v(" "),t("p",[e._v("The node blinks LEDs either by the command received from the autopilot or by the configured behavior. It might be used as "),t("a",{attrs:{href:"https://en.wikipedia.org/wiki/Navigation_light#Aviation_navigation_lights",target:"_blank",rel:"noopener noreferrer"}},[e._v("aviation navigation lights"),t("OutboundLink")],1),e._v(".")]),e._v(" "),t("p",[e._v("For interface related details please refer "),t("RouterLink",{attrs:{to:"/guide/ui_leds/dronecan.html"}},[e._v("DroneCAN interface")]),e._v(". For hardware related details please refer to "),t("RouterLink",{attrs:{to:"/guide/ui_leds/hardware.html"}},[e._v("hardware")]),e._v(" page.")],1),e._v(" "),t("p",[t("img",{attrs:{src:a(670),alt:"ui_leds",title:"ui_leds"}})]),e._v(" "),t("h2",{attrs:{id:"_1-1-variations"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-variations"}},[e._v("#")]),e._v(" 1.1. Variations")]),e._v(" "),t("p",[e._v("There are different board types.")]),e._v(" "),t("table",[t("thead",[t("tr",[t("th",[e._v("№")]),e._v(" "),t("th",[e._v("Feature")]),e._v(" "),t("th",[e._v("v1.0")]),e._v(" "),t("th",[e._v("v2.0")])])]),e._v(" "),t("tbody",[t("tr",[t("td",[e._v("1")]),e._v(" "),t("td",[e._v("Number of LEDs")]),e._v(" "),t("td",[e._v("15")]),e._v(" "),t("td",[e._v("32")])]),e._v(" "),t("tr",[t("td",[e._v("2")]),e._v(" "),t("td",[e._v("Number of CAN connectors")]),e._v(" "),t("td",[e._v("1")]),e._v(" "),t("td",[e._v("2")])]),e._v(" "),t("tr",[t("td",[e._v("3")]),e._v(" "),t("td",[e._v("Size, mm")]),e._v(" "),t("td",[e._v("40x100")]),e._v(" "),t("td",[e._v("40x72")])]),e._v(" "),t("tr",[t("td",[e._v("4")]),e._v(" "),t("td",[e._v("Status")]),e._v(" "),t("td",[e._v("Deprecated")]),e._v(" "),t("td",[e._v("ok")])])])]),e._v(" "),t("h2",{attrs:{id:"_1-2-main-function-description"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-main-function-description"}},[e._v("#")]),e._v(" 1.2. Main function description")]),e._v(" "),t("p",[e._v("The node subscribes on LightsCommand and setpoint ("),t("a",{attrs:{href:"https://dronecan.github.io/Specification/7._List_of_standard_data_types/#lightscommand",target:"_blank",rel:"noopener noreferrer"}},[e._v("LightsCommand"),t("OutboundLink")],1),e._v(" and "),t("a",{attrs:{href:"https://dronecan.github.io/Specification/7._List_of_standard_data_types/#rawcommand",target:"_blank",rel:"noopener noreferrer"}},[e._v("RawCommand"),t("OutboundLink")],1),e._v(" in DroneCAN). It works in 2 modes:")]),e._v(" "),t("ul",[t("li",[e._v("If the vehicle is disarmed and there is a LightsCommand, the device will process the desired command.")]),e._v(" "),t("li",[e._v("Othwerwise, the device will be in configured mode.")])]),e._v(" "),t("p",[e._v("The first mode is usefull when the vehicle is on the ground. Typically, it will repeat the autopilot's RGB LEDs to inform you the current vehicle status.")]),e._v(" "),t("p",[e._v("The second mode corresponds to the standard "),t("a",{attrs:{href:"https://en.wikipedia.org/wiki/Navigation_light#Aviation_navigation_lights",target:"_blank",rel:"noopener noreferrer"}},[e._v("aviation navigation lights"),t("OutboundLink")],1),e._v(". Typically, you need 3 lights:")]),e._v(" "),t("ul",[t("li",[e._v("solid RED on the left side,")]),e._v(" "),t("li",[e._v("solid GREEN on the right side,")]),e._v(" "),t("li",[e._v("white on the tail.")])]),e._v(" "),t("p",[e._v("The device supports different colors, brightness and type: solid, blink or pulsing with different intensity and timeouts.")]),e._v(" "),t("h2",{attrs:{id:"_1-3-auxiliary-functions-description"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-3-auxiliary-functions-description"}},[e._v("#")]),e._v(" 1.3. Auxiliary functions description")]),e._v(" "),t("p",[t("strong",[e._v("1.3.1 Circuit status")])]),e._v(" "),t("p",[e._v("This node, like all of our nodes, measures and publishes "),t("code",[e._v("5V")]),e._v(", "),t("code",[e._v("Vin")]),e._v(" voltages and device temperature.")]),e._v(" "),t("ul",[t("li",[e._v("For DroneCAN implementation details please visit the "),t("RouterLink",{attrs:{to:"/guide/ui_leds/dronecan.html"}},[e._v("DroneCAN page")]),e._v(".")],1)]),e._v(" "),t("p",[t("strong",[e._v("1.3.2 Led indication")])]),e._v(" "),t("p",[e._v("This board has an internal LED that can help you to understand possible problems. Please refer to "),t("RouterLink",{attrs:{to:"/guide/intro/leds.html"}},[e._v("the LED Meaning")]),e._v(" page for more details.")],1),e._v(" "),t("p",[e._v("All protocol specific features please read on the corresponding page.")]),e._v(" "),t("h2",{attrs:{id:"_1-4-software-update"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-4-software-update"}},[e._v("#")]),e._v(" 1.4. Software update")]),e._v(" "),t("p",[e._v("The node doesn't yet support software upload via CAN yet. But the next generation of the device will be. We will be using a "),t("a",{attrs:{href:"https://github.com/Zubax/kocherga",target:"_blank",rel:"noopener noreferrer"}},[e._v("Kocherga bootloader"),t("OutboundLink")],1),e._v(" in the future. At the moment the only way to upload the software is to use a programmer. See "),t("a",{attrs:{href:"https://raccoonlabdev.github.io/docs/guide/programmer_sniffer/#_3-programmer-usage",target:"_blank",rel:"noopener noreferrer"}},[e._v("the programmer usage section"),t("OutboundLink")],1),e._v(" for details.")])])}),[],!1,null,null,null);t.default=i.exports}}]);
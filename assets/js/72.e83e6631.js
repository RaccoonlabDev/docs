(window.webpackJsonp=window.webpackJsonp||[]).push([[72],{576:function(t,a,s){t.exports=s.p+"assets/img/pmu_cover.4cce53f5.png"},577:function(t,a,s){t.exports=s.p+"assets/img/battery_info_msg.6d28c9ed.png"},578:function(t,a,s){t.exports=s.p+"assets/img/pmu_status_msg.e74b5126.png"},579:function(t,a,s){t.exports=s.p+"assets/img/pmu_params.41e5efd4.png"},778:function(t,a,s){"use strict";s.r(a);var n=s(14),r=Object(n.a)({},(function(){var t=this,a=t._self._c;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"pmu-6s-node"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#pmu-6s-node"}},[t._v("#")]),t._v(" PMU 6S node")]),t._v(" "),a("p",[t._v("This board monitors the battery (voltage and current) and allows to control charging, source and load. It might be useful for applications where you need to control the power of the drone including the board computer and charging process.")]),t._v(" "),a("p",[a("img",{attrs:{src:s(576),alt:"pmu_cover",title:"pmu_cover"}})]),t._v(" "),a("h3",{attrs:{id:"_1-dronecan-interface"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-dronecan-interface"}},[t._v("#")]),t._v(" 1. DroneCAN interface")]),t._v(" "),a("p",[t._v("This node interacts with the following messages:")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("№")]),t._v(" "),a("th",[t._v("type")]),t._v(" "),a("th",[t._v("message")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[t._v("1")]),t._v(" "),a("td",[t._v("publisher")]),t._v(" "),a("td",[a("a",{attrs:{href:"https://dronecan.github.io/Specification/7._List_of_standard_data_types/#batteryinfo",target:"_blank",rel:"noopener noreferrer"}},[t._v("uavcan.equipment.power.BatteryInfo"),a("OutboundLink")],1)])]),t._v(" "),a("tr",[a("td",[t._v("2")]),t._v(" "),a("td",[t._v("publisher")]),t._v(" "),a("td",[a("a",{attrs:{href:"https://dronecan.github.io/Specification/7._List_of_standard_data_types/#circuitstatus",target:"_blank",rel:"noopener noreferrer"}},[t._v("uavcan.equipment.power.CircuitStatus"),a("OutboundLink")],1)])]),t._v(" "),a("tr",[a("td",[t._v("3")]),t._v(" "),a("td",[t._v("publisher")]),t._v(" "),a("td",[t._v("inno_msgs.PmuStatus")])]),t._v(" "),a("tr",[a("td",[t._v("4")]),t._v(" "),a("td",[t._v("subscriber")]),t._v(" "),a("td",[t._v("inno_msgs.PmuChargerControl")])]),t._v(" "),a("tr",[a("td",[t._v("5")]),t._v(" "),a("td",[t._v("subscriber")]),t._v(" "),a("td",[t._v("inno_msgs.PmuPowerControl")])]),t._v(" "),a("tr",[a("td",[t._v("6")]),t._v(" "),a("td",[t._v("subscriber")]),t._v(" "),a("td",[t._v("inno_msgs.PmuLoadControl")])])])]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("№")]),t._v(" "),a("th",[t._v("type")]),t._v(" "),a("th",[t._v("message")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[t._v("1")]),t._v(" "),a("td",[t._v("RPC-service")]),t._v(" "),a("td",[a("a",{attrs:{href:"https://dronecan.github.io/Specification/7._List_of_standard_data_types/#uavcanprotocolparam",target:"_blank",rel:"noopener noreferrer"}},[t._v("uavcan.protocol.param"),a("OutboundLink")],1)])]),t._v(" "),a("tr",[a("td",[t._v("2")]),t._v(" "),a("td",[t._v("RPC-service")]),t._v(" "),a("td",[a("a",{attrs:{href:"https://dronecan.github.io/Specification/7._List_of_standard_data_types/#restartnode",target:"_blank",rel:"noopener noreferrer"}},[t._v("uavcan.protocol.RestartNode"),a("OutboundLink")],1)])]),t._v(" "),a("tr",[a("td",[t._v("3")]),t._v(" "),a("td",[t._v("RPC-service")]),t._v(" "),a("td",[a("a",{attrs:{href:"https://dronecan.github.io/Specification/7._List_of_standard_data_types/#gettransportstats",target:"_blank",rel:"noopener noreferrer"}},[t._v("uavcan.protocol.GetTransportStats"),a("OutboundLink")],1)])])])]),t._v(" "),a("h3",{attrs:{id:"_2-main-function-description"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-main-function-description"}},[t._v("#")]),t._v(" 2. Main function description")]),t._v(" "),a("p",[t._v("This board monitor:")]),t._v(" "),a("ol",[a("li",[t._v("battery voltage (PA0, k=13.91)")]),t._v(" "),a("li",[t._v("5V voltage (PA1, k=2)")]),t._v(" "),a("li",[t._v("charger contact status (PB4)")]),t._v(" "),a("li",[t._v("load current (PA3, 60 Ampers ~ 3.15V)")])]),t._v(" "),a("p",[t._v("and controls:")]),t._v(" "),a("ol",[a("li",[t._v("connect the charger (PB6)")]),t._v(" "),a("li",[t._v("enable load (autopilot, motors, etc) (PB7)")]),t._v(" "),a("li",[t._v("enable jetson (PB5)")])]),t._v(" "),a("p",[a("img",{attrs:{src:s(577),alt:"battery_info_msg",title:"battery_info_msg"}})]),t._v(" "),a("p",[a("img",{attrs:{src:s(578),alt:"pmu_status_msg",title:"pmu_status_msg"}})]),t._v(" "),a("h3",{attrs:{id:"_3-parameters"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-parameters"}},[t._v("#")]),t._v(" 3. Parameters")]),t._v(" "),a("p",[a("img",{attrs:{src:s(579),alt:"pmu_params",title:"pmu_params"}})]),t._v(" "),a("h3",{attrs:{id:"_4-usage-example-on-a-table"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-usage-example-on-a-table"}},[t._v("#")]),t._v(" 4. Usage example on a table")]),t._v(" "),a("div",{staticClass:"language-python extra-class"},[a("pre",{pre:!0,attrs:{class:"language-python"}},[a("code",[t._v("broadcast"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("uavcan"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("thirdparty"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("inno_msgs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("PmuChargerControl"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cmd"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nbroadcast"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("uavcan"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("thirdparty"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("inno_msgs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("PmuChargerControl"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cmd"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\nbroadcast"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("uavcan"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("thirdparty"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("inno_msgs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("PmuPowerControl"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cmd"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nbroadcast"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("uavcan"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("thirdparty"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("inno_msgs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("PmuPowerControl"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cmd"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\nbroadcast"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("uavcan"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("thirdparty"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("inno_msgs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("PmuLoadControl"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cmd"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nbroadcast"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("uavcan"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("thirdparty"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("inno_msgs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("PmuLoadControl"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("cmd"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])])])}),[],!1,null,null,null);a.default=r.exports}}]);
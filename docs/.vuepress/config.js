module.exports = {
  base: "/inno_uavcan_node_binaries/",
  themeConfig: {
    nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide/' },
        { text: 'Raccoonlab', link: 'https://raccoonlab.org' },
        { text: 'Store', link: 'https://raccoonlab.org/store' },
        { text: 'Github', link: 'https://github.com/InnopolisAero/inno_uavcan_node_binaries' }
    ],
    sidebar: {
      '/guide/': [
        ['', 'Introduction'],
        'airspeed',
        'can_pwm',
        'charger',
        'fuel_tank',
        'gps_mag_baro',
        'ice',
        'pmu',
        'programmer_sniffer',
        'rangefinder',
        'ui_leds',
        'wifi_bridge',
      ]
    }
  }
}
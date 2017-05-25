'use strict';

const {
    GroveLCDRGB
} = require('../../');

const {
    loop: _loop
} = require('../helpers/loop');

{
    const lcd = new GroveLCDRGB();

    const tids = { tid0: null };

    function done() {
        clearTimeout(tids.tid0);

        lcd.setRGB(0x00, 0x00, 0x00);
        lcd.off();
    }
    process.once('SIGINT', done);
    process.once('SIGTERM', done);

    lcd.clear();
    lcd.setCursor(0, 0);
    // lcd.setRGB(0x00, 0x00, 0x00);
    lcd.setText('Hello, World!');
    const loop = _loop.bind(null, tids);

    loop(0, 100, () => {
        lcd.setCursor(0, 1);
        lcd.setTextRaw(new Date().toString().slice(16, 24));
    });
}

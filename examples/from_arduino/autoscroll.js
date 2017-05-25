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
    const loop = _loop.bind(null, tids);

    loop(10, 500, c => lcd.setTextRaw(String.fromCharCode(c))).then(() => {
        lcd.setCursor(16, 1);
        lcd.autoscrollOn();

        return loop(10, 500, c => lcd.setTextRaw(String.fromCharCode(c)));
    }).then(() => {
        lcd.autoscrollOff();
    }).then(done);
}

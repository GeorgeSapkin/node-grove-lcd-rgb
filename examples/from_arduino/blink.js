'use strict';

const {
    GroveLCDRGB
} = require('../../');

const {
    sleep
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
    lcd.setText('Hello, World!');

    sleep(1000).then(() => {
        lcd.blinkOn();
        return sleep(3000);
    }).then(() => {
        lcd.blinkOff();
        return sleep(3000);
    }).then(done);
}

'use strict';

const {
    GroveLCDRGB
} = require('../../');

const {
    loop: _loop,
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

    const str = 'Hello, World!';
    lcd.setText(str);

    const loop = _loop.bind(null, tids);

    sleep(1000)
        .then(() => loop(13, 150, () => lcd.scrollLeft()))
        .then(() => loop(29, 150, () => lcd.scrollRight()))
        .then(() => loop(15, 150, () => lcd.scrollLeft()))
        .then(() => sleep(1000))
        .then(done);
}

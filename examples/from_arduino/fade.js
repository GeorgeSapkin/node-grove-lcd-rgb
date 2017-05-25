'use strict';

const {
    Color,
    GroveLCDRGB
} = require('../../');

const {
    loop: _loop,
    sleep
} = require('../helpers/loop');

function breath(loop, setPWM) {
    return loop(255, 5, c => setPWM(c))
        .then(() => sleep(500))
        .then(() => loop(255, 5, c => setPWM(255 - c)))
        .then(() => sleep(500));
}

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

    lcd.setRGB(0x00, 0x00, 0x00);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.setText('Fade demo');
    const loop = _loop.bind(null, tids);

    breath(loop, lcd.setPWM.bind(lcd, Color.Red))
        .then(() => breath(loop, lcd.setPWM.bind(lcd, Color.Green)))
        .then(() => breath(loop, lcd.setPWM.bind(lcd, Color.Blue)))
        .then(done);
}

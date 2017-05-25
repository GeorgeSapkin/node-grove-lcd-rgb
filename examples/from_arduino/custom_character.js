'use strict';

const {
    GroveLCDRGB
} = require('../../');

const {
    sleep
} = require('../helpers/loop');

const heart = [
    0b00000,
    0b01010,
    0b11111,
    0b11111,
    0b11111,
    0b01110,
    0b00100,
    0b00000
];

const smiley = [
    0b00000,
    0b00000,
    0b01010,
    0b00000,
    0b00000,
    0b10001,
    0b01110,
    0b00000
];

const frownie = [
    0b00000,
    0b00000,
    0b01010,
    0b00000,
    0b00000,
    0b00000,
    0b01110,
    0b10001
];

const armsDown = [
    0b00100,
    0b01010,
    0b00100,
    0b00100,
    0b01110,
    0b10101,
    0b00100,
    0b01010
];

const armsUp = [
    0b00100,
    0b01010,
    0b00100,
    0b10101,
    0b01110,
    0b00100,
    0b00100,
    0b01010
];

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

    lcd.createChar(0, heart);
    lcd.createChar(1, smiley);
    lcd.createChar(2, frownie);
    lcd.createChar(3, armsDown);
    lcd.createChar(4, armsUp);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.setText(`I ${String.fromCharCode(0)}\nRaspberry Pi\n`);

    sleep(1000).then(() => {
        lcd.setText(String.fromCharCode(1));
        return sleep(1000);
    }).then(() => {
        lcd.setText(String.fromCharCode(2));
        return sleep(1000);
    }).then(() => {
        lcd.setText(String.fromCharCode(3));
        return sleep(1000);
    }).then(() => {
        lcd.setText(String.fromCharCode(4));
        return sleep(1000);
    }).then(done);
}

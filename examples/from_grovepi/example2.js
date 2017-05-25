'use strict';

const {
    GroveLCDRGB
} = require('../../');

const {
    loop: _loop,
    sleep
} = require('../helpers/loop');

function getRandom(max) {
    return Math.floor(Math.random() * max);
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

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.setText('Grove LCD RGB\ntest');
    lcd.setRGB(0, 255, 0);

    const loop       = _loop.bind(null, tids);
    const clear      = lcd.clear.bind(lcd);
    const setRGB     = lcd.setRGB.bind(lcd);
    const setText    = lcd.setText.bind(lcd);
    const setTextRaw = lcd.setTextRaw.bind(lcd);

    sleep(
        2000
    ).then(() => {
        setText('Hello, World!');
        return sleep(2000);
    }).then(() => {
        setText('Random colors');
        return loop(51, 100,
            () => setRGB(getRandom(255), getRandom(255), getRandom(255))
        );
    }).then(() => {
        setRGB(255, 255, 255);
        setText(String.fromCharCode(255).repeat(32));
        return sleep(2000);
    }).then(() => {
        setRGB(255,127,0);
        clear();

        const str = 'Hello, World!';
        return loop(str.length, 200, c => setTextRaw(str.slice(c, c + 1)));
    }).then(() => {
        setRGB(255, 0, 255);
        setText('1234567890ABCDEF1234567890ABCDEF');
        return sleep(2000);
    }).then(() => {
        setText('Long strings will be truncated at 32 chars');
        return sleep(2000);
    }).then(() => {
        setText('Automatic word wrapping');
        return sleep(2000);
    }).then(() => {
        setText('Manual\nword wrapping');
        return sleep(2000);
    }).then(() => {
        setRGB(0, 255, 255);
        setText('ASCII printable and extended');
        return sleep(2000);
    }).then(() => {
        const str = [...new Array(256 - 32).keys()]
            .map(i => String.fromCharCode(i + 32))
            .toString()
            .replace(/,/g, '');

        return loop(str.length / 32, 500,
            c => setText(str.slice(c * 32, (c + 1) * 32)));
    }).then(() => {
        setRGB(0, 255, 0);
        setText('Solid colors');
        return sleep(2000);
    }).then(() => {
        setRGB(255, 0, 0);
        setText('Red');
        return sleep(500);
    }).then(() => {
        setRGB(0, 255, 0);
        setText('Green');
        return sleep(500);
    }).then(() => {
        setRGB(0, 0, 255);
        setText('Blue');
        return sleep(500);
    }).then(() => {
        setRGB(255, 255, 0);
        setText('Yellow');
        return sleep(500);
    }).then(() => {
        setRGB(255, 0, 255);
        setText('Magenta');
        return sleep(500);
    }).then(() => {
        setRGB(0, 255, 255);
        setText('Cyan');
        return sleep(500);
    }).then(() => {
        setRGB(255, 255, 255);
        setText('White');
        return sleep(500);
    }).then(() => {
        setRGB(127, 127, 127);
        setText('Grey');
        return sleep(500);
    }).then(() => {
        setRGB(0, 0, 0);
        setText('Black');
        return sleep(500);
    }).then(() => {
        setRGB(255, 255, 255);
        setText('Alphanumeric characters');
        return sleep(2000);
    }).then(() => {
        setText('1234567890ABCDEF1234567890ABCDEF');
        return sleep(500);
    }).then(() => {
        setText('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        return sleep(500);
    }).then(() => {
        setText('abcdefghijklmnopqrstuvwxyz');
        return sleep(500);
    }).then(() => {
        setText('1234567890');
        return sleep(500);
    }).then(() => {
        setText('Shades of red');
        return loop(255, 10, c => setRGB(255,     255 - c, 255 - c));
    }).then(() => {
        setText('Shades of green');
        return loop(255, 10, c => setRGB(255 - c, 255,     255 - c));
    }).then(() => {
        setText('Shades of blue');
        return loop(255, 10, c => setRGB(255 - c, 255 - c, 255));
    }).then(() => {
        setText('Shades of yellow');
        return loop(255, 10, c => setRGB(255,     255,     255 - c));
    }).then(() => {
        setText('Shades of magenta');
        return loop(255, 10, c => setRGB(255,     255 - c, 255));
    }).then(() => {
        setText('Shades of cyan');
        return loop(255, 10, c => setRGB(255 - c, 255,     255));
    }).then(() => {
        setText('Shades of grey');
        return loop(255, 10, c => setRGB(255 - c, 255 - c, 255 - c));
    }).then(done);
}

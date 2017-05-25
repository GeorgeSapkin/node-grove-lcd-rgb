'use strict';

const {
    GroveLCDRGB
} = require('../');

const BIG_HEART_MAP = [
    0b00000,
    0b01010,
    0b11111,
    0b11111,
    0b01110,
    0b00100,
    0b00000,
    0b00000
];

const SMALL_HEART_MAP = [
    0b00000,
    0b00000,
    0b01010,
    0b01110,
    0b00100,
    0b00000,
    0b00000,
    0b00000
];

const TINY_HEART_MAP = [
    0b00000,
    0b00000,
    0b00000,
    0b00100,
    0b00100,
    0b00000,
    0b00000,
    0b00000
];

const BIG_HEART_ID   = 0;
const SMALL_HEART_ID = 1;
const TINY_HEART_ID  = 2;

const BIG_HEART   = [BIG_HEART_ID,   BIG_HEART_MAP  ];
const SMALL_HEART = [SMALL_HEART_ID, SMALL_HEART_MAP];
const TINY_HEART  = [TINY_HEART_ID,  TINY_HEART_MAP ];

const HEART_ANIMATION = [
    [ BIG_HEART_ID,   500 ],
    [ SMALL_HEART_ID, 200 ],
    [ TINY_HEART_ID,  100 ],
    [ SMALL_HEART_ID, 200 ]
];

function animate(tids, lcd, animation, location, frame = 0) {
    const nextFrame = (frame + 1) % animation.length;

    tids.tid0 = setTimeout(
        () => animate(tids, lcd, animation, location, nextFrame),
        animation[frame][1]
    );

    lcd.setCursor(...location);
    lcd._write(animation[frame][0]);
}

{
    const lcd = new GroveLCDRGB();
    lcd.setRGB(0xff, 0x00, 0x00);

    lcd.createChar(...BIG_HEART);
    lcd.createChar(...SMALL_HEART);
    lcd.createChar(...TINY_HEART);

    const tids = { tid0: null };

    function done() {
        clearTimeout(tids.tid0);

        lcd.setRGB(0x00, 0x00, 0x00);
        lcd.off();
    }
    process.once('SIGINT', done);
    process.once('SIGTERM', done);

    animate(tids, lcd, HEART_ANIMATION, [0, 0]);
}

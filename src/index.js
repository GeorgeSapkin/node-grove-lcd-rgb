'use strict';

const {
    existsSync
} = require('fs');

const {
    openSync
} = require('i2c-bus');

// Addresses
const ADDR_RGB = 0x62;
const ADDR_LCD = 0x3e;

// Registers
const REG_MODE1  = 0x00;
const REG_MODE2  = 0x01;
const REG_RATIO  = 0x06;
const REG_PERIOD = 0x07;
const REG_OUTPUT = 0x08;

const Color = {
    Blue:   0x02,
    Green:  0x03,
    Red:    0x04
};

// Commands
const CLEAR_DISPLAY   = 0x01;
const RETURN_HOME     = 0x02;
const ENTRY_MODE_SET  = 0x04;
const DISPLAY_CONTROL = 0x08;
const CURSOR_SHIFT    = 0x10;
const FUNCTION_SET    = 0x20;
const SET_CGRAM_ADDR  = 0x40;
const SET_DDRAM_ADDR  = 0x80;

// Display entry mode flags
// const ENTRY_RIGHT          = 0x00;
const ENTRY_SHIFT_DECREMENT = 0x00;
const ENTRY_SHIFT_INCREMENT = 0x01;
const ENTRY_LEFT            = 0x02;

// flags for display on/off control
const BLINK_OFF   = 0x00;
const CURSOR_OFF  = 0x00;
const DISPLAY_OFF = 0x00;
const BLINK_ON    = 0x01;
const CURSOR_ON   = 0x02;
const DISPLAY_ON  = 0x04;

// Display/cursor shift flags
const MOVE_LEFT    = 0x00;
const CURSOR_MOVE  = 0x00;
const MOVE_RIGHT   = 0x04;
const DISPLAY_MOVE = 0x08;

// Function set flags
// const 8_BIT_MODE = 0x10;
// const 4_BIT_MODE = 0x00;

const Lines = {
    One: 0x00,
    Two: 0x08
};

const CharacterSize = {
    _5x8:  0x00,
    _5x10: 0x04
};

const I2C_0 = '/dev/i2c-0';
const I2C_1 = '/dev/i2c-1';
const I2C_2 = '/dev/i2c-2';

function sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

class GroveLCDRGB {
    constructor({
        characterSize = CharacterSize._5x8,
        lines         = Lines.Two
    } = {}) {
        let busNumber;
        if (existsSync(I2C_0))
            busNumber = 0;
        else if (existsSync(I2C_1))
            busNumber = 1;
        else if (existsSync(I2C_2))
            busNumber = 2;
        else
            throw new Error('Failed to find I2C device');

        const bus = openSync(busNumber);

        this._writeByteSync = bus.writeByteSync.bind(bus);

        this._command = bus.writeByteSync.bind(
            bus, ADDR_LCD, SET_DDRAM_ADDR);

        this._writeBytes = bus.i2cWriteSync.bind(bus, ADDR_LCD);

        this._write = bus.writeByteSync.bind(
            bus, ADDR_LCD, SET_CGRAM_ADDR);

        this._setReg = bus.writeByteSync.bind(bus, ADDR_RGB);

        this._displayFunction = characterSize | lines;

        this._command(FUNCTION_SET | this._displayFunction);

        // turn the display on with no cursor or blinking default
        this._displayControl
            = DISPLAY_ON
            | BLINK_OFF
            | CURSOR_OFF;
        this.on();

        // clear display
        this.clear();

        this.blinkLEDOff();

        // Initialize to default text direction (for romance languages)
        this._displayMode = ENTRY_LEFT | ENTRY_SHIFT_DECREMENT;
        // Set the entry mode
        this._command(ENTRY_MODE_SET | this._displayMode);

        // Initialize backlight
        this._setReg(REG_MODE1, 0);
        // Set LEDs controllable by both PWM and GRPPWM registers
        this._setReg(REG_OUTPUT, 0xff);
        // Set MODE2 values
        // 0010 0000 -> 0x20  (DMBLNK to 1, i.e. blinky mode)
        this._setReg(REG_MODE2, 0x20);

        this.setRGB(255, 255, 255);
    }

    on() {
        this._displayControl |= DISPLAY_ON;
        this._command(DISPLAY_CONTROL | this._displayControl);
    }

    off() {
        this._displayControl &= ~DISPLAY_ON;
        this._command(DISPLAY_CONTROL | DISPLAY_OFF);
    }

    clear() {
        this._command(CLEAR_DISPLAY);
    }

    home() {
        this._command(RETURN_HOME);
    }

    blinkOn() {
        this._displayControl |= BLINK_ON;
        this._command(DISPLAY_CONTROL | this._displayControl);
    }

    // Turn on and off the blinking cursor
    blinkOff() {
        this._displayControl &= ~BLINK_ON;
        this._command(DISPLAY_CONTROL | this._displayControl);
    }

    cursorOn() {
        this._displayControl |= CURSOR_ON;
        this._command(DISPLAY_CONTROL | this._displayControl);
    }

    // Turns the underline cursor on/off
    cursorOff() {
        this._displayControl &= ~CURSOR_ON;
        this._command(DISPLAY_CONTROL | this._displayControl);
    }

    // These commands scroll the display without changing the RAM
    cursorLeft() {
        this._command(CURSOR_SHIFT | CURSOR_MOVE | MOVE_LEFT);
    }
    cursorRight() {
        this._command(CURSOR_SHIFT | CURSOR_MOVE | MOVE_RIGHT);
    }

    setCursor(col, row) {
        this._command(row === 0 ? col | 0x80 : col | 0xc0);
    }

    // This will 'right justify' text from the cursor
    autoscrollOn() {
        this._displayMode |= ENTRY_SHIFT_INCREMENT;
        this._command(ENTRY_MODE_SET | this._displayMode);
    }

    // This will 'left justify' text from the cursor
    autoscrollOff() {
        this._displayMode &= ~ENTRY_SHIFT_INCREMENT;
        this._command(ENTRY_MODE_SET | this._displayMode);
    }

    // These commands scroll the display without changing the RAM
    scrollLeft() {
        this._command(CURSOR_SHIFT | DISPLAY_MOVE | MOVE_LEFT);
    }

    scrollRight() {
        this._command(CURSOR_SHIFT | DISPLAY_MOVE | MOVE_RIGHT);
    }

    // Flow text from left to right
    leftToRight() {
        this._displayMode |= ENTRY_LEFT;
        this._command(ENTRY_MODE_SET | this._displayMode);
    }

    // Flow text from right to left
    rightToLeft() {
        this._displayMode &= ~ENTRY_LEFT;
        this._command(ENTRY_MODE_SET | this._displayMode);
    }

    // Control the backlight LED blinking
    blinkLEDOn(ratio = 0x7f) {
        // blink period in seconds = (<reg 7> + 1) / 24
        // on/off ratio = <reg 6> / 256
        this._setReg(REG_PERIOD, 0x17);   // blink every second
        this._setReg(REG_RATIO,  ratio);  // half on, half off
    }

    blinkLEDOff() {
        this._setReg(REG_PERIOD, 0x00);
        this._setReg(REG_RATIO,  0xff);
    }

    createChar(location, charmap) {
        // There are only 8 locations: 0-7
        this._command(SET_CGRAM_ADDR | (location & 0x07) << 3);
        this._writeBytes(9, Buffer.from([ SET_CGRAM_ADDR, ...charmap ]));
    }

    setRGB(red, green, blue) {
        this._setReg(Color.Red,   red);
        this._setReg(Color.Green, green);
        this._setReg(Color.Blue,  blue);
    }

    setPWM(color, pwm) {
        return this._setReg(color, pwm);
    }

    setTextRaw(text) {
        return [...text].map(x => this._write(x.charCodeAt(0)));
    }

    setText(text) {
        this.clear();

        sleep(5).then(() => {
            const lines = text
                // take first 2 lines if any
                .split('\n')
                .slice(0, 2)
                // split lines into two 16 character chunks
                .map(l => [ l.slice(0, 16), l.slice(16, 32) ])
                .reduce((a, b) => {
                    a.push(...b);
                    return a;
                }, [])
                // filter out empty lines
                .filter(a => a !== '')
                // take first two lines
                .slice(0, 2);

            this.setTextRaw(lines[0]);

            if (lines[1] != null && lines[1] !== '') {
                this.setCursor(0, 1);
                this.setTextRaw(lines[1]);
            }
        });
    }
}

module.exports = {
    CharacterSize,
    Color,
    GroveLCDRGB,
    Lines
};

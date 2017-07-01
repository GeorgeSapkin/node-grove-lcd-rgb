# Grove LCD RGB API for Node.js `grove-lcd-rgb`

This a port of [Arduino library](https://github.com/Seeed-Studio/Grove_LCD_RGB_Backlight) for Grove LCD RGB display with some additional functions. It follows Node.js' non-blocking semantics and targets Raspberry Pi.

## Usage

Enable I2C using `raspi-config` or by uncommenting/adding `dtparam=i2c_arm=on` to `/boot/config.txt`

Install library using:

`npm install --save grove-lcd-rgb`

See [Wiring](#wiring) for wiring details.

## API

### `GroveLCDRGB`

`constructor({ characterSize, lines })`

Creates an instance of `GroveLCDRGB` by trying to open a I2C device with address `0x3e` on bus `/dev/i2c-{0-2}`. Throws an `Error` if a bus was not found.

* `characterSize`

    Sizes of a character in pixels. Defaults to: `CharacterSize._5x8`. See [CharacterSize](#charactersize).

* `lines`

    Number of lines a screen has. Defaults to: `Lines.Two`. See [Lines](#lines).

`on()`

Turn the display on.

`off()`

Turn the display off.

`clear()`

Clear text from the display.

`blinkOn()`

Turn the cursor blinking on.

`blinkOff()`

Turn the cursor blinking off.

`cursorOn()`

Turn the cursor on.

`cursorOff()`

Turn the cursor off.

`cursorLeft()`

Move cursor left.

`cursorRight()`

Move cursor right.

`home()`

Set the location at which subsequent written text will be displayed to column 0, row 0.

`setCursor(col, row)`

Set the location at which subsequent written text will be displayed.

* `col` the column at which to position the cursor

* `row` the row at which to position the cursor

`autoscrollOn()`

`autoscrollOff()`

`scrollLeft()`

`scrollRight()`

`leftToRight()`

Flow text from left to right. Default mode.

`rightToLeft()`

Flow text from right to left

`blinkLEDOn(ratio)`

Control the backlight LED blinking.

* `ratio` Blink ratio. On time in 1/256 of a second. Defaults to: `0x7f`, half a second.

`blinkLEDOff()`

Turn off backlight LED blinking.

`createChar(location, charmap)`

`setRGB(red, green, blue)`

Set backlight LED to specified color.

* `red` Red component.

* `green` Green component.

* `blue` Blue component.

`setPWM(color, pwm)`

`setTextRaw(text)`

Print text to the display without any additional formatting.

* `text` Text to print.

`setText(text)`

### `CharacterSize`

`_5x8` default for `GroveLCDRGB` constructors.

`_5x10`

### `Color`

`Blue`

`Green`

`Red`

### `Lines`

`One`

`Two` default for `GroveLCDRGB` constructors.

## Wiring

![Wiring](/images/wiring.png)

LCD | Raspberry Pi
--- | ---
GND | Any GND (e.g. pin 6)
VCC | Any 5V (e.g. pin 4)
SDA | SDA (pin 3)
SDL | SLD (pin 5)

The LCD (at least v4.0) works correctly when wired to Raspberry Pi GPIO pins directly without a level-shifter.

## Examples

## TODO

* Adapt to work on other devices.

## License

MIT

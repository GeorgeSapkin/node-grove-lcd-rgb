# Grove LCD RGB API for Node.js `grove-lcd-rgb`

This a port of [Arduino library](https://github.com/Seeed-Studio/Grove_LCD_RGB_Backlight) for Grove LCD RGB display to Node.js targeting Raspberry Pi.

## Usage

`npm install --save grove-lcd-rgb`

## API

### `GroveLCDRGB`

* `constructor({ })`

* `on()`

* `off()`

* `clear()`

* `home()`

* `blinkOn()`

* `blinkOff()`

* `cursorOn()`

* `cursorOff()`

* `cursorLeft()`

* `cursorRight()`

* `autoscrollOn()`

* `autoscrollOff()`

* `scrollLeft()`

* `scrollRight()`

* `leftToRight()`

* `rightToLeft()`

* `blinkLEDOn(ratio)`

* `blinkLEDOff()`

* `createChar(location, charmap)`

* `setRGB(red, green, blue)`

* `setPWM(color, pwm)`

* `setTextRaw(text)`

* `setText(text)`

### `CharacterSize`

* `_5x8` default for `GroveLCDRGB` constructors.

* `_5x10`

### `Color`

* `Blue`

* `Green`

* `Red`

### `Lines`

* `One`

* `Two` default for `GroveLCDRGB` constructors.

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

* Adapt to work on other devices

## License

MIT

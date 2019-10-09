/*
* ===========================
* RGB -> HSL Converter v1.0.0
* with auto-formatting
* ===========================
* Input format
* HEX with or without grille: #F00 or F10520 or F1 54 A3 or #87 34 31
* RGB with comma or space separator: rgb(123, 43, 54) or 123,43,54 or 87 34 31
*
* Output format CSS HSL
* hsl(180, 100%, 50%);
*
* © Andrey Zu, 2019.
*/


console.log('Welcome to RGB -> HSL Converter\n'+
    '* Enter RGB or HEX color code\n'+
    '* To exit, enter: exit');

let readline = require('readline');
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', function(line){
    let param = line.trim();
    const errorValueMsg = 'Incorrect value entered.';
    const errorFormatMsg = 'Failed to automatically detect format.';

    // Clear entered value
    function clear(param, regexp, replacer = ''){
        return param.replace(regexp, replacer).trim();
    }

    // Parse value to Int, checking the minimum and maximum values 0-255
    function checkValue(value, radix = 10){
        value = parseInt(value, radix);
        if (value < 0 || isNaN(value)) return 0;
        if (value > 255) return 255;
        return value;
    }

    // Calculation of hue, saturation and lightness
    function math(r, g, b) {
        let h, s = null;

        let min = Math.min(r, g, b);
        let max = Math.max(r, g, b);
        let minMaxDif = max - min;

        // Rounding values to tenths
        function round(num){
            return Math.round(num*10) / 10;
        }

        // Lightness
        let l = (max + min) / 5.1;

        // Saturation
        if (max !== min){
            s = (minMaxDif / 255) / (1 - Math.abs((max + min) / 255 - 1)) * 100;

            // Hue
            if (max === b){
                h = 60 * (r - g) / minMaxDif + 240;
            } else if (max === g){
                h = 60 * (b - r) / minMaxDif + 120;
            }else if (max === r && g >= b){
                h = 60 * (g - b) / minMaxDif;
            }else {
                h = 60 * (g - b) / minMaxDif + 360;
            }
        } else {
            s = 0;
            h = 0;
        }
        h = round(h);
        s = round(s);
        l = round(l);
        console.log('hsl('+h+', '+s+'%, '+l+'%);');
    }

    // Parse string with RGB value, length 5-11 characters.
    function parseRgb(param, regexp, splitter) {
        param = clear(param, regexp);
        if (param.length > 4 && param.length < 12){
            param = param.split(splitter);
            let r = checkValue(param[0]),
                g = checkValue(param[1]),
                b = checkValue(param[2]);
            if (param.length === 3) {
                console.log('RGB format ', 'R: ', r, 'G: ', g, 'B: ', b);
                math(r, g, b);
            } else {
                console.log(errorValueMsg);
            }
        } else {
            console.log(errorValueMsg);
        }
    }

    // Parse string with HEX value, length 3 or 6 characters.
    function parseHex(param, errorString = errorValueMsg) {
        if (param.length === 3){
            let r = checkValue(param[0].concat(param[0]),16),
                g = checkValue(param[1].concat(param[1]),16),
                b = checkValue(param[2].concat(param[2]),16);
            console.log('Short HEX format ', 'R: ', r, 'G: ', g, 'B: ', b);
            math(r, g, b);
        } else if (param.length === 6){
            let r = checkValue(param[0].concat(param[1]),16),
                g = checkValue(param[2].concat(param[3]),16),
                b = checkValue(param[4].concat(param[5]),16);
            console.log('Full HEX format ', 'R: ', r, 'G: ', g, 'B: ', b);
            math(r, g, b);
        } else {
            console.log(errorString);
        }
    }

    // Exit from the program
    if (param === 'exit' || param === 'учше'){
        process.exit();
    }

    // If found HEX attribute
    if (param.search(/[/#a-f]/i) !== -1 && param.search(/^rgb+/g) === -1){
        param = clear(param, /[^\da-f]/ig);
        parseHex(param);

    // If a separator ',' is found
    } else if (param.search(/[,]/) !== -1){
        parseRgb(param, /[^\d,]/g, ',');

    // If a space separator is found
    } else if (param.search(/\s/) !== -1){
        param = clear(param, /\s{2,}/g, ' ');
        parseRgb(param, /[^\d\s]/g, ' ');

    // If there is no separator, but there is a digit
    } else if (param.search(/\d/) !== -1){
        param = clear(param, /[^\d]/g);
        parseHex(param, errorFormatMsg)

    // If not defined
    } else{
        console.log(errorFormatMsg);
    }
});
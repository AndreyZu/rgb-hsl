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


function convert(){
    const errorValueMsg = 'Incorrect value entered.';
    const errorFormatMsg = 'Failed to automatically detect format.';

    // Display of the entered RGB value
    function enteredColor(r, g, b){
        document.getElementById('entered').textContent = 'R: '+r+' G: '+g+' B: '+b;
        document.getElementById('result').style.borderBottomColor = '#000';
    }

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
        console.log('hsl('+h+', '+s+'%, '+l+'%)');
        return 'hsl('+h+', '+s+'%, '+l+'%)';
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
                enteredColor(r, g, b);
                return math(r, g, b);
            } else {
                console.log(errorValueMsg);
                enteredColor('-', '-', '-');
                return errorValueMsg;
            }
        } else {
            console.log(errorValueMsg);
            enteredColor('-', '-', '-');
            return errorValueMsg;
        }
    }

    // Parse string with HEX value, length 3 or 6 characters.
    function parseHex(param, errorString = errorValueMsg) {
        let r, g, b = '';
        if (param.length === 3){
            r = checkValue(param[0].concat(param[0]),16);
            g = checkValue(param[1].concat(param[1]),16);
            b = checkValue(param[2].concat(param[2]),16);
            console.log('Short HEX-format ', 'R: ', r, 'G: ', g, 'B: ', b);
            enteredColor(r, g, b);
            return math(r, g, b);
        } else if (param.length === 6){
            r = checkValue(param[0].concat(param[1]),16);
            g = checkValue(param[2].concat(param[3]),16);
            b = checkValue(param[4].concat(param[5]),16);
            console.log('Full HEX-format ', 'R: ', r, 'G: ', g, 'B: ', b);
            enteredColor(r, g, b);
            return math(r, g, b);
        } else {
            console.log(errorString);
            enteredColor('-', '-', '-');
            return errorString;
        }
    }

    let value = document.getElementById('rgb');
    let param = value.value.trim();
    let result = document.getElementById('result');

    // If found HEX attribute
    if (param.search(/[/#a-f]/i) !== -1 && param.search(/^rgb+/g) === -1){
        param = clear(param, /[^\da-f]/ig);
        value.value = '#' + param.toUpperCase();
        result.textContent = parseHex(param) + ';';
        result.style.borderBottomColor = clear(result.textContent, /[;]/g, '');

    // If a separator ',' is found
    } else if (param.search(/[,]/) !== -1){
        param = clear(param, /[^\d,]/g, ' ');
        value.value = param;
        result.textContent = parseRgb(param, /[^\d,]/g, ',') + ';';
        result.style.borderBottomColor = clear(result.textContent, /[;]/g, '');

    // If a space separator is found
    } else if (param.search(/\s/) !== -1){
        param = clear(param, /\s{2,}/g, ' ');
        value.value = param;
        result.textContent = parseRgb(param, /[^\d\s]/g, ' ') + ';';
        result.style.borderBottomColor = clear(result.textContent, /[;]/g, '');

    // If there is no separator, but there is a digit
    } else if (param.search(/\d/) !== -1){
        param = clear(param, /[^\d]/g);
        value.value = '#' + param;
        result.textContent = parseHex(param, errorFormatMsg) + ';';
        result.style.borderBottomColor = clear(result.textContent, /[;]/g, '');

    // If not defined
    } else{
        console.log(errorFormatMsg);
        enteredColor('-', '-', '-');
        result.textContent = errorFormatMsg;
    }
}

// Prevent form Submit
function stopSubmit() {
    document.getElementById('form').addEventListener('submit', function(event){
        event.preventDefault();
    }, false);
}

// copying the result to the clipboard when you click on the Conversion button
function copy(){
    function fallbackCopyTextToClipboard(text) {
        let textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            let successful = document.execCommand('copy');
            let msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    function copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(
            function() {
                console.log('Async: Copying to clipboard was successful!');
            },
            function(err) {
                console.error('Async: Could not copy text: ', err);
            }
        );
    }

    document.getElementById('submit').addEventListener('click', function(){
        let text = document.getElementById('result').textContent;
        copyTextToClipboard(text);
    });
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', function(){
        stopSubmit();

        document.getElementById('submit').addEventListener('click', convert);

        copy();
    });
}else{
    stopSubmit();

    document.getElementById('submit').addEventListener('click', convert);

    copy();
}
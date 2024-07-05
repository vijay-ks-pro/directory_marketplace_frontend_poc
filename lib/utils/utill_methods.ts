import * as cookie from 'cookie';
import * as dateFunctions from 'date-fns';
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

export const getCookie = (cookies: string | undefined, key: string) => {
    const authToken = cookie.parse(cookies ?? "")[key];
    return authToken ?? ""
}

export const setCookie = (key: string, token: string) => {
    document.cookie = cookie.serialize(key, token);
}

export const deleteCookie = (key: string) => {
    document.cookie = cookie.serialize(key, '', { expires: new Date(0), path: '/' });;
}

export const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ) != null;
};

export const getNumberFromString = (text: string, isInt: boolean = false) => {
    var regex = /[+-]?\d+(\.\d+)?/g;
    let value: RegExpMatchArray | null | number = text.match(regex);
    if(value && value.length > 0) { 
        let temp = '';
        value.forEach(e => temp += e);
        if(isInt) return parseInt(temp);
        return parseFloat(temp);
    } else {
        return null;
    }
}

export const getNumberStringFromString = (text: string) => {
    var regex = /[+-]?\d+(\.\d+)?/g;
    let value: RegExpMatchArray | null | string = text.match(regex);
    if(value && value.length > 0) { 
        let temp = '';
        value.forEach(e => temp += e);
        return temp;
    } else {
        return '';
    }
}

export const removeTrailingZeros = (number: number | string) =>  {
    return number.toString().replace(/\.00$/,'');;
}

export const getHeaderOrigin = (headersList: ReadonlyHeaders) => {
    const host = headersList.get('host');
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    return `${protocol}://${host}`;
}

// checks if the string contians special characters other than space, & and ,(comma)
const isContainsSpecialCharactersUsingASCIIValue = (value: string) => {
    const charCodeForAtSymbol = '@'.charCodeAt(0);
    const charCodeForAndSymbol = '&'.charCodeAt(0);
    const charCodeForComma = ','.charCodeAt(0);
    const charCodeForSpace = ' '.charCodeAt(0);
    const charCodeForSlash = '/'.charCodeAt(0);
    const charCodeForaToz = [65, 90];
    const charCodeForAToZ = [97, 122];
    const charCodeFor0To9 = [48, 57];
    const result = { isContain: false, modified: value }
    let newModified = result.modified;
    const tobeRepalcedText = 'TO_BE_REMOVED';
    for(let i = 0; i < result.modified.length; i++) { 
        const char = result.modified[i];
        const charCode = char.charCodeAt(0);
        const isAlphabet = (charCode >= charCodeForaToz[0] && charCode <= charCodeForaToz[1]) || (charCode >= charCodeForAToZ[0] && charCode <= charCodeForAToZ[1])
        const isNumber = (charCode >= charCodeFor0To9[0] && charCode <= charCodeFor0To9[1])
        const isExcludedSpecialCharacters = [charCodeForAtSymbol, charCodeForAndSymbol, charCodeForComma, charCodeForSpace, charCodeForSlash].includes(charCode)
        if(isAlphabet == false && isNumber == false && isExcludedSpecialCharacters == false) {
            result.isContain = true;
            const countOccurrences = (inputString: string, targetWord: string) => (inputString.match(new RegExp(targetWord, 'gi')) || []).length;
            const occuranceCount = countOccurrences(newModified, tobeRepalcedText);
            newModified = newModified.includes(tobeRepalcedText) ? 
                newModified.substring(0, i + (occuranceCount * tobeRepalcedText.length) - occuranceCount) + tobeRepalcedText + newModified.substring(i + (occuranceCount * tobeRepalcedText.length) - occuranceCount + 1 ) : 
                newModified.substring(0, i) + tobeRepalcedText + newModified.substring(i + 1);
        }
    }
    result.modified =  newModified.replaceAll(tobeRepalcedText, '');
    return result;
}

// checks if the string contians special characters other than space, & and ,(comma)
export const isContainsSpecialCharacters = (value: string) => {
    const regEx = /[`!#$%^*()_+\-=\[\]{};':"“”\\|.<>?~]|[\u20AC\u20A6\u20B9\u20A8\$\£\¥\₹]/;
    const result = { isContain: regEx.test(value), modified: value.replaceAll(new RegExp(regEx, 'g'), '') };
    const resultUsingASCII = isContainsSpecialCharactersUsingASCIIValue(result.modified);
    result.modified = resultUsingASCII.modified;
    result.isContain = result.isContain || resultUsingASCII.isContain;
    return result;
}
  
export const isContainsAlphabets = (value: string) => {
    const regEx = /[a-zA-Z]/;
    return { isContain: regEx.test(value), modified: value.replaceAll(new RegExp(regEx, 'g'), '') }
}

export const isContainsNumericCharacters = (value: string) => {
    const regEx = /[`0-9]/;
    return{ isContain: regEx.test(value), modified: value.replaceAll(new RegExp(regEx, 'g'), '') };
}

export const convertToPriceFormat = (value: number | string | null | undefined, acceptZero: boolean = false, removeTrailingZero: boolean = false) => {
    const numberValue = Number(value);
    const regex = /\d(?=(\d{3})+\.)/g;
    if(acceptZero && (numberValue == 0 || value == undefined)) return removeTrailingZero ? '0' : '0.00';
    return numberValue == 0 || value == undefined ? '' : removeTrailingZero ? numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : numberValue.toFixed(2).replace(regex, '$&,');
}

export const getRecentYears = (count: number = 3, ignoreCurrentYear: boolean = false) => {
    const currentYear = new Date().getFullYear();
    const recentYears = [...Array(count).keys()].reverse().map(e => ignoreCurrentYear ? currentYear - e - 1 : currentYear - e).map(String);
    return recentYears;
}

export const getFormatedPastDateTime = (dateTimeString?: string, excludeTime: boolean = true) => {
    if(dateTimeString == undefined || dateTimeString == '') return '-';
    const dateTime = new Date(dateTimeString);
    const currentDate = new Date();
    if(dateFunctions.isSameDay(dateTime, currentDate) == false) {
        if(excludeTime) return `${dateFunctions.format(dateTime, 'MMM')} ${dateFunctions.format(dateTime, 'dd')}, ${dateFunctions.getYear(dateTime)}`;
        return `${dateFunctions.format(dateTime, 'MMM dd yyyy h:mm aaa')}`;
    } else {
        const interval = dateFunctions.intervalToDuration({start: dateTime, end: currentDate});
        if(!interval.minutes) return `0 minute ago`;
        if(interval.hours ?? 0 > 0) {
            return `${interval.hours} ${interval.hours! > 1 ?  'hrs' : 'hour'} ago`;
        } else {
            return `${interval.minutes} ${interval.minutes! > 1 ? 'mins' : 'minute'} ago`;
        }
    }
}

export const convertDateToString = (date: Date) => {
    return formatDateToYyyyMmDd(date);
}

export const convertStringToDate = (dateString: string) => {
    if(dateString == null || dateString == '') return ;
    // Parse the input date string into a Date object
    const parts = dateString.split("-");
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based
    const year = parseInt(parts[0], 10);
  
    const givenDate = new Date(year, month, day);
    return givenDate;
}

export const formatDateToYyyyMmDd = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
}

export const getDateAfter365Days = (fromDate: string) => {
    if(fromDate == null || fromDate == '') return '';
    // Parse the input date string into a Date object
    const parts = fromDate.split("-");
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based
    const year = parseInt(parts[0], 10);
  
    const givenDate = new Date(year, month, day);
  
    // Add 365 days to the given date
    givenDate.setDate(givenDate.getDate() + 365);
  
    // Return the date after 365 days
    return formatDateToYyyyMmDd(givenDate);
}
/**
 * Hindu Panchang Calculator
 * This library provides functions to calculate various elements of the Hindu Panchang
 * 
 * Note: Accurate Panchang calculations require complex astronomical algorithms
 * This is a simplified version focusing on core concepts
 * For production use, consider using established libraries or API services
 */

// Constants for calculations
const TITHI_NAMES = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", // Shukla Paksha
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya" // Krishna Paksha
];

const NAKSHATRA_NAMES = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
    "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
    "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
    "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
];

const YOGA_NAMES = [
    "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
    "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
    "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
    "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
    "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
    "Indra", "Vaidhriti"
];

const KARANA_NAMES = [
    "Bava", "Balava", "Kaulava", "Taitila", "Garija",
    "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga",
    "Kimstughna"
];

const VARA_NAMES = [
    "Ravivara", "Somavara", "Mangalavara", "Budhavara",
    "Guruvara", "Shukravara", "Shanivara"
];

const HINDU_MONTHS_AMANTA = [
    "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana",
    "Bhadrapada", "Ashvina", "Kartika", "Margashirsha", "Pausha",
    "Magha", "Phalguna"
];

const HINDU_MONTHS_PURNIMANTA = [
    "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada",
    "Ashvina", "Kartika", "Margashirsha", "Pausha", "Magha",
    "Phalguna", "Chaitra"
];

// Main Panchang calculation class
class PanchangCalculator {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    /**
     * Calculate all Panchang elements for a given date
     * @param {Date} date - JavaScript Date object
     * @returns {Object} Complete Panchang data
     */
    calculatePanchang(date) {
        // In a real implementation, this would use precise astronomical calculations
        // For this example, we'll use approximations
        
        const sunrise = this.calculateSunrise(date);
        const sunset = this.calculateSunset(date);
        
        return {
            tithi: this.calculateTithi(date),
            nakshatra: this.calculateNakshatra(date),
            yoga: this.calculateYoga(date),
            karana: this.calculateKarana(date),
            vara: this.calculateVara(date),
            month: this.calculateHinduMonth(date),
            sunrise: sunrise,
            sunset: sunset,
            auspiciousPeriods: this.calculateAuspiciousPeriods(date, sunrise, sunset),
            inauspiciousPeriods: this.calculateInauspiciousPeriods(date, sunrise, sunset),
            shubhMuhurat: this.calculateShubhMuhurat(date, sunrise, sunset)
        };
    }
    
    /**
     * Calculate Tithi (lunar day)
     * @param {Date} date 
     * @returns {Object} Tithi information
     */
    calculateTithi(date) {
        // In reality, this would require calculating the angular distance between the Sun and Moon
        // For this simplified version, we'll use an approximation based on the lunar phase
        
        // Get approximate lunar age (0-29 days)
        const lunarAge = this.approximateLunarAge(date);
        
        // Each tithi is 12 degrees of angular distance (360° ÷ 30 tithis)
        // We convert lunar age to tithi (0-29)
        const tithiIndex = Math.floor(lunarAge);
        
        // Calculate when this tithi ends
        const tithiEndTime = this.calculateTithiEndTime(date, lunarAge, tithiIndex);
        
        return {
            index: tithiIndex,
            name: TITHI_NAMES[tithiIndex],
            paksha: tithiIndex < 15 ? "Shukla" : "Krishna",
            endTime: tithiEndTime
        };
    }
    
    /**
     * Calculate Nakshatra (lunar mansion)
     * @param {Date} date 
     * @returns {Object} Nakshatra information
     */
    calculateNakshatra(date) {
        // Calculate approximate lunar longitude
        const lunarLongitude = this.approximateLunarLongitude(date);
        
        // Each nakshatra spans 13°20' (360° ÷ 27 nakshatras)
        const nakshatraIndex = Math.floor(lunarLongitude / (360/27)) % 27;
        
        // Calculate end time
        const nakshatraEndTime = this.calculateNakshatraEndTime(date, lunarLongitude, nakshatraIndex);
        
        return {
            index: nakshatraIndex,
            name: NAKSHATRA_NAMES[nakshatraIndex],
            endTime: nakshatraEndTime
        };
    }
    
    /**
     * Calculate Yoga
     * @param {Date} date 
     * @returns {Object} Yoga information
     */
    calculateYoga(date) {
        // In traditional calculations, Yoga is calculated as the sum of solar and lunar longitudes
        // Simplified approximation for example purposes
        
        // For simplicity, we'll derive it from the date
        const dayOfYear = this.getDayOfYear(date);
        const yogaIndex = dayOfYear % 27;
        
        // Calculate approximate end time
        const yogaEndTime = this.calculateYogaEndTime(date);
        
        return {
            index: yogaIndex,
            name: YOGA_NAMES[yogaIndex],
            endTime: yogaEndTime
        };
    }
    
    /**
     * Calculate Karana (half of Tithi)
     * @param {Date} date 
     * @returns {Object} Karana information
     */
    calculateKarana(date) {
        // Karana is half of a Tithi, so there are 60 Karanas in a lunar month
        // The first 7 Karanas repeat 8 times, and the last 4 occur only once
        
        const lunarAge = this.approximateLunarAge(date);
        const tithiIndex = Math.floor(lunarAge);
        const tithiProgress = lunarAge - tithiIndex;
        
        // Each tithi has 2 karanas
        const karanaWithinTithi = tithiProgress < 0.5 ? 0 : 1;
        const karanaOverallIndex = (tithiIndex * 2) + karanaWithinTithi;
        
        // Calculate actual karana index (0-10) for display
        let karanaIndex;
        if (karanaOverallIndex < 56) { // First 7 karanas repeat 8 times
            karanaIndex = karanaOverallIndex % 7;
        } else { // Last 4 karanas occur once at the end of the dark half
            karanaIndex = 7 + (karanaOverallIndex - 56);
        }
        
        // Calculate end time
        const karanaEndTime = this.calculateKaranaEndTime(date, lunarAge, tithiIndex, karanaWithinTithi);
        
        return {
            index: karanaIndex,
            name: KARANA_NAMES[karanaIndex],
            endTime: karanaEndTime
        };
    }
    
    /**
     * Calculate Vara (weekday)
     * @param {Date} date 
     * @returns {Object} Vara information
     */
    calculateVara(date) {
        const dayOfWeek = date.getDay(); // 0-6 for Sunday-Saturday
        
        return {
            index: dayOfWeek,
            name: VARA_NAMES[dayOfWeek]
        };
    }
    
    /**
     * Calculate Hindu month
     * @param {Date} date 
     * @returns {Object} Month information
     */
    calculateHinduMonth(date) {
        // This is a very simplified approximation
        // Real calculation requires determining the lunar month based on solar ingress
        
        // For simplicity, we'll approximate using the Gregorian month with an offset
        const month = (date.getMonth() + 10) % 12; // Approximation
        
        return {
            amanta: {
                index: month,
                name: HINDU_MONTHS_AMANTA[month]
            },
            purnimanta: {
                index: month,
                name: HINDU_MONTHS_PURNIMANTA[month]
            }
        };
    }
    
 // =====================================================================
// FIX FOR panchang-calculator.js
// =====================================================================

/**
 * Calculate sunrise time using SunCalc with proper timezone handling
 * @param {Date} date - The date for which sunrise time is needed
 * @returns {Date} - Sunrise time as Date object
 */
calculateSunrise(date) {
    // Create a date object at noon on the selected date to avoid DST issues
    const localNoonDate = new Date(date);
    localNoonDate.setHours(12, 0, 0, 0);
    
    // Calculate times using SunCalc (returns UTC times)
    const times = SunCalc.getTimes(localNoonDate, this.latitude, this.longitude);
    
    // Get the raw UTC time for sunrise
    const sunriseUTC = times.sunrise;
    
    // Get the timezone offset for the location based on longitude
    // Each 15 degrees of longitude roughly corresponds to 1 hour timezone difference
    let timezoneOffset = Math.round(this.longitude / 15);
    
    // Handle special cases for well-known regions (optional)
    // Example for Japan
    if (this.longitude > 138 && this.longitude < 146 && this.latitude > 30 && this.latitude < 46) {
        timezoneOffset = 9; // Japan is UTC+9
    }
    
    // Create a new Date object with the correct local time
    const sunriseHours = sunriseUTC.getUTCHours();
    const sunriseMinutes = sunriseUTC.getUTCMinutes();
    const sunriseSeconds = sunriseUTC.getUTCSeconds();
    
    // Create a new date with the same date but adjusted hours for the location's timezone
    const localSunrise = new Date(date);
    localSunrise.setHours(
        (sunriseHours + timezoneOffset) % 24,
        sunriseMinutes,
        sunriseSeconds
    );
    
    return localSunrise;
}

/**
 * Calculate sunset time using SunCalc with proper timezone handling
 * @param {Date} date - The date for which sunset time is needed
 * @returns {Date} - Sunset time as Date object
 */
calculateSunset(date) {
    // Create a date object at noon on the selected date to avoid DST issues
    const localNoonDate = new Date(date);
    localNoonDate.setHours(12, 0, 0, 0);
    
    // Calculate times using SunCalc (returns UTC times)
    const times = SunCalc.getTimes(localNoonDate, this.latitude, this.longitude);
    
    // Get the raw UTC time for sunset
    const sunsetUTC = times.sunset;
    
    // Get the timezone offset for the location based on longitude
    let timezoneOffset = Math.round(this.longitude / 15);
    
    // Handle special cases for well-known regions (optional)
    if (this.longitude > 138 && this.longitude < 146 && this.latitude > 30 && this.latitude < 46) {
        timezoneOffset = 9; // Japan is UTC+9
    }
    
    // Create a new Date object with the correct local time
    const sunsetHours = sunsetUTC.getUTCHours();
    const sunsetMinutes = sunsetUTC.getUTCMinutes();
    const sunsetSeconds = sunsetUTC.getUTCSeconds();
    
    // Create a new date with the same date but adjusted hours for the location's timezone
    const localSunset = new Date(date);
    localSunset.setHours(
        (sunsetHours + timezoneOffset) % 24,
        sunsetMinutes,
        sunsetSeconds
    );
    
    return localSunset;
}

    
    /**
     * Calculate auspicious periods for the day
     * @param {Date} date 
     * @param {Date} sunrise 
     * @param {Date} sunset 
     * @returns {Object} Auspicious periods
     */
    calculateAuspiciousPeriods(date, sunrise, sunset) {
        // Calculate various auspicious periods based on sunrise and sunset
        
        // Duration of day in milliseconds
        const dayDuration = sunset.getTime() - sunrise.getTime();
        
        // Brahma Muhurta (48 minutes before sunrise)
        const brahmaMuhurtaStart = new Date(sunrise);
        brahmaMuhurtaStart.setMinutes(brahmaMuhurtaStart.getMinutes() - 48);
        
        const brahmaMuhurtaEnd = new Date(sunrise);
        
        // Abhijit Muhurat (midday peak of sun's power)
        const abhijitStart = new Date(sunrise.getTime() + (dayDuration / 2) - (24 * 60 * 1000)); // 24 mins before midday
        const abhijitEnd = new Date(sunrise.getTime() + (dayDuration / 2) + (24 * 60 * 1000)); // 24 mins after midday
        
        // Godhuli Muhurat (twilight time when cows return home)
        const godhuliStart = new Date(sunset);
        const godhuliEnd = new Date(sunset);
        godhuliEnd.setMinutes(godhuliEnd.getMinutes() + 24); // 24 minutes after sunset
        
        // Amrit Kaal (based on Nakshatra - simplified approximation)
        // In real implementation, this would be calculated based on current Nakshatra
        const amritStart = new Date(sunrise);
        amritStart.setMinutes(amritStart.getMinutes() + Math.round(this.getDayOfYear(date) % 100));
        
        const amritEnd = new Date(amritStart);
        amritEnd.setMinutes(amritEnd.getMinutes() + 90); // typically lasts about 90 minutes
        
        return {
            brahmaMuhurta: {
                name: "Brahma Muhurta",
                start: brahmaMuhurtaStart,
                end: brahmaMuhurtaEnd
            },
            abhijitMuhurat: {
                name: "Abhijit Muhurat",
                start: abhijitStart,
                end: abhijitEnd
            },
            godhuliMuhurat: {
                name: "Godhuli Muhurat",
                start: godhuliStart,
                end: godhuliEnd
            },
            amritKaal: {
                name: "Amrit Kaal",
                start: amritStart,
                end: amritEnd
            }
        };
    }
    
    /**
     * Calculate inauspicious periods for the day
     * @param {Date} date 
     * @param {Date} sunrise 
     * @param {Date} sunset 
     * @returns {Object} Inauspicious periods
     */
    calculateInauspiciousPeriods(date, sunrise, sunset) {
        // Duration of day in milliseconds
        const dayDuration = sunset.getTime() - sunrise.getTime();
        const dayPortion = dayDuration / 8; // Each portion is 1/8 of day
        
        // Rahu Kaal - varies by day of week
        const rahuStartOffset = [7, 1, 6, 4, 5, 3, 2]; // Sun to Sat
        const dayOfWeek = date.getDay();
        
        const rahuStart = new Date(sunrise.getTime() + (rahuStartOffset[dayOfWeek] - 1) * dayPortion);
        const rahuEnd = new Date(rahuStart.getTime() + dayPortion);
        
        // Yamaganda - varies by day of week
        const yamaStartOffset = [5, 4, 3, 2, 1, 7, 6]; // Sun to Sat
        
        const yamaStart = new Date(sunrise.getTime() + (yamaStartOffset[dayOfWeek] - 1) * dayPortion);
        const yamaEnd = new Date(yamaStart.getTime() + dayPortion);
        
        // Gulika Kaal - varies by day of week
        const gulikaStartOffset = [6, 7, 5, 3, 4, 2, 1]; // Sun to Sat
        
        const gulikaStart = new Date(sunrise.getTime() + (gulikaStartOffset[dayOfWeek] - 1) * dayPortion);
        const gulikaEnd = new Date(gulikaStart.getTime() + dayPortion);
        
        // Dur Muhurat - this is a simplified implementation
        // In reality, this depends on complex astronomical factors
        const durMuhurat = this.calculateDurMuhurat(date, sunrise, sunset);
        
        // Varjyam - also depends on complex factors
        // This is a placeholder for demonstration
        const varjyamStart = new Date(sunrise.getTime() + dayDuration / 2 + Math.random() * dayDuration / 4);
        const varjyamEnd = new Date(varjyamStart.getTime() + 90 * 60 * 1000); // 90 minutes duration
        
        return {
            rahuKaal: {
                name: "Rahu Kaal",
                start: rahuStart,
                end: rahuEnd
            },
            yamaganda: {
                name: "Yamaganda",
                start: yamaStart,
                end: yamaEnd
            },
            gulikaKaal: {
                name: "Gulika Kaal",
                start: gulikaStart,
                end: gulikaEnd
            },
            durMuhurat: {
                name: "Dur Muhurat",
                start: durMuhurat.start,
                end: durMuhurat.end
            },
            varjyam: {
                name: "Varjyam",
                start: varjyamStart,
                end: varjyamEnd
            }
        };
    }
    
    /**
     * Calculate special Shubh Muhurat for various activities
     * @param {Date} date 
     * @param {Date} sunrise 
     * @param {Date} sunset 
     * @returns {Object} Shubh Muhurat timings
     */
    calculateShubhMuhurat(date, sunrise, sunset) {
        // In a full implementation, this would be based on complex rules
        // for each type of activity based on planetary positions
        
        // For this demonstration, we'll create some example muhurats
        // In a real system, these would be calculated accurately based on vedic astrology
        
        // Duration of day in milliseconds
        const dayDuration = sunset.getTime() - sunrise.getTime();
        
        // Generate some sample muhurat times for demonstration
        return {
            marriage: this.isMuhuratAvailable(date) ? this.generateMuhurat(date, sunrise, 3) : null,
            grihaProvesh: this.generateMuhurat(date, sunrise, 2.5),
            businessOpening: this.generateMuhurat(date, sunrise, 1),
            travel: this.generateMuhurat(date, sunrise, 8),
            nameCeremony: this.generateMuhurat(date, sunrise, 2.5),
            vehiclePurchase: this.generateMuhurat(date, sunrise, 4),
            propertyPurchase: this.generateMuhurat(date, sunrise, 1),
            mundanCeremony: this.generateMuhurat(date, sunrise, 2)
        };
    }
    
    /**
     * Check if marriage muhurat is available on this day
     * @param {Date} date 
     * @returns {Boolean} Is muhurat available
     */
    isMuhuratAvailable(date) {
        // In Vedic astrology, certain days are not suitable for marriage
        // This is a simplified check - real check would be much more complex
        
        const dayOfWeek = date.getDay();
        const dayOfMonth = date.getDate();
        
        // Example: No marriages on Saturday (6) or on 4th, 9th, 14th, 19th, 24th, 29th of month
        return !(dayOfWeek === 6 || dayOfMonth % 5 === 4);
    }
    
    /**
     * Generate a muhurat time window
     * @param {Date} date Base date
     * @param {Date} sunrise Sunrise time
     * @param {Number} hoursAfterSunrise Hours after sunrise to start
     * @returns {Object} Muhurat start and end time
     */
    generateMuhurat(date, sunrise, hoursAfterSunrise) {
        const start = new Date(sunrise);
        start.setHours(sunrise.getHours() + Math.floor(hoursAfterSunrise));
        start.setMinutes(sunrise.getMinutes() + Math.round((hoursAfterSunrise % 1) * 60));
        
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + 90); // 90 minute window
        
        return {
            start: start,
            end: end
        };
    }
    
    /**
     * Calculate Dur Muhurat
     * @param {Date} date 
     * @param {Date} sunrise 
     * @param {Date} sunset 
     * @returns {Object} Dur Muhurat period
     */
    calculateDurMuhurat(date, sunrise, sunset) {
        // Dur Muhurat calculation is complex and varies by day
        // This is a simplified version for demonstration
        
        const dayOfWeek = date.getDay();
        const dayDuration = sunset.getTime() - sunrise.getTime();
        
        // In real implementation, these would be calculated based on planetary positions
        let startHour;
        let duration;
        
        switch(dayOfWeek) {
            case 0: // Sunday
                startHour = 4;
                duration = 90;
                break;
            case 1: // Monday
                startHour = 3;
                duration = 60;
                break;
            case 2: // Tuesday
                startHour = 5;
                duration = 80;
                break;
            case 3: // Wednesday
                startHour = 2;
                duration = 90;
                break;
            case 4: // Thursday
                startHour = 1;
                duration = 60;
                break;
            case 5: // Friday
                startHour = 6;
                duration = 80;
                break;
            case 6: // Saturday
                startHour = 5;
                duration = 90;
                break;
        }
        
        const start = new Date(sunrise);
        start.setHours(sunrise.getHours() + startHour);
        
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + duration);
        
        return {
            start: start,
            end: end
        };
    }
    
    // Utility methods for calculations
    
    /**
     * Approximate lunar age (0-29 days)
     * @param {Date} date 
     * @returns {Number} Lunar age in days
     */
    approximateLunarAge(date) {
        // This is a very simplified approximation
        // Real calculation requires precise astronomical calculations
        
        // Julian day number approximation
        const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
        const y = date.getFullYear() + 4800 - a;
        const m = (date.getMonth() + 1) + 12 * a - 3;
        let jdn = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
        
        // Approximate calculation of the lunar phase
        // New Moon on January 6, 2000 (Julian day 2451550.1)
        const newMoonReference = 2451550.1;
        const lunarCycle = 29.53; // Average length of lunar month in days
        
        const daysSinceReference = jdn - newMoonReference;
        const lunarAge = (daysSinceReference % lunarCycle + lunarCycle) % lunarCycle;
        
        return lunarAge;
    }
    
    /**
     * Calculate approximate lunar longitude
     * @param {Date} date 
     * @returns {Number} Lunar longitude in degrees (0-360)
     */
    approximateLunarLongitude(date) {
        // Simplified calculation - real calculation requires proper ephemeris
        const lunarAge = this.approximateLunarAge(date);
        return (lunarAge / 29.53) * 360;
    }
    
    /**
     * Calculate tithi end time
     * @param {Date} date 
     * @param {Number} lunarAge 
     * @param {Number} tithiIndex 
     * @returns {Date} Tithi end time
     */
    calculateTithiEndTime(date, lunarAge, tithiIndex) {
        // In a real implementation, would calculate based on actual lunar motion
        // This is a simplified approximation
        
        const nextTithiStart = tithiIndex + 1;
        const timeToNextTithi = nextTithiStart - lunarAge;
        const timeToNextTithiHours = (timeToNextTithi * 24) / 29.53; // Convert to hours
        
        const endTime = new Date(date);
        endTime.setHours(endTime.getHours() + Math.floor(timeToNextTithiHours));
        endTime.setMinutes(endTime.getMinutes() + Math.round((timeToNextTithiHours % 1) * 60));
        
        return endTime;
    }
    
    /**
     * Calculate nakshatra end time
     * @param {Date} date 
     * @param {Number} lunarLongitude 
     * @param {Number} nakshatraIndex 
     * @returns {Date} Nakshatra end time
     */
    calculateNakshatraEndTime(date, lunarLongitude, nakshatraIndex) {
        // Similar to tithi end time calculation
        const nakshatraSpan = 360 / 27; // Degrees in each nakshatra
        const currentPosition = lunarLongitude % nakshatraSpan;
        const timeToNextNakshatra = (nakshatraSpan - currentPosition) / (13.2); // Moon moves roughly 13.2° per day
        
        const endTime = new Date(date);
        endTime.setHours(endTime.getHours() + Math.floor(timeToNextNakshatra * 24));
        endTime.setMinutes(endTime.getMinutes() + Math.round((timeToNextNakshatra * 24 % 1) * 60));
        
        return endTime;
    }
    
    /**
     * Calculate yoga end time
     * @param {Date} date 
     * @returns {Date} Yoga end time
     */
    calculateYogaEndTime(date) {
        // Simplified placeholder - in reality complex calculation based on sun and moon longitudes
        const endTime = new Date(date);
        endTime.setHours(endTime.getHours() + 14 + Math.floor(Math.random() * 12)); // Random time for demonstration
        
        return endTime;
    }
    
    /**
     * Calculate karana end time
     * @param {Date} date 
     * @param {Number} lunarAge 
     * @param {Number} tithiIndex 
     * @param {Number} karanaWithinTithi 
     * @returns {Date} Karana end time
     */
    calculateKaranaEndTime(date, lunarAge, tithiIndex, karanaWithinTithi) {
        // Karana is half of a tithi
        
        let endTimeTithi;
        if (karanaWithinTithi === 0) {
            // First karana of the tithi
            const fractionCompleted = lunarAge - tithiIndex;
            const timeToHalfTithi = (0.5 - fractionCompleted) * 29.53 / 30; // Days
            
            endTimeTithi = new Date(date);
            endTimeTithi.setHours(endTimeTithi.getHours() + Math.floor(timeToHalfTithi * 24));
            endTimeTithi.setMinutes(endTimeTithi.getMinutes() + Math.round((timeToHalfTithi * 24 % 1) * 60));
        } else {
            // Second karana of the tithi - use tithi end time
            endTimeTithi = this.calculateTithiEndTime(date, lunarAge, tithiIndex);
        }
        
        return endTimeTithi;
    }
    
    /**
     * Get day of year (1-366)
     * @param {Date} date 
     * @returns {Number} Day of year
     */
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }
}

// Format time for display
function formatTime(date) {
    if (!date) return "N/A";
    
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Format date for display
function formatDate(date) {
    if (!date) return "N/A";
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Format Hindu date
function formatHinduDate(month, paksha, tithi, year) {
    return `${month} ${paksha} ${tithi}, ${year}`;
}

// Export the calculator
window.PanchangCalculator = PanchangCalculator;
window.formatTime = formatTime;
window.formatDate = formatDate;
window.formatHinduDate = formatHinduDate;
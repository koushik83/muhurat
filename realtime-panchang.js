// This script will make the Panchang & Muhurat website dynamic
// 1. Main function to initialize and update panchang data
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page with current date
    updateCurrentDate();
    
    // Update panchang data based on current date
    updatePanchangData();
    
    // Set interval to update time-dependent elements (optional, for very precise timing)
    setInterval(updateTimeElements, 60000); // Update every minute
});

// Function to update the current date display
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    
    // Update English date
    document.getElementById('english-date').textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Update current day
    document.getElementById('current-day').textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Calculate and set Hindu date (requires complex calculations or API)
    // This is a placeholder - you would need actual calculations based on astronomical data
    calculateHinduDate(now);
}

// Function to calculate Hindu date
function calculateHinduDate(date) {
    // This would require complex astronomical calculations or an API call
    // Below is just a conceptual representation
    
    // For a real implementation, you would:
    // 1. Use a library like 'hindu-calendar' if available
    // 2. OR call an external API for accurate conversions
    // 3. OR implement the Drik Ganit calculations (traditional Hindu astronomy)
    
    // Example API call (pseudocode):
    /*
    fetch('https://api.hindu-calendar.com/convert', {
        method: 'POST',
        body: JSON.stringify({
            date: date.toISOString().split('T')[0]
        })
    })
    .then(response => response.json())
    .then(data => {
        // Update the DOM with Hindu date
        const hinduDateElement = document.querySelector('.date-item:nth-child(2) span');
        hinduDateElement.textContent = `${data.month} ${data.paksha} ${data.tithi}, ${data.year}`;
    });
    */
}

// Function to update all panchang data
function updatePanchangData() {
    // In a real implementation, you would:
    // 1. Calculate or fetch the panchang data for today
    // 2. Update the DOM with the new values
    
    // Example calculations/values to update:
    updatePanchangTable();
    updateAuspiciousPeriods();
    updateInauspiciousPeriods();
    updateMuhuratGrid();
    updateFestivalList();
    
    // This function would also update sunrise/sunset times
    updateAstronomicalTimes();
}

// Function to update sunrise, sunset and related times
// Function to update sunrise, sunset, and related times dynamically
// Function to update sunrise, sunset, and related times dynamically
// Function to update sunrise, sunset, and related times dynamically
function updateAstronomicalTimes() {
    if (!window.SunCalc) {
        console.error("SunCalc library not loaded.");
        return;
    }

    // Fetch user-selected or default location
    const lat = parseFloat(localStorage.getItem('panchang-latitude')) || 35.6768601; // Default to Tokyo
    const lng = parseFloat(localStorage.getItem('panchang-longitude')) || 139.7638947; // Default to Tokyo

    // Create a date object at noon today to avoid DST issues
    const today = new Date();
    const localNoonDate = new Date(today);
    localNoonDate.setHours(12, 0, 0, 0);
    
    // Calculate times using SunCalc (returns UTC times)
    const times = SunCalc.getTimes(localNoonDate, lat, lng);
    
    // Get the timezone offset for the location based on longitude
    let timezoneOffset = Math.round(lng / 15);
    
    // Handle special cases for well-known regions (optional)
    if (lng > 138 && lng < 146 && lat > 30 && lat < 46) {
        timezoneOffset = 9; // Japan is UTC+9
    }
    
    // Process sunrise time
    const sunriseHours = times.sunrise.getUTCHours();
    const sunriseMinutes = times.sunrise.getUTCMinutes();
    const sunriseLocal = new Date(today);
    sunriseLocal.setHours(
        (sunriseHours + timezoneOffset) % 24,
        sunriseMinutes,
        0
    );
    
    // Process sunset time
    const sunsetHours = times.sunset.getUTCHours();
    const sunsetMinutes = times.sunset.getUTCMinutes();
    const sunsetLocal = new Date(today);
    sunsetLocal.setHours(
        (sunsetHours + timezoneOffset) % 24,
        sunsetMinutes,
        0
    );

    // Display formatted time
    document.querySelector('.date-item:nth-child(4) span').textContent = formatTime(sunriseLocal);
    document.querySelector('.date-item:nth-child(5) span').textContent = formatTime(sunsetLocal);
}

// =====================================================================
// HELPER FUNCTION FOR main-integration.js
// =====================================================================

/**
 * Helper function to format time properly
 * @param {Date} date - Date object
 * @returns {String} Formatted time string (e.g., "6:45 AM")
 */
function formatTime(date) {
    if (!date) return "N/A";
    
    // For consistent display, use a simple formatting approach
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    return `${hours}:${minutes} ${period}`;
}

// Function to update the panchang table
function updatePanchangTable() {
    // This would involve calculating or fetching each panchang element
    // Example pseudocode for updating tithi:
    
    /*
    const panchangData = calculatePanchangElements(new Date());
    
    // Update Tithi
    const tithiRow = document.querySelector('#daily-panchang table tr:nth-child(2)');
    tithiRow.cells[1].textContent = panchangData.tithi.name;
    tithiRow.cells[2].textContent = `Till ${panchangData.tithi.endTime}`;
    
    // Update Nakshatra
    const nakshatraRow = document.querySelector('#daily-panchang table tr:nth-child(3)');
    nakshatraRow.cells[1].textContent = panchangData.nakshatra.name;
    nakshatraRow.cells[2].textContent = `Till ${panchangData.nakshatra.endTime}`;
    
    // ... and so on for all elements
    */
}

// Function to update auspicious periods
function updateAuspiciousPeriods() {
    // Similar to above, calculate and update the table
}

// Function to update inauspicious periods
function updateInauspiciousPeriods() {
    // Calculate Rahu Kaal, Yamaganda, etc. based on sunrise/sunset
    
    // Rahu Kaal calculation example:
    /*
    const day = new Date().getDay();
    const sunrise = getSunrise(); // You'd need this function
    const sunset = getSunset();   // You'd need this function
    
    // Duration of day in minutes
    const dayDuration = (sunset - sunrise) / (1000 * 60);
    // Each period is 1/8 of the day
    const periodDuration = dayDuration / 8;
    
    // Rahu Kaal occurs at different periods on different days
    const rahuPeriods = [8, 2, 7, 5, 6, 4, 3]; // Sun to Sat
    const rahuPeriod = rahuPeriods[day];
    
    const rahuStart = new Date(sunrise.getTime() + (periodDuration * (rahuPeriod - 1) * 60 * 1000));
    const rahuEnd = new Date(sunrise.getTime() + (periodDuration * rahuPeriod * 60 * 1000));
    
    // Update the DOM
    const rahuRow = document.querySelector('table:nth-of-type(3) tr:nth-child(2)');
    rahuRow.cells[1].textContent = `${formatTime(rahuStart)} to ${formatTime(rahuEnd)}`;
    */
}

// Function to update the muhurat grid
function updateMuhuratGrid() {
    // Calculate and update each muhurat card
    // This would be based on traditional muhurat calculations
}

// Function to update festival list
function updateFestivalList() {
    // Show only upcoming festivals based on current date
    const today = new Date();
    
    // This assumes festival data is loaded or available in the page
    // In reality, you'd likely have a database or JSON source
    
    // Example pseudocode:
    /*
    const festivals = getFestivalData(); // You'd need to implement this
    const upcomingFestivals = festivals.filter(festival => {
        const festivalDate = new Date(festival.date);
        return festivalDate >= today && 
               festivalDate <= new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000)); // Next 90 days
    });
    
    // Sort by date
    upcomingFestivals.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Update the DOM
    const festivalList = document.querySelector('.festival-list');
    festivalList.innerHTML = ''; // Clear existing list
    
    upcomingFestivals.forEach(festival => {
        const listItem = document.createElement('li');
        listItem.className = 'festival-item';
        
        listItem.innerHTML = `
            <span class="festival-date">${formatDate(new Date(festival.date))}:</span>
            <span class="festival-name">${festival.name}</span>
            <span class="vrat-badge">${festival.type}</span>
            <p class="festival-details">${festival.description}</p>
        `;
        
        festivalList.appendChild(listItem);
    });
    */
}

// Helper function for time-dependent elements that may need frequent updates
function updateTimeElements() {
    // Update any elements that depend on current time
    // For example, highlighting the current muhurat if any
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Example pseudocode to highlight current muhurat
    /*
    document.querySelectorAll('.muhurat-card').forEach(card => {
        const timeText = card.querySelector('.muhurat-time').textContent;
        if (timeText !== 'No auspicious muhurat today') {
            const [startTimeStr, endTimeStr] = timeText.split(' to ');
            
            const startTime = parseTimeToMinutes(startTimeStr);
            const endTime = parseTimeToMinutes(endTimeStr);
            
            if (currentTime >= startTime && currentTime <= endTime) {
                card.classList.add('active-muhurat');
            } else {
                card.classList.remove('active-muhurat');
            }
        }
    });
    */
}

// Add this to your CSS
/*
.active-muhurat {
    border: 2px solid var(--primary-color);
    background-color: rgba(255, 119, 34, 0.05);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
*/

// Helper function to parse time strings to minutes since midnight
function parseTimeToMinutes(timeStr) {
    // Parse times like "7:30 AM" to minutes since midnight
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
}
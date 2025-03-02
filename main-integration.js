/**
 * Main Integration Script for Panchang & Muhurat Website
 * 
 * This script connects all components to create a real-time
 * Panchang website that updates based on current date and location
 */

// Initialize the application when the DOM is fully loaded

// Add this to the beginning of your main-integration.js

document.addEventListener('DOMContentLoaded', function() {
    // Default coordinates (New Delhi, India)
    let latitude = 28.6139;
    let longitude = 77.2090;
    
    // Set the date selector to today's date
    const today = new Date();
    const dateSelector = document.getElementById('date-selector');
    if (dateSelector) {
        dateSelector.valueAsDate = today;
    }
    
    // Test localStorage capability
    try {
        localStorage.setItem('panchang-test', 'test');
        localStorage.removeItem('panchang-test');
    } catch (e) {
        console.error("LocalStorage not available:", e);
    }
    
    // Get user's location if they permit
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            // Success callback
            function(position) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                initializePanchang(latitude, longitude);
            },
            // Error callback
            function(error) {
                console.log("Geolocation error or permission denied. Using default location.");
                // Show a notification to the user
                alert("Using default location (New Delhi). You can set your location manually using the form above.");
                initializePanchang(latitude, longitude);
            }
        );
    } else {
        // Browser doesn't support geolocation
        initializePanchang(latitude, longitude);
    }
    
    // Add event listener for manual location update
    document.getElementById('update-location').addEventListener('click', function() {
        const latInput = document.getElementById('latitude').value;
        const longInput = document.getElementById('longitude').value;
        
        if (latInput && longInput) {
            latitude = parseFloat(latInput);
            longitude = parseFloat(longInput);
            initializePanchang(latitude, longitude);
            
            // Save to localStorage
            localStorage.setItem('panchang-latitude', latInput);
            localStorage.setItem('panchang-longitude', longInput);
            
            // Update location name if possible
            updateLocationName(latitude, longitude);
        }
    });
    
    // Add event listener for date selection
    document.getElementById('date-selector').addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        if (!isNaN(selectedDate.getTime())) {
            initializePanchang(latitude, longitude, selectedDate);
        }
    });
    
    // Add hamburger menu functionality
    document.querySelector('.hamburger').addEventListener('click', function() {
        document.querySelector('.nav-links').classList.toggle('active');
    });
    
    // Add location search functionality
    document.getElementById('search-location').addEventListener('click', function() {
        const query = document.getElementById('location-search').value;
        if (query) {
            // Show loading indicator
            document.querySelector('.loading-indicator').style.display = 'flex';
            
            // Use OpenStreetMap Nominatim for geocoding
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    // Hide loading indicator
                    document.querySelector('.loading-indicator').style.display = 'none';
                    
                    if (data && data.length > 0) {
                        // Update inputs with found coordinates
                        document.getElementById('latitude').value = data[0].lat;
                        document.getElementById('longitude').value = data[0].lon;
                        // Trigger location update
                        document.getElementById('update-location').click();
                    } else {
                        alert("Location not found. Try a different search term.");
                    }
                })
                .catch(error => {
                    // Hide loading indicator
                    document.querySelector('.loading-indicator').style.display = 'none';
                    console.error("Location search failed:", error);
                    alert("Location search failed. Please try again.");
                });
        }
    });
    
    // Load saved location on page initialization
    const savedLat = localStorage.getItem('panchang-latitude');
    const savedLng = localStorage.getItem('panchang-longitude');
    if (savedLat && savedLng) {
        document.getElementById('latitude').value = savedLat;
        document.getElementById('longitude').value = savedLng;
        // Use the saved location
        latitude = parseFloat(savedLat);
        longitude = parseFloat(savedLng);
        
        // Update location name
        updateLocationName(latitude, longitude);
    }
});

function updateLocationName(latitude, longitude) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.address) {
                let locationName = data.address.city || data.address.town || data.address.village || data.address.state;
                if (locationName) {
                    // Check if element exists, if not create it
                    let locationDisplay = document.getElementById('current-location-name');
                    if (!locationDisplay) {
                        const locationDiv = document.createElement('div');
                        locationDiv.className = 'current-location';
                        locationDiv.innerHTML = 'Currently showing Panchang for: <span id="current-location-name"></span>';
                        document.querySelector('.date-display').insertAdjacentElement('beforebegin', locationDiv);
                        locationDisplay = document.getElementById('current-location-name');
                    }
                    locationDisplay.textContent = locationName;
                }
            }
        })
        .catch(error => console.error("Failed to get location name:", error));
}

/**
 * Initialize the Panchang calculator and update the UI
 * @param {Number} latitude 
 * @param {Number} longitude 
 * @param {Date} selectedDate (optional) - defaults to current date
 */
/**
 * Initialize the Panchang calculator and update the UI
 * @param {Number} latitude 
 * @param {Number} longitude 
 * @param {Date} selectedDate (optional) - defaults to current date
 */

function initializePanchang(latitude, longitude, selectedDate = new Date()) {
    // Create a new Panchang calculator instance
    const calculator = new PanchangCalculator(latitude, longitude);

    // Calculate panchang data for the selected date
    const panchangData = calculator.calculatePanchang(selectedDate);

    // Update the UI with calculated data
    updateCurrentDateDisplay(selectedDate, panchangData);
    updatePanchangTable(panchangData);
    updateAuspiciousPeriods(panchangData.auspiciousPeriods);
    updateInauspiciousPeriods(panchangData.inauspiciousPeriods);
    updateShubhMuhuratGrid(panchangData.shubhMuhurat);
    updateFestivalsList(selectedDate);

    // Start time-sensitive updates (for highlighting current periods)
    startTimelyUpdates(panchangData);
}

/**
 * Update the current date display section
 * @param {Date} date 
 * @param {Object} panchangData 
 */
function updateCurrentDateDisplay(date, panchangData) {
    // Update English date
    document.getElementById('english-date').textContent = formatDate(date);
    
    // Update day of week
    document.getElementById('current-day').textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Update Hindu date (simplified version)
    const hinduMonthName = panchangData.month.amanta.name;
    const paksha = panchangData.tithi.paksha;
    const tithiName = panchangData.tithi.name;
    
    // Calculate approximate Hindu year (add 78.65 years to Gregorian year)
    const hinduYear = Math.floor(date.getFullYear() + 78.65);
    
    const hinduDateText = `${hinduMonthName} ${paksha} ${tithiName}, ${hinduYear}`;
    document.querySelector('.date-item:nth-child(2) span').textContent = hinduDateText;
    
    // Update sunrise and sunset times
    document.querySelector('.date-item:nth-child(4) span').textContent = formatTime(panchangData.sunrise);
    document.querySelector('.date-item:nth-child(5) span').textContent = formatTime(panchangData.sunset);
}

/**
 * Update the Panchang table with calculated values
 * @param {Object} panchangData 
 */
function updatePanchangTable(panchangData) {
    // Get the table
    const table = document.querySelector('#daily-panchang table:first-of-type');
    
    // Update Tithi row
    updateTableRow(table, 1, panchangData.tithi.name, formatTime(panchangData.tithi.endTime));
    
    // Update Nakshatra row
    updateTableRow(table, 2, panchangData.nakshatra.name, formatTime(panchangData.nakshatra.endTime));
    
    // Update Yoga row
    updateTableRow(table, 3, panchangData.yoga.name, formatTime(panchangData.yoga.endTime));
    
    // Update Karana rows (there are typically 2 karanas in a day)
    updateTableRow(table, 4, panchangData.karana.name, formatTime(panchangData.karana.endTime));
    
    // Weekday
    updateTableRow(table, 6, panchangData.vara.name, "All Day");
    
    // Month (Amanta)
    updateTableRow(table, 7, panchangData.month.amanta.name, "-");
    
    // Month (Purnimanta)
    updateTableRow(table, 8, panchangData.month.purnimanta.name, "-");
    
    // Paksha
    updateTableRow(table, 9, panchangData.tithi.paksha, "-");
}

/**
 * Helper function to update a table row
 * @param {HTMLElement} table 
 * @param {Number} rowIndex 
 * @param {String} detail 
 * @param {String} timing 
 */
function updateTableRow(table, rowIndex, detail, timing) {
    if (table.rows[rowIndex]) {
        // Keep the period name as is, only update the timing
        if (table.rows[rowIndex].cells[1]) table.rows[rowIndex].cells[1].textContent = timing;
    }
}

/**
 * Update the auspicious periods table
 * @param {Object} auspiciousPeriods 
 */
function updateAuspiciousPeriods(auspiciousPeriods) {
    const table = document.querySelector('#daily-panchang .additional-info table:first-of-type');
    
    // Update Brahma Muhurta
    updateTableRow(table, 1, "Brahma Muhurta", `${formatTime(auspiciousPeriods.brahmaMuhurta.start)} to ${formatTime(auspiciousPeriods.brahmaMuhurta.end)}`);
    
    // Update Abhijit Muhurat
    updateTableRow(table, 2, "Abhijit Muhurat", `${formatTime(auspiciousPeriods.abhijitMuhurat.start)} to ${formatTime(auspiciousPeriods.abhijitMuhurat.end)}`);
    
    // Update Godhuli Muhurat
    updateTableRow(table, 3, "Godhuli Muhurat", `${formatTime(auspiciousPeriods.godhuliMuhurat.start)} to ${formatTime(auspiciousPeriods.godhuliMuhurat.end)}`);
    
    // Update Amrit Kaal
    updateTableRow(table, 4, "Amrit Kaal", `${formatTime(auspiciousPeriods.amritKaal.start)} to ${formatTime(auspiciousPeriods.amritKaal.end)}`);
}

/**
 * Update the inauspicious periods table
 * @param {Object} inauspiciousPeriods 
 */

function updateInauspiciousPeriods(inauspiciousPeriods) {
    const table = document.querySelector('#daily-panchang .additional-info table:nth-of-type(2)');
    
    // Update Rahu Kaal
    updateTableRow(table, 1, "Rahu Kaal", `${formatTime(inauspiciousPeriods.rahuKaal.start)} to ${formatTime(inauspiciousPeriods.rahuKaal.end)}`);
    
    // Update Yamaganda
    updateTableRow(table, 2, "Yamaganda", `${formatTime(inauspiciousPeriods.yamaganda.start)} to ${formatTime(inauspiciousPeriods.yamaganda.end)}`);
    
    // Update Gulika Kaal
    updateTableRow(table, 3, "Gulika Kaal", `${formatTime(inauspiciousPeriods.gulikaKaal.start)} to ${formatTime(inauspiciousPeriods.gulikaKaal.end)}`);
    
    // Update Dur Muhurat
    updateTableRow(table, 4, "Dur Muhurat", `${formatTime(inauspiciousPeriods.durMuhurat.start)} to ${formatTime(inauspiciousPeriods.durMuhurat.end)}`);
    
    // Update Varjyam
    updateTableRow(table, 5, "Varjyam", `${formatTime(inauspiciousPeriods.varjyam.start)} to ${formatTime(inauspiciousPeriods.varjyam.end)}`);
}

/**
 * Update the Shubh Muhurat grid
 * @param {Object} shubhMuhurat 
 */
function updateShubhMuhuratGrid(shubhMuhurat) {
    const muhuratCards = document.querySelectorAll('.muhurat-card');
    
    // Marriage Muhurat
    updateMuhuratCard(muhuratCards[0], "Marriage Muhurat", shubhMuhurat.marriage);
    
    // Griha Pravesh
    updateMuhuratCard(muhuratCards[1], "Griha Pravesh (House Entry)", shubhMuhurat.grihaProvesh);
    
    // Business Opening
    updateMuhuratCard(muhuratCards[2], "Business Opening", shubhMuhurat.businessOpening);
    
    // Travel Muhurat
    updateMuhuratCard(muhuratCards[3], "Travel Muhurat", shubhMuhurat.travel);
    
    // Name Ceremony
    updateMuhuratCard(muhuratCards[4], "Name Ceremony", shubhMuhurat.nameCeremony);
    
    // Vehicle Purchase
    updateMuhuratCard(muhuratCards[5], "Vehicle Purchase", shubhMuhurat.vehiclePurchase);
    
    // Property Purchase
    updateMuhuratCard(muhuratCards[6], "Property Purchase", shubhMuhurat.propertyPurchase);
    
    // Mundan Ceremony
    updateMuhuratCard(muhuratCards[7], "Mundan Ceremony", shubhMuhurat.mundanCeremony);
}

/**
 * Helper function to update a muhurat card
 * @param {HTMLElement} card 
 * @param {String} title 
 * @param {Object} muhurat 
 */
function updateMuhuratCard(card, title, muhurat) {
    const titleElement = card.querySelector('h3');
    const timeElement = card.querySelector('.muhurat-time');
    
    // Make sure the title is correct
    if (titleElement) titleElement.textContent = title;
    
    // Update the time or show "No auspicious muhurat today"
    if (timeElement) {
        if (muhurat) {
            timeElement.textContent = `${formatTime(muhurat.start)} to ${formatTime(muhurat.end)}`;
        } else {
            timeElement.textContent = "No auspicious muhurat today";
        }
    }
}

/**
 * Update the list of upcoming festivals
 * @param {Date} currentDate 
 */
function updateFestivalsList(currentDate) {
    // Get upcoming festivals using the function from festival-data.js
    const upcomingFestivals = getUpcomingFestivals(90); // Next 90 days
    
    // Get the festival list container
    const festivalList = document.querySelector('.festival-list');
    if (!festivalList) return;
    
    // Clear existing items
    festivalList.innerHTML = '';
    
    // Add upcoming festivals to the list
    upcomingFestivals.forEach(festival => {
        const listItem = document.createElement('li');
        listItem.className = 'festival-item';
        
        const festivalDate = new Date(festival.date);
        
        listItem.innerHTML = `
            <span class="festival-date">${formatDate(festivalDate)}:</span>
            <span class="festival-name">${festival.name}</span>
            <span class="vrat-badge">${festival.type}</span>
            <p class="festival-details">${festival.description}</p>
        `;
        
        festivalList.appendChild(listItem);
    });
}

/**
 * Start time-sensitive updates for highlighting current periods
 * @param {Object} panchangData 
 */
function startTimelyUpdates(panchangData) {
    // Clear any existing interval
    if (window.timeUpdateInterval) {
        clearInterval(window.timeUpdateInterval);
    }
    
    // Function to update time-sensitive UI elements
    function updateTimeElements() {
        const now = new Date();
        
        // Highlight current active muhurat if any
        highlightActiveMuhurats(now, panchangData.shubhMuhurat);
        
        // Highlight current auspicious/inauspicious periods
        highlightActivePeriods(now, panchangData.auspiciousPeriods, 'auspicious-active');
        highlightActivePeriods(now, panchangData.inauspiciousPeriods, 'inauspicious-active');
    }
    
    // Run immediately and then set interval
    updateTimeElements();
    window.timeUpdateInterval = setInterval(updateTimeElements, 60000); // Update every minute
}

/**
 * Highlight active muhurat cards
 * @param {Date} now 
 * @param {Object} muhurats 
 */
function highlightActiveMuhurats(now, muhurats) {
    const muhuratCards = document.querySelectorAll('.muhurat-card');
    
    // Reset all cards first
    muhuratCards.forEach(card => {
        card.classList.remove('active-muhurat');
    });
    
    // Index mapping between shubhMuhurat object properties and muhurat cards
    const muhuratMapping = [
        'marriage',
        'grihaProvesh',
        'businessOpening',
        'travel',
        'nameCeremony',
        'vehiclePurchase',
        'propertyPurchase',
        'mundanCeremony'
    ];
    
    // Check each muhurat and highlight if current time is within its range
    muhuratMapping.forEach((muhuratType, index) => {
        const muhurat = muhurats[muhuratType];
        if (muhurat && isTimeInRange(now, muhurat.start, muhurat.end)) {
            muhuratCards[index].classList.add('active-muhurat');
        }
    });
}

/**
 * Highlight active periods in tables
 * @param {Date} now 
 * @param {Object} periods 
 * @param {String} highlightClass 
 */
function highlightActivePeriods(now, periods, highlightClass) {
    // Convert periods object to array
    const periodsArray = Object.values(periods);
    
    // Get both tables
    const auspiciousTable = document.querySelector('#daily-panchang .additional-info table:first-of-type');
    const inauspiciousTable = document.querySelector('#daily-panchang .additional-info table:nth-of-type(2)');
    
    // Reset highlighting
    [auspiciousTable, inauspiciousTable].forEach(table => {
        if (!table) return;
        
        for (let i = 1; i < table.rows.length; i++) {
            table.rows[i].classList.remove('auspicious-active', 'inauspicious-active');
        }
    });
    
    // Highlight active periods
    periodsArray.forEach(period => {
        if (isTimeInRange(now, period.start, period.end)) {
            // Find the row in the appropriate table
            let table, rowIndex;
            
            if (highlightClass === 'auspicious-active') {
                table = auspiciousTable;
                // Find row index based on period name
                for (let i = 1; i < table.rows.length; i++) {
                    if (table.rows[i].cells[0].textContent.trim() === period.name) {
                        rowIndex = i;
                        break;
                    }
                }
            } else {
                table = inauspiciousTable;
                // Find row index based on period name
                for (let i = 1; i < table.rows.length; i++) {
                    if (table.rows[i].cells[0].textContent.trim() === period.name) {
                        rowIndex = i;
                        break;
                    }
                }
            }
            
            // Highlight the row if found
            if (table && rowIndex) {
                table.rows[rowIndex].classList.add(highlightClass);
            }
        }
    });
}

/**
 * Check if current time is within a given range
 * @param {Date} now 
 * @param {Date} start 
 * @param {Date} end 
 * @returns {Boolean} Is time in range
 */
function isTimeInRange(now, start, end) {
    if (!start || !end) return false;
    
    // Convert all to minutes since midnight for comparison
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    
    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
}

/**
 * Check if current time is within a given range
 * @param {Date} now 
 * @param {Date} start 
 * @param {Date} end 
 * @returns {Boolean} Is time in range
 */
function isTimeInRange(now, start, end) {
    if (!start || !end) return false;
    
    // For string time values, we need to parse them
    const nowTimeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    // Parse times to get hours and minutes
    const nowTime = parseTimeString(nowTimeStr);
    const startTime = parseTimeString(typeof start === 'string' ? start : formatTime(start));
    const endTime = parseTimeString(typeof end === 'string' ? end : formatTime(end));
    
    // Convert to minutes since midnight for comparison
    const nowMinutes = nowTime.hours * 60 + nowTime.minutes;
    const startMinutes = startTime.hours * 60 + startTime.minutes;
    const endMinutes = endTime.hours * 60 + endTime.minutes;
    
    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
}

/**
 * Helper function to parse time strings (e.g., "3:45 PM") into hours and minutes
 * @param {String} timeStr 
 * @returns {Object} Object with hours and minutes
 */
function parseTimeString(timeStr) {
    if (!timeStr) return { hours: 0, minutes: 0 };
    
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format for easier comparison
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return { hours, minutes };
}

    /**
 * Helper function to format time properly
 * @param {Date} date - Date object
 * @returns {String} Formatted time string (e.g., "6:45 AM")
 */
function formatTime(date) {
    if (!date) return "N/A";
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        
    });
}

/**
 * Format date for display
 * @param {Date} date 
 * @returns {String} Formatted date string (e.g., "Feb 26, 2025")
 */
function formatDate(date) {
    if (!date) return "N/A";
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}


// Add these styles to your CSS
/*
.active-muhurat {
    border: 2px solid var(--primary-color);
    background-color: rgba(255, 119, 34, 0.05);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.auspicious-active {
    background-color: rgba(255, 193, 7, 0.2);
    font-weight: bold;
}

.inauspicious-active {
    background-color: rgba(220, 53, 69, 0.1);
    font-weight: bold;
}
*/
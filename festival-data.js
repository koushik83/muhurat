// This file contains festival data for the year 2025
// Structure is designed to be easily maintained and updated

const festivals2025 = [
    {
        date: "2025-02-28",
        name: "Holi Purnima",
        type: "Festival",
        description: "The festival of colors celebrating the victory of good over evil and the arrival of spring. Full moon day (Purnima) of Phalguna month."
    },
    {
        date: "2025-03-10",
        name: "Chaitra Navratri Begins",
        type: "Festival",
        description: "Nine-day festival devoted to the worship of Goddess Durga. Marks the beginning of Hindu New Year in many regions."
    },
    {
        date: "2025-03-12",
        name: "Gudi Padwa",
        type: "Festival",
        description: "Maharashtrian New Year celebrated by raising the Gudi flag symbolizing victory and prosperity."
    },
    {
        date: "2025-03-14",
        name: "Gangaur",
        type: "Festival",
        description: "Celebrated mainly in Rajasthan, dedicated to Goddess Gauri, the consort of Lord Shiva."
    },
    {
        date: "2025-03-17",
        name: "Ekadashi Vrat",
        type: "Vrat",
        description: "Kamada Ekadashi - Dedicated to Lord Vishnu. Fasting on this day is believed to fulfill all desires."
    },
    {
        date: "2025-03-19",
        name: "Chaitra Purnima",
        type: "Vrat",
        description: "Full moon day of Chaitra month. Auspicious for charity and religious activities."
    },
    {
        date: "2025-03-29",
        name: "Hanuman Jayanti",
        type: "Festival",
        description: "Birthday of Lord Hanuman. Devotees visit temples and offer prayers seeking strength and protection."
    },
    {
        date: "2025-04-08",
        name: "Akshaya Tritiya",
        type: "Festival",
        description: "Highly auspicious day for new beginnings and gold purchase. Believed that any venture started on this day prospers."
    },
    {
        date: "2025-04-17",
        name: "Vat Savitri Vrat",
        type: "Vrat",
        description: "Observed by married women for the well-being and longevity of their husbands by worshipping the Banyan tree."
    },
    {
        date: "2025-05-12",
        name: "Buddha Purnima",
        type: "Festival",
        description: "Celebrates the birth, enlightenment, and death of Gautama Buddha, the founder of Buddhism."
    },
    {
        date: "2025-07-01",
        name: "Jagannath Rath Yatra",
        type: "Festival",
        description: "Annual chariot procession of Lord Jagannath, Balabhadra, and Subhadra celebrated with great fervor in Puri, Odisha."
    },
    {
        date: "2025-07-31",
        name: "Guru Purnima",
        type: "Festival",
        description: "Day to honor spiritual and academic teachers. Full moon day of Ashadha month dedicated to Guru worship."
    },
    {
        date: "2025-08-08",
        name: "Nag Panchami",
        type: "Festival",
        description: "Worship of serpent deities, especially Nag Devta. Snakes are offered milk and prayers for protection."
    },
    {
        date: "2025-08-18",
        name: "Raksha Bandhan",
        type: "Festival",
        description: "Celebration of the bond between brothers and sisters. Sisters tie a protective thread (rakhi) on brothers' wrists."
    },
    {
        date: "2025-08-27",
        name: "Krishna Janmashtami",
        type: "Festival",
        description: "Celebrates the birth of Lord Krishna, the eighth avatar of Lord Vishnu."
    },
    {
        date: "2025-09-03",
        name: "Ganesh Chaturthi",
        type: "Festival",
        description: "Ten-day festival celebrating the birth of Lord Ganesha. Clay idols are installed and immersed in water at the end."
    },
    {
        date: "2025-10-03",
        name: "Navratri Begins",
        type: "Festival",
        description: "Nine nights dedicated to the nine forms of Goddess Durga. Involves fasting, prayers, and cultural performances."
    },
    {
        date: "2025-10-12",
        name: "Dussehra (Vijayadashami)",
        type: "Festival",
        description: "Celebrates the victory of Lord Rama over Ravana, symbolizing the triumph of good over evil."
    },
    {
        date: "2025-10-31",
        name: "Diwali (Deepavali)",
        type: "Festival",
        description: "Festival of lights celebrating the return of Lord Rama to Ayodhya. Homes are decorated with oil lamps, candles, and colorful lights."
    },
    {
        date: "2025-11-03",
        name: "Govardhan Puja",
        type: "Festival",
        description: "Commemorates Lord Krishna's lifting of Govardhan Hill to protect the villagers of Vrindavan from severe rains."
    },
    {
        date: "2025-11-05",
        name: "Bhai Dooj",
        type: "Festival",
        description: "Celebrates the bond between siblings. Sisters pray for brothers' long and happy lives."
    },
    {
        date: "2025-11-27",
        name: "Kartik Purnima",
        type: "Festival",
        description: "Full moon day of Kartik month. Sacred for taking holy baths in rivers, especially the Ganges."
    },
    {
        date: "2025-12-25",
        name: "Gita Jayanti",
        type: "Festival",
        description: "Celebrates the day when Lord Krishna delivered the wisdom of Bhagavad Gita to Arjuna on the battlefield of Kurukshetra."
    }
];

// Function to get upcoming festivals based on current date
function getUpcomingFestivals(days = 90) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + days);
    
    return festivals2025.filter(festival => {
        const festivalDate = new Date(festival.date);
        return festivalDate >= today && festivalDate <= endDate;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Function to get festivals for a specific month
function getFestivalsByMonth(month) { // 1-12 for Jan-Dec
    return festivals2025.filter(festival => {
        const festivalDate = new Date(festival.date);
        return festivalDate.getMonth() + 1 === month;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Function to format festival date to display format
function formatFestivalDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
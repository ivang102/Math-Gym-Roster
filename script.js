// Function to move tutors between on-duty and off-duty grids
function toggleDuty(tutorElement) {
    // Find the details section within the tutor element
    const detailsElement = tutorElement.querySelector('.tutor-right');

    // Find the on-duty and off-duty grids
    const onDutyGrid = document.getElementById('onDutyGrid');
    const offDutyGrid = document.getElementById('offDutyGrid');

    // Check if the tutor is currently in the off-duty grid
    const isOffDuty = offDutyGrid.contains(tutorElement);

    // Find which grid tutor is getting moved to
    const destinationGrid = isOffDuty ? onDutyGrid : offDutyGrid;

    // Toggle appearance
    if (isOffDuty) {
        detailsElement.style.display = "block";
        tutorElement.classList.remove('off-duty');
    } else {
        detailsElement.style.display = "none";
        tutorElement.classList.add('off-duty');
    }

    // Find the correct alphabetical spot in the destination grid
    const movingName = tutorElement.querySelector('h3').innerText.toLowerCase();
    const existingTutors = Array.from(destinationGrid.querySelectorAll('.tutor'));

    // Find the first tutor in the grid whose name comes AFTER the moving tutor
    const insertBeforeElement = existingTutors.find(otherTutor => {
        const otherName = otherTutor.querySelector('h3').innerText.toLowerCase();
        return otherName > movingName;
    });

    // Insert the tutor in the correct spot in the destination grid
    if (insertBeforeElement) {
        destinationGrid.insertBefore(tutorElement, insertBeforeElement);
    } else {
        // If no names are after the moving tutor, just put it at the end
        destinationGrid.appendChild(tutorElement);
    }
}

// Function to update the single active TWS session timer using day-grouped logic
function updateSessionTimers() {
    const container = document.getElementById('live-sessions-container');
    if (!container) return;

    fetch('sessions.json')
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
            
            // Get current time in total minutes from midnight
            const currentMinutes = (now.getHours() * 60) + now.getMinutes();
            const currentSeconds = now.getSeconds();

            // Get today's list of sessions
            const todaysSessions = data[currentDay] || [];
            let bannerHTML = '';

            // Loop through today's sessions to find a match
            todaysSessions.forEach(session => {
                const [startHour, startMinute] = session.start.split(':').map(Number);
                const startMinutesTotal = (startHour * 60) + startMinute;

                // Define windows in minutes
                const upcomingWindowStart = startMinutesTotal - 15;
                const bannerHideCutoff = startMinutesTotal + 45; // Banner disappears after 30 mins
                const actualSessionEnd = startMinutesTotal + 60; // True session duration is 60 mins

                // Scenario A: Upcoming Session (15 mins before start)
                if (currentMinutes >= upcomingWindowStart && currentMinutes < startMinutesTotal) {
                    const totalSecondsLeft = ((startMinutesTotal - currentMinutes) * 60) - currentSeconds;
                    const displayMins = Math.floor(totalSecondsLeft / 60);
                    const displaySecs = totalSecondsLeft % 60;
                    const formattedTime = `${displayMins}:${displaySecs.toString().padStart(2, '0')}`;

                    bannerHTML = `
                        <div class="session-banner">
                            ⏳ <strong>${session.subject} TWS</strong> starting in ${formattedTime}
                        </div>
                    `;
                }
                // Scenario B: In Session Now (Display for first 30 mins, but count down to the full hour)
                else if (currentMinutes >= startMinutesTotal && currentMinutes < bannerHideCutoff) {
                    // 🛠️ Math fix: Calculate remaining time until the full 60-minute mark
                    const totalSecondsLeft = ((actualSessionEnd - currentMinutes) * 60) - currentSeconds;
                    const displayMins = Math.floor(totalSecondsLeft / 60);
                    const displaySecs = totalSecondsLeft % 60;
                    const formattedTime = `${displayMins}:${displaySecs.toString().padStart(2, '0')}`;

                    bannerHTML = `
                        <div class="session-banner session-banner-live">
                            🟢 <strong>${session.subject} TWS</strong> is currently in session (ends in ${formattedTime})
                        </div>
                    `;
                }
            });

            // Put the generated banner on screen (or clear it out if nothing matches)
            container.innerHTML = bannerHTML;
        })
        .catch(err => console.error("Error reading sessions:", err));
}

// Run layout initialization adjustments on DOM load
document.addEventListener('DOMContentLoaded', function () {
    const offDutyGrid = document.getElementById('offDutyGrid');

    //Fetch tutor profiles from JSON and build them into the off-duty grid
    fetch('tutors.json')
        .then(response => response.json())
        .then(tutors => {
            // Only load tutors with "loaded" set to true
            const activeTutors = tutors.filter(t => t.loaded);

            // Sort loaded tutors alphabetically
            activeTutors.sort((a, b) => a.name.localeCompare(b.name));
            
            // Build tutor cards for each loaded tutor
            activeTutors.forEach(t => {
                const tutorCard = document.createElement('div');
                tutorCard.className = 'tutor off-duty';
                tutorCard.onclick = function() { toggleDuty(this); };

                // Map courses into exact nested <li> items
                const coursesHTML = t.courses.map(c => `<li>${c}</li>`).join('');

                // HTML structure for each tutor card
                tutorCard.innerHTML = `
                    <div class="tutor-card-flex">
                        <div class="tutor-left">
                            <img src="portraits/${t.img}" alt="${t.name}">
                            <h3>${t.name}</h3>
                        </div>
                        <div class="tutor-right" style="display: none;">
                            <div class="supported-courses-label">Supported Courses:</div>
                            <ul class="courses-list">
                                ${coursesHTML}
                            </ul>
                        </div>
                    </div>
                `;

                offDutyGrid.appendChild(tutorCard);
            });
        })
        .catch(error => console.error('Error fetching data from tutors.json:', error));

    // Setup background selector change listener
    const backgroundSelect = document.getElementById('backgroundSelect');
    if (backgroundSelect) {
        backgroundSelect.addEventListener('change', (event) => {
            document.body.style.backgroundImage = `url('${event.target.value}')`;
        });
    }

    // Initialize and loop the TWS clock
    updateSessionTimers();
    setInterval(updateSessionTimers, 1000);
});
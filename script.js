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

// Fetch tutor profiles from JSON and build them into the off-duty grid
document.addEventListener('DOMContentLoaded', function () {
    const offDutyGrid = document.getElementById('offDutyGrid');

    fetch('tutors.json')
        .then(response => response.json())
        .then(tutors => {
            // Only load tuttors with "loaded" set to true
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
});

// Change the background image based on selected value
document.addEventListener('DOMContentLoaded', () => {
    const backgroundSelect = document.getElementById('backgroundSelect');

    backgroundSelect.addEventListener('change', (event) => {
        document.body.style.backgroundImage = `url('${event.target.value}')`;
    });
});
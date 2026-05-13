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

// Initially hide tutor details for those off duty and add them to the off-duty grid
document.addEventListener('DOMContentLoaded', function () {
    const tutors = document.querySelectorAll('.tutor');
    const offDutyGrid = document.getElementById('offDutyGrid');
    tutors.forEach(function (tutor) {
        offDutyGrid.appendChild(tutor);
        const details = tutor.querySelector('.tutor-right');
        details.style.display = "none";
    tutor.classList.add('off-duty');
    });
});

// Change the background image based on selected value
document.addEventListener('DOMContentLoaded', () => {
    const backgroundSelect = document.getElementById('backgroundSelect');

    backgroundSelect.addEventListener('change', (event) => {
        document.body.style.backgroundImage = `url('${event.target.value}')`;
    });
});

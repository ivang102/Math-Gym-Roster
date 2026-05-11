// Function to move tutors between on-duty and off-duty grids
function toggleDuty(tutorElement) {
    //Find the parent tutor element for the button

    //Find the details section within the tutor element
    const detailsElement = tutorElement.querySelector('.tutor-right');

    const onDutyGrid = document.getElementById('onDutyGrid');
    const offDutyGrid = document.getElementById('offDutyGrid');

    //Check if the tutor is currently in the off-duty grid
    const isOffDuty = offDutyGrid.contains(tutorElement);

    // Move tutor to the appropriate grid and toggle button and details
    if (isOffDuty) {
        detailsElement.style.display = "block";
        onDutyGrid.appendChild(tutorElement);
        tutorElement.classList.remove('off-duty');
    } else {
        detailsElement.style.display = "none";
        offDutyGrid.appendChild(tutorElement);
        tutorElement.classList.add('off-duty');
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

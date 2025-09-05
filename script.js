// Function to move tutors between on-duty and off-duty grids
function toggleDuty(tutorId, buttonId) {
    const tutorElement = document.getElementById(tutorId);
    const toggleButton = document.getElementById(buttonId);
    const onDutyGrid = document.getElementById('onDutyGrid');
    const offDutyGrid = document.getElementById('offDutyGrid');
    const detailsElement = tutorElement.querySelector('.tutor-right');
    const isOffDuty = offDutyGrid.contains(tutorElement);

    // Move tutor to the appropriate grid and toggle button and details
    if (isOffDuty) {
    toggleButton.innerHTML = "&times;";
    toggleButton.title = "Mark as Off Duty";
    detailsElement.style.display = "block";
    onDutyGrid.appendChild(tutorElement);
    tutorElement.classList.remove('off-duty');
    } else {
    toggleButton.innerHTML = "&#10003;";
    toggleButton.title = "Mark as On Duty";
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

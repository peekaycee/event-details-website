const modal = document.getElementById('event-modal');
const main = document.querySelector('main');
const modalContent = document.getElementById('modal-content');


// Get stored events data from localStorage
const storedData = JSON.parse(localStorage.getItem('eventDetails'));

// Get the event ID from the URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id'); // This returns a string

if (storedData && eventId) {
  // Find the event data by ID (ensure type consistency between eventId and stored data)
  const eventData = storedData.find(event => String(event.id) === eventId);

  if (eventData) {
    // Populate the UI with event details
    const eventDetailsContainer = document.querySelector('.event-details');
    if (eventDetailsContainer) {
      eventDetailsContainer.innerHTML = `
       <div class="event-container">
        <div class="event-media">
          <div class="event-image">
            <img src="../assets/images/${eventData.imageUrl}" loading="lazy" alt="Image of ${eventData.title} Event">
          </div>
          <div class="event-video">
            <video loading="lazy" autoplay muted loop>
              <source src="../assets/videos/${eventData.videoUrl}"  type="video/mp4">
              <p>Your browser does not support the video tag.</p>
            </video>
          </div>
        </div>
        <div class="complete-event-details">
          <h1>${eventData.title}</h1>
          <p class='fee'>&pound;${eventData.fee}</p>
          <p class='description'><em>${eventData.description}</em></p>
          <p class="location"><strong>Location:</strong> ${eventData.location}</p>
          <p class="date"><strong>Date:</strong> ${eventData.date}</p>
          <div class='controls'>
            <button type="button" class="back" onclick="window.history.back()">&larr;</button>
            <button type="button" id="book-event-btn" class='book-event-btn'>Book Event</button>
          </div>
        </div>
       </div>
      `;
    }

    // Attach event listener to the Book Event button
    const bookEventButton = document.getElementById('book-event-btn');
    if (bookEventButton) {
      bookEventButton.addEventListener('click', () => {
        showEventModal(eventData);
      });
    }
  } else {
    console.error('Event not found');
  }
} else {
  console.error('No event data available');
}

function showEventModal(eventDetails) {
  // Populate modal with event details
  modalContent.innerHTML = `
    <h2>${eventDetails.title}</h2>
    <p>${eventDetails.description || 'No description available.'}</p>
    <p><strong>Location:</strong> ${eventDetails.location}</p>
    <p><strong>Date:</strong> ${eventDetails.date}</p>
    <p><strong>Fee:</strong> &pound;${eventDetails.fee}</p>
    <button type="button" class="confirm-book-btn">Confirm Booking</button>
    <button type="button" class="close-modal-btn">Close</button>
  `;

  // Show modal and blur main
  modal.style = 'display: block;';
  main.style = 'filter: blur(2px); user-select: none;';


  document.querySelector('.close-modal-btn').addEventListener('click', closeModal);
  document.querySelector('.confirm-book-btn').addEventListener('click', () => {
    alert('Booking confirmed!');
    closeModal();
  });
}

function closeModal() {
  modal.style.display = 'none';
  main.style.filter = 'none';
}







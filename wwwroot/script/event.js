document.addEventListener('DOMContentLoaded', () => {
  const gearIcon = document.querySelector('.gearIcon');
  const customButtons = document.querySelector('.custom-buttons');
  const customize = document.querySelector('.customize');
  const customizeFontSize = document.querySelector('.customize .font-sizes');
  const customizeHeaderBackground = document.querySelector('.header-background');
  const smallFontSize = document.getElementById("smallFont");
  const mediumFontSize = document.getElementById("mediumFont");
  const largeFontSize = document.getElementById("largeFont");
  const header = document.querySelector("header");
  const headerBackgroundButtons = document.querySelector('.header-background-buttons');
  const primaryBg = document.querySelector(".primary-bg");
  const secondaryBg = document.querySelector(".secondary-bg");
  const tertiaryBg = document.querySelector(".tertiary-bg");
  const colorInput = document.getElementById("color");
  const closeCustomButtons = document.querySelector('.customize img');
  const closeCustomButtonsSizeAndBackground = document.querySelectorAll('.closeButtons img');
  const eventCard = document.querySelector('.events');
  const savedCard = document.querySelector('.saved-events');
  const loadMoreButton = document.querySelector('.view-all-btn');
  const menuIcon = document.querySelector('.menu-icon');
  const menuList = document.querySelector('#menu-list');
  const closeIcon = document.querySelector('#close-menu');
  const modal = document.getElementById('event-modal');
  const main = document.querySelector('main');
  const modalContent = document.getElementById('modal-content');
  const searchInput = document.getElementById("searchInput");
  const feeFilter = document.getElementById("feeFilter");

  let eventsData = [];
  let currentPage = 0;
  const eventsPerPage = 5; // Number of events to show per page

  currentPage = parseInt(localStorage.getItem('currentPage')) || 0;


  // Dynamic Event Display: Fetch data from the JSON file API 
  async function fetchData() {
    try {
      const response = await fetch('http://localhost:5500/events');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      eventsData = await response.json();
      localStorage.setItem('eventDetails', JSON.stringify(eventsData)); // Save data in localStorage
    } catch (error) {
      console.error('Error fetching data:', error);
      // Load from localStorage if API fetch fails
      const savedData = localStorage.getItem('eventDetails');
      if (savedData) {
        eventsData = JSON.parse(savedData);
      } else {
        console.error('No data found in localStorage.');
      }
    }

    const sortedData = eventsData.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    handleEventListingPage(sortedData);
  }





  
//DYNAMIC EVENT LISTING

  // Search and Filter Functionality - fetching data
  function filterEvents() { //function to retrieve events based on user input
    const query = searchInput.value.toLowerCase(); // Get user's search input
    const selectedFeeRange = feeFilter.value; // Get selected fee range filter value

    return eventsData.filter(event => {
      const matchesQuery = event.title.toLowerCase().includes(query) || event.location.toLowerCase().includes(query); //check to see if title/location contains the search query

      let matchesFeeRange = true;
      switch (selectedFeeRange) { //function to determine seleceted fee range to ensure only events withing the search query and fee raneg are displayed
        case "below-50":
          matchesFeeRange = event.fee < 50;
          break;
        case "50-100":
          matchesFeeRange = event.fee >= 50 && event.fee <= 100;
          break;
        case "100-150":
          matchesFeeRange = event.fee > 100 && event.fee <= 150;
          break;
        case "150-200":
          matchesFeeRange = event.fee > 150 && event.fee <= 200;
          break;
        case "above-200":
          matchesFeeRange = event.fee > 200;
          break;
        default:
          matchesFeeRange = true; // "All Fees" option
      }

      return matchesQuery && matchesFeeRange; //only returns values that matched the search query and fee range
    });
  }

  //function to re-render events dynamically
  function displayFilteredEvents() { 
    const filteredEvents = filterEvents(); //calls 
    const eventsToDisplay = filteredEvents.slice(0, (currentPage + 1) * eventsPerPage);
    populateEvents(eventsToDisplay); //generates html content for each event

    if (filteredEvents.length <= (currentPage + 1) * eventsPerPage) {
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = 'No More Events';
    } else {
      loadMoreButton.disabled = false;
      loadMoreButton.textContent = 'Load More Events';
    }
  }


  // Event listeners for search input and fee dropdown
  // Debounce for search input
  let debounceTimeout;
  searchInput.addEventListener("keyup", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(displayFilteredEvents, 300);
  });
  feeFilter.addEventListener("change", displayFilteredEvents);

  function handleEventListingPage(sortedData) {
    populateEvents(sortedData.slice(0, eventsPerPage));

    if (loadMoreButton) {
      loadMoreButton.style.display = 'block';
      loadMoreButton.addEventListener('click', () => {
        currentPage++;
        displayFilteredEvents();
      });
    }
  }

  function populateEvents(data, append = false) {
    if (!eventCard) {
      console.warn("Events element is not found in the DOM.");
      return;
    }

    if (!append) {
      eventCard.innerHTML = ''; // Clear the current events if not appending
    }

    data.forEach(item => {
      const isSaved = localStorage.getItem(`savedEvent-${item.id}`) !== null;
      const heartIconSrc = isSaved ? '/assets/images/love-colored.png' : '/assets/images/hd-white-large-heart-icon.png';

      const eventHTML = `
        <div class="event" data-id="${item.id}">
          <h4 class="fee">&pound;${item.fee}</h4>
          <div class="heart">
            <img class='heartImage' src="${heartIconSrc}" loading="lazy" alt='Save icon'>
          </div>
          <div id="close-saved-event">
            <img class="eventImage" src='/assets/images/cross.png' loading="lazy" alt='Cross'>
          </div>
          <img src="../assets/images/${item.imageUrl}" loading="lazy" alt="${item.title}">
          <div class="event-description">
            <div class="events-overlay"></div>
            <h3>${item.title}, <em>${item.location}</em></h3>
            <p>${item.date}</p>
            <div class='controls'>
              <button type="button" class='view-details-btn'>View Details</button>
              <button type="button" class='book-event-btn'>Book Event</button>
            </div>
          </div>
        </div>
      `;

      eventCard.innerHTML += eventHTML;
    });

    rebindViewDetailsButtons(); // Rebind view details functionality after appending new events
  }

  async function loadMoreEvents(sortedData) {
    const start = (currentPage + 1) * eventsPerPage;
    const end = start + eventsPerPage;

    const nextEvents = sortedData.slice(start, end);
    populateEvents(nextEvents, true); // Use append mode
    currentPage++;

    if (currentPage * eventsPerPage >= sortedData.length) {
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = 'No More Events';
    }
  }

  function rebindViewDetailsButtons() {
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const eventElement = e.target.closest('.event');
        const eventId = eventElement ? eventElement.dataset.id : null;

        if (eventId) {
          window.location.href = `event-detail.html?id=${eventId}`;
        } else {
          console.error("Event ID not found");
        }
      });
    });
  }

  // Modal functionality
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('book-event-btn')) {
      const eventElement = e.target.closest('.event');
      const eventId = eventElement ? eventElement.dataset.id : null;
      if (eventId) {
        const eventDetails = eventsData.find(event => event.id == eventId);
        if (eventDetails) {
          showEventModal(eventDetails);
        }
      }
    } else if (e.target.classList.contains('close-modal-btn')) {
      closeModal();
    } 
  });

  function showEventModal(eventDetails) {
    // Populate modal with event details
    modalContent.innerHTML = `
      <h2>${eventDetails.title}</h2>
      <p class='fee'><strong>Fee:</strong> &pound;${eventDetails.fee}</p>
      <p>${eventDetails.description || 'No description available.'}</p>
      <p><strong>Location:</strong> ${eventDetails.location}</p>
      <p><strong>Date:</strong> ${eventDetails.date}</p>
      <div id="controllers">
        <button type="button" class="confirm-book-btn">Confirm Booking</button>
        <button type="button" class="close-modal-btn">Close</button>
      </div>
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

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('heartImage')) {
      const eventElement = e.target.closest('.event');
      const heartIcon = e.target;
      const eventId = eventElement.dataset.id;

      if (heartIcon.src.includes('hd-white-large-heart-icon.png')) {
        heartIcon.src = '/assets/images/love-colored.png';

        const savedEventHTML = eventElement.outerHTML;
        if (!localStorage.getItem(`savedEvent-${eventId}`)) {
          localStorage.setItem(`savedEvent-${eventId}`, savedEventHTML);

          if (savedCard) {
            savedCard.innerHTML += savedEventHTML;
            rebindViewDetailsButtons(); // Rebind after adding new saved events
          }
        } else {
          alert('This event is already saved!');
        }
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('#close-saved-event')) {
      const savedEventElement = e.target.closest('.event');
      if (savedEventElement) {
        const eventId = savedEventElement.dataset.id;

        localStorage.removeItem(`savedEvent-${eventId}`);

        const heartIcon = savedEventElement.querySelector('.heartImage');
        if (heartIcon) {
          heartIcon.src = '/assets/images/hd-white-large-heart-icon.png';
        }

        if (savedCard.contains(savedEventElement)) {
          savedEventElement.remove();
        }
      }
    }
  });

  function loadSavedEvents() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('savedEvent-')) {
        const savedEventHTML = localStorage.getItem(key);
        if (savedEventHTML && savedCard) {
          savedCard.innerHTML += savedEventHTML;
        }
      }
    }
    rebindViewDetailsButtons(); // Rebind after loading saved events
  }

  // Menu toggle functionality
  if (menuIcon && closeIcon && menuList) {
    menuIcon.addEventListener('click', () => {
      menuList.style.display = 'flex';
      menuIcon.style.display = 'none';
    });

    closeIcon.addEventListener('click', () => {
      menuList.style.display = 'none';
      menuIcon.style.display = 'block';
    });
  }

  gearIcon.addEventListener('click', openCustomNavigation);
  function openCustomNavigation() {
    customize.style.display = 'block';
    gearIcon.style.display = 'none';
  }

  customizeFontSize.addEventListener('click', openFontSizeCustomButtons);
  function openFontSizeCustomButtons() {
    customButtons.style.display = 'block';
    headerBackgroundButtons.style.display = 'none';
  }

  customizeHeaderBackground.addEventListener('click', openHeaderBackgroundButtons);
  function openHeaderBackgroundButtons() {
    headerBackgroundButtons.style.display = 'block';
    customButtons.style.display = 'none';
  }

  // Save font size to localStorage
  function saveFontSize(size) {
    localStorage.setItem("fontSize", size);
  }

  // Apply stored font size on page load
  function applyStoredFontSize() {
    const savedFontSize = localStorage.getItem("fontSize");
    if (savedFontSize) {
      document.body.classList.remove("small-font", "medium-font", "large-font");
      document.body.classList.add(savedFontSize);
    }
  }

  // Set font size and save it
  function setFontSize(size) {
    document.body.classList.remove("small-font", "medium-font", "large-font");
    document.body.classList.add(size);
    saveFontSize(size);
  }

  // Apply stored font size on page load
  document.addEventListener("DOMContentLoaded", applyStoredFontSize);

  // Synchronize changes across tabs
  window.addEventListener("storage", (event) => {
    if (event.key === "fontSize") {
      applyStoredFontSize();
    }
  });

  function closeCustomizationButtons() {
    customButtons.style.display = 'none';
    customize.style.display = 'none';
    gearIcon.style.display = 'block';
  }

  // FontSize Logic
  // Apply saved font size on page load
  const savedFontSize = localStorage.getItem('fontSize');
  if (savedFontSize) {
    setFontSize(savedFontSize);
  }

  function setSmallFontSize() {
    setFontSize("small-font");
    closeCustomizationButtons();
  }
  function setMediumFontSize() {
    setFontSize("medium-font");
    closeCustomizationButtons();
  }
  function setLargeFontSize() {
    setFontSize("large-font");
    closeCustomizationButtons();
  }

  // Add event listeners for buttons
  smallFontSize.addEventListener("click", setSmallFontSize);
  mediumFontSize.addEventListener("click", setMediumFontSize);
  largeFontSize.addEventListener("click", setLargeFontSize);




  //Customised Presentation
  // Customizable Header Background Color functions
  function loadSavedColor() {
    const savedColor = localStorage.getItem("headerBackgroundColor");
    if (savedColor) {
      header.style.backgroundColor = savedColor;
      colorInput.value = savedColor; // Update the color input value
    }
  }

  // Event listeners for preset buttons
  primaryBg.addEventListener("click", () => {
    const color = "#672D9E";
    updateBackgroundColor(color);
  });

  secondaryBg.addEventListener("click", () => {
    const color = "#120418";
    updateBackgroundColor(color);
  });

  tertiaryBg.addEventListener("click", () => {
    const color = "#180933";
    updateBackgroundColor(color);
  });

  // Event listener for color input
  colorInput.addEventListener("input", (event) => {
    const selectedColor = event.target.value;
    updateBackgroundColor(selectedColor);
  });

  function updateBackgroundColor(color) {
    header.style.backgroundColor = color;
    localStorage.setItem("headerBackgroundColor", color);
  }

  // Load the saved color on page load
  loadSavedColor();

  // Clickable close buttons for Customizations
  closeCustomButtonsSizeAndBackground.forEach(button => button.addEventListener('click', closeSizeAndBackgroundButtons));

  closeCustomButtons.addEventListener('click', closeCustomButton);

  function closeSizeAndBackgroundButtons() {
    headerBackgroundButtons.style.display = 'none';
    customButtons.style.display = 'none';
  }
 
  

  //Customisab
  function closeCustomButton() {
    customize.style.display = 'none';
    headerBackgroundButtons.style.display = 'none';
    customButtons.style.display = 'none';
    gearIcon.style.display = 'block';
  }

  fetchData();
  loadSavedEvents();
});

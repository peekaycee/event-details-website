const cross = document.querySelector('#cross');
let data = []; // Initialize data array
const dataContainer = document.querySelector('#dataContainer');
const form = document.querySelector('#crudForm');
const blurMain = document.querySelector('main');
let editingId = null; // Store the id of the event being edited

// Fetch data from the server
async function fetchData() {
  try {
    const response = await fetch('http://localhost:5500/events');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    data = await response.json();
    renderUI();
  } catch (error) {
    console.error('Error fetching data:', error);
    data = []; 
    renderUI();
  }
}

// Render data in the UI
function renderUI() {   
  dataContainer.innerHTML = '';
  data.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.imageUrl}</td>
      <td>${item.videoUrl}</td>
      <td>${item.title}</td>
      <td>${item.description}</td>
      <td>${item.location}</td>
      <td>${item.date}</td>
      <td>${item.fee}</td>
      <td>
      <div class='btnContainer'>
        <button class='editBtn' onclick="editItem(${item.id})"><img src='../assets/images/editIcon.png' loading="lazy" alt='Edit Icon'></button>
        <button class='deleteBtn' onclick="deleteItem(${item.id})"><img src='../assets/images/deleteIcon.png' loading="lazy" alt='Delete Icon'></button>
      </div>
      </td>
    `;
    dataContainer.appendChild(row);
  });
}

// Add new item
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const imageUrl = document.getElementById('imageUrl').value;
  const videoUrl = document.getElementById('videoUrl').value;
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const location = document.getElementById('location').value;
  const date = document.getElementById('date').value;
  const fee = document.getElementById('fee').value;

  const newItem = { imageUrl, videoUrl, title, description, location, date, fee };

  try {
    let response;
    if (editingId === null) {
      // Add new
      response = await fetch('http://localhost:5500/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        const savedItem = await response.json();
        data.unshift(savedItem);
      }
    } else {
      // Update existing
      response = await fetch(`http://localhost:5500/events/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        await fetchData(); // ✅ Get latest data from backend after update
      }
    }

    renderUI();
    form.reset();
    closeForm();
    editingId = null;
  } catch (error) {
    console.error('Error adding/updating event:', error);
    alert('Failed to add/update event.');
  }
});



// Edit an item
async function editItem(id) {
  const item = data.find((item) => item.id === id);
  if (item) {
    openForm();

    // Pre-fill the form with the current values
    document.getElementById('imageUrl').value = item.imageUrl;
    document.getElementById('videoUrl').value = item.videoUrl;
    document.getElementById('title').value = item.title;
    document.getElementById('description').value = item.description;
    document.getElementById('location').value = item.location;
    document.getElementById('date').value = item.date;
    document.getElementById('fee').value = item.fee;

    // Set the editingId to track which item is being edited
    editingId = id;
  }
}

// Delete an item
async function deleteItem(id) {
  try {
    const response = await fetch(`http://localhost:5500/events/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      data = data.filter((item) => item.id !== id);
      renderUI();
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    alert('Failed to delete item.');
  }
}

fetchData();

cross.addEventListener('click', closeForm);
function openForm() {
  form.style.display = 'block';
  blurMain.classList.add('blurred');
}

// Hide form
function closeForm() {
  form.style.display = 'none';
  blurMain.classList.remove('blurred');
}

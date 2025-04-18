// Feedack functionality
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const contactInput = document.querySelector('#contact');
const messageInput = document.querySelector('#message');
const contactForm = document.querySelector('#contact-form');

 contactForm.addEventListener("submit", function(e) {
  e.preventDefault();
  
  const name = nameInput.value;
  const email = emailInput.value;
  const contact = contactInput.value;
  const message = messageInput.value;
  
  if (name && email && contact && message) {
    alert(`Form submitted! Name: ${name}, Email: ${email}, Contact: ${contact}, Message: ${message}`);
    nameInput.value = "";
    emailInput.value = "";
    contactInput.value = "";
    messageInput.value = "";
  } else {
    alert("Please fill out all fields.");
  }
});
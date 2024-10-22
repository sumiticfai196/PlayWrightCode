// script.js

// Select the name input field and the display paragraph
const nameInput = document.getElementById('name');
const nameDisplay = document.getElementById('nameDisplay');

// Add an event listener to detect changes in the name field
nameInput.addEventListener('input', function () {
  // Get the value of the name field
  const nameValue = nameInput.value;
  
  // Update the paragraph with the name value
  nameDisplay.textContent = `Name field changed to: ${nameValue}`;
});

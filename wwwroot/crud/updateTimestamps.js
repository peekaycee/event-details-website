const fs = require('fs');
const path = require('path');

// Path to your data.json file
const filePath = path.join(__dirname, 'data.json');

// Read the existing data from the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const items = JSON.parse(data);

    // Add or update the `updatedAt` field for each item
    const updatedItems = items.map(item => ({
      ...item,
      updatedAt: new Date().toISOString() // Add/Update `updatedAt`
    }));

    // Write the updated data back to the file
    fs.writeFile(filePath, JSON.stringify(updatedItems, null, 2), 'utf8', err => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }

      console.log('Timestamps updated successfully!');
    });
  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});

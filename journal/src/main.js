document.addEventListener('DOMContentLoaded', () => {
  const editableDiv = document.getElementById('editable-div');
  const displayContent = document.getElementById('display-content');
  const submitButton = document.getElementById('submit-button');
  const entriesList = document.getElementById('entries-list');
  const analysisButton = document.getElementById('analysis-button');

  // Function to handle content change in the editable div
  editableDiv.addEventListener('input', () => {
    displayContent.textContent = editableDiv.innerText;
  });

  // Function to handle form submission
  submitButton.addEventListener('click', async () => {
    const content = editableDiv.innerText;
    const date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour12: false }); // Current date in YYYY-MM-DD HH:MM:SS format in EST

    const response = await fetch('http://localhost:5000/add_entry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, date }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message); // Alert success message
      fetchEntries(); // Fetch entries again to update the list
      editableDiv.innerText = ''; // Clear the content of the editable div
      displayContent.textContent = ''; // Clear the display content
    } else {
      alert(result.error); // Alert error message
    }
  });

  // Function to fetch entries from the backend
  const fetchEntries = async () => {
    const response = await fetch('http://localhost:5000/get_entries');
    if (!response.ok) {
      console.error('Failed to fetch entries:', response.statusText);
      return;
    }
    const data = await response.json();
    setEntries(data);
  };

  // Function to set entries in the sidebar
  const setEntries = (entries) => {
    if (!Array.isArray(entries)) {
      console.error('Entries is not an array:', entries);
      return;
    }
    entriesList.innerHTML = '';
    entries.forEach((entry, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = entry.date;
      listItem.addEventListener('click', async () => {
        console.log(entry); // Log the clicked entry
        editableDiv.innerText = entry.content;
      });
      entriesList.appendChild(listItem);
    });
  };

  // Event listener for the Analysis button
  analysisButton.addEventListener('click', () => {
    window.location.href = 'analysis.html'; // Redirect to analysis.html
  });

  // Fetch entries when the component mounts
  fetchEntries();
});

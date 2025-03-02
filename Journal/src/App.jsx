import React, { useState, useEffect } from 'react';

const YourComponent = () => {
  const [content, setContent] = useState(''); // State to hold the content of the editable div
  const [entries, setEntries] = useState([]); // State to hold the entries from MongoDB

  // Function to handle form submission
  const handleSubmit = async () => {
    setContent(''); // Clear the content of the editable div
    const response = await fetch('http://localhost:5000/add_entry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message); // Alert success message
      fetchEntries(); // Fetch entries again to update the list
    } else {
      alert(result.error); // Alert error message
    }
  };

  // Function to handle content change in the editable div
  const handleContentChange = (e) => {
    setContent(e.target.innerText); // Update the content state with the new text
  };

  // Function to fetch entries from the backend
  const fetchEntries = async () => {
    const response = await fetch('http://localhost:5000/get_entries');
    const data = await response.json();
    setEntries(data);
  };

  // Fetch entries when the component mounts
  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="bg-gray-900 text-white h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 p-4 border-r border-gray-700 flex flex-col">
        <h2 className="font-semibold mb-2">Notes</h2>
        {entries.map((entry, index) => (
          <p key={index}>{entry.date}</p>
        ))}
      </div>
      {/* Main content area */}
      <div className="w-3/4 p-4 flex flex-col items-center justify-center relative">
        {/* Editable div */}
        <div
          className="w-full max-w-lg h-1/2 p-2 border border-gray-700 bg-gray-800 text-gray-800 resize-none focus:outline-none overflow-auto"
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          style={{ whiteSpace: 'pre-wrap' }}
        >
        </div>
        {/* Display area for the content */}
        <div className="p-4 mt-4 border border-gray-700 bg-gray-800 text-white flex-grow w-full max-w-lg">
          <p>{content}</p>
        </div>
        {/* Text box in the middle of the screen */}
        <div className="absolute inset-0 flex items-center justify-center">
        </div>
        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white p-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default YourComponent;
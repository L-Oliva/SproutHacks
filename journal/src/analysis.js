document.addEventListener('DOMContentLoaded', async () => {
  const outputDiv = document.getElementById('output-div');
  const goBackButton = document.getElementById('go-back-button');

  // Fetch and display generated content
  try {
    const response = await fetch('http://localhost:5000/generate_content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: '' }) // Sending an empty prompt as the content is generated from all entries
    });

    if (!response.ok) {
      throw new Error(`Failed to generate content: ${response.statusText}`);
    }

    const data = await response.json();
    outputDiv.textContent = data.content; // Display the generated content in the output area
} catch (error) {
    console.error(error);
    outputDiv.textContent = 'Failed to generate content. Please try again later.';
  }

  // Event listener for the Go Back button
  goBackButton.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to index.html
  });
});
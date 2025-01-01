async function getAllMatches() {
  try {
    // Fetch data from the new Google Apps Script endpoint
    const response = await fetch('https://script.google.com/macros/s/AKfycbwRmpdG3a3huNcwoaHSRTcynQl9_HpaP_9NJZRsulUYpzGAvuy4TLlGGwb1w_Uto6KfeQ/exec');
    const data = await response.json();

    const matches = data.matches; // All matches fetched from Apps Script
    const allMatchesEl = document.getElementById('all-matches-tab');
    const sportTilesEl = document.getElementById('sport-tiles');
    const matchesContainerEl = document.getElementById('matches-container');

    // Get today's date and filter the matches
    const today = new Date();

    // Filter finished matches (based on the 'Finished' column, assuming 'Finished' is in column 6)
    const finishedMatches = matches.filter(match => {
      const finishedStatus = (match[6] || '').trim().toLowerCase(); // Normalize value (trim spaces, lowercase)
      return finishedStatus === 'yes';
    });

    // If no finished matches are found
    if (finishedMatches.length === 0) {
      matchesContainerEl.innerHTML = '<div>No finished matches available.</div>';
      return;
    }

    // Sort matches by date (descending)
    finishedMatches.sort((a, b) => new Date(b[1]) - new Date(a[1])); // Sort by date, descending

    // Group matches by sport
    const groupedMatches = finishedMatches.reduce((acc, match) => {
      const sport = match[0]; // Sport (Football, Basketball, etc.)
      if (!acc[sport]) acc[sport] = [];
      acc[sport].push(match);
      return acc;
    }, {});

    // **Sort sports alphabetically** before rendering
    const sortedSports = Object.keys(groupedMatches).sort();

    // Render sport tiles
    sportTilesEl.innerHTML = sortedSports
      .map(
        sport => `<div class="sport-tile" data-sport="${sport}">${sport}</div>`
      )
      .join('');

    // Add click event listeners for each tile
    const sportTiles = document.querySelectorAll('.sport-tile');
    sportTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        const selectedSport = tile.getAttribute('data-sport');
        const sportMatches = groupedMatches[selectedSport];

        // Hide the tiles and show the matches
        sportTilesEl.style.display = 'none';
        matchesContainerEl.innerHTML = `
          <div class="sport-section">
            <h2>${selectedSport}</h2>
            <div class="container-card">
              ${sportMatches
                .map(match => {
                  const team1Score = parseInt(match[4], 10);
                  const team2Score = parseInt(match[5], 10);

                  // Determine winner
                  const team1WinnerClass = team1Score > team2Score ? 'winner' : '';
                  const team2WinnerClass = team2Score > team1Score ? 'winner' : '';

                  return `
                    <div class="match-card">
                      <div class="team ${team1WinnerClass}">
                        <img src="${getTeamLogo(match[2])}" alt="${match[2]}" class="team-logo" />
                        <span class="team-name">${match[2]}</span>
                        <span class="team-score">${match[4]}</span>
                      </div>
                      <div class="team ${team2WinnerClass}">
                        <img src="${getTeamLogo(match[3])}" alt="${match[3]}" class="team-logo" />
                        <span class="team-name">${match[3]}</span>
                        <span class="team-score">${match[5]}</span>
                      </div>
                      <div class="match-date">${new Date(match[1]).toLocaleString()}</div>
                    </div>
                  `;
                })
                .join('')}
            </div>
            <button id="close-button" class="close-button">Close</button>
          </div>
        `;

        // Add event listener to the "Close" button
        document.getElementById('close-button').addEventListener('click', () => {
          matchesContainerEl.innerHTML = ''; // Clear the matches content
          sportTilesEl.style.display = 'flex'; // Show the tiles again
        });
      });
    });
  } catch (error) {
    console.error('Error fetching all matches:', error);
  }
}

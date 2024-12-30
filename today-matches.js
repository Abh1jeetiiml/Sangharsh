// This code should be in your today-matches.js file
window.getTodayMatches = async function() {
  try {
    const res = await fetch('https://script.google.com/macros/s/AKfycbwRmpdG3a3huNcwoaHSRTcynQl9_HpaP_9NJZRsulUYpzGAvuy4TLlGGwb1w_Uto6KfeQ/exec'); // New Apps Script URL
    const data = await res.json();

    // Get today's date in the same format as in the sheet (yyyy-mm-dd)
    const today = new Date().toLocaleDateString('en-GB'); // This will format as dd/mm/yyyy (e.g. 28/12/2024)

    // Filter the matches for today where finished status is 'No'
    const todayMatches = data.matches.filter(match => {
      const matchDate = new Date(match[1]).toLocaleDateString('en-GB');
      const finishedStatus = match[6]; // Assuming the finished status is in the 7th column (index 6)
      return matchDate === today && finishedStatus.toLowerCase() === 'no';
    });

    // Display today's matches
    const matchesContainer = document.getElementById('today-matches');
    if (matchesContainer) {
      if (todayMatches.length > 0) {
        displayMatches(todayMatches);  // Function to display the filtered matches
      } else {
        matchesContainer.innerHTML = '<p style="color: white;">No matches scheduled for today.</p>';
      }
    } else {
      console.error('Error: The element with id "today-matches" was not found in the HTML.');
    }
  } catch (error) {
    console.error('Error fetching today\'s matches:', error);
  }
}

// Function to display the matches as cards with a sport header
function displayMatches(matches) {
  const matchesContainer = document.getElementById('today-matches');
  matchesContainer.innerHTML = ''; // Clear the container before adding new matches

  // Group matches by sport type (e.g., Football)
  const groupedMatches = matches.reduce((acc, match) => {
    const sport = match[0];  // The sport name (e.g., "Football")
    if (!acc[sport]) acc[sport] = [];
    acc[sport].push(match);
    return acc;
  }, {});

  // Iterate over each sport type and display the matches
  Object.keys(groupedMatches).forEach(sport => {
    // Create a header for the sport
    const sportHeader = document.createElement('h2');
    sportHeader.classList.add('sport-header');
    sportHeader.textContent = sport;  // Display sport name (e.g., Football)
    matchesContainer.appendChild(sportHeader);

    // Display matches for this sport
    groupedMatches[sport].forEach(match => {
      const homeTeam = match[2];
      const awayTeam = match[3];
      const homeTeamLogo = getTeamLogo(homeTeam);  // Function to get the logo (replace with your own logic)
      const awayTeamLogo = getTeamLogo(awayTeam);  // Function to get the logo (replace with your own logic)
      const matchTime = new Date(match[1]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Time formatting

      const matchCard = document.createElement('div');
      matchCard.classList.add('match-card');

      matchCard.innerHTML = `
        <div class="match-details">
          <div class="team">
            <img src="${homeTeamLogo}" alt="${homeTeam}" class="team-logo" />
            <span class="team-name">${homeTeam}</span>
          </div>
          <span class="vs">vs</span>
          <div class="team">
            <img src="${awayTeamLogo}" alt="${awayTeam}" class="team-logo" />
            <span class="team-name">${awayTeam}</span>
          </div>
        </div>
        <div class="match-time">
          <span>${matchTime}</span>
        </div>
      `;

      matchesContainer.appendChild(matchCard);
    });
  });
}

// Helper function to return team logo (replace with actual logic to fetch logos)
function getTeamLogo(teamName) {
  const teamLogos = {
    "IIM-A": "https://upload.wikimedia.org/wikipedia/commons/2/27/IIMA_LOGO_BLACK.png", // Replace with actual logo paths
    "IIM-B": "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/IIM_Bangalore_Logo.svg/440px-IIM_Bangalore_Logo.svg.png", // Replace with actual logo paths
    "IIM-C": "https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/IIM_Calcutta_Logo.svg/1200px-IIM_Calcutta_Logo.svg.png",
    "IIM-L": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/IIM_Lucknow_Logo.svg/1200px-IIM_Lucknow_Logo.svg.png",
    // Add more teams and their logo paths here
  };
  return teamLogos[teamName] || "default_logo.png"; // Default logo if not found
}

async function getStandings() {
  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbwRmpdG3a3huNcwoaHSRTcynQl9_HpaP_9NJZRsulUYpzGAvuy4TLlGGwb1w_Uto6KfeQ/exec'
    );
    const data = await response.json();

    const matches = data.matches.filter(match => match[6] === "Yes");

    const standings = {};
    matches.forEach(match => {
      const sport = match[0];
      const homeTeam = match[2];
      const awayTeam = match[3];
      const homeScore = parseInt(match[4]) || 0;
      const awayScore = parseInt(match[5]) || 0;

      if (!standings[sport]) standings[sport] = {};

      const updateTeamStats = (team, played, won, lost, points) => {
        if (!standings[sport][team]) standings[sport][team] = { played: 0, won: 0, lost: 0, points: 0 };
        standings[sport][team].played += played;
        standings[sport][team].won += won;
        standings[sport][team].lost += lost;
        standings[sport][team].points += points;
      };

      if (homeScore > awayScore) {
        updateTeamStats(homeTeam, 1, 1, 0, 3);
        updateTeamStats(awayTeam, 1, 0, 1, 0);
      } else if (homeScore < awayScore) {
        updateTeamStats(homeTeam, 1, 0, 1, 0);
        updateTeamStats(awayTeam, 1, 1, 0, 3);
      } else {
        updateTeamStats(homeTeam, 1, 0, 0, 1);
        updateTeamStats(awayTeam, 1, 0, 0, 1);
      }
    });

    const standingsEl = document.getElementById('standings-tab');
    standingsEl.innerHTML = '';

    // **Sort sports alphabetically** before rendering
    const sortedSports = Object.keys(standings).sort();

    sortedSports.forEach(sport => {
      const sortedStandings = Object.keys(standings[sport])
        .map(team => ({
          team,
          ...standings[sport][team],
        }))
        .sort((a, b) => b.points - a.points || b.won - a.won || b.played - a.played);

      const sportCard = document.createElement('div');
      sportCard.classList.add('sport-card');
      sportCard.innerHTML = `<h2>${sport} Standings</h2>`;

      const table = document.createElement('table');
      table.classList.add('standings-table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Played</th>
            <th>Won</th>
            <th>Lost</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          ${sortedStandings
            .map(
              (team, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${team.team}</td>
                <td>${team.played}</td>
                <td>${team.won}</td>
                <td>${team.lost}</td>
                <td>${team.points}</td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      `;

      sportCard.appendChild(table);
      standingsEl.appendChild(sportCard);
    });
  } catch (error) {
    console.error('Error fetching standings:', error);
    document.getElementById('standings-tab').innerHTML = '<div>Error loading standings.</div>';
  }
}

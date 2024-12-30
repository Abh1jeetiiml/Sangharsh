async function init() {
  try {
    // Make sure that getTodayMatches is available before calling it
    if (typeof window.getTodayMatches === 'function') {
      await window.getTodayMatches();
      await getAllMatches();  // Make sure getAllMatches is available
      await getStandings();    // Make sure getStandings is available
    } else {
      console.error("getTodayMatches function is not defined!");
    }
  } catch (error) {
    console.error(error);
  }
}

init();

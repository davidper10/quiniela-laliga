export function outcome(home: number, away: number): "home" | "away" | "draw" {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

export function calculatePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
) {
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return {
      points: 5,
      exactScore: true,
      oneTeamScore: false,
      correctOutcome: false,
      correctGoalDiff: false,
    };
  }

  const oneTeamScore =
    predictedHome === actualHome || predictedAway === actualAway;

  const correctOutcome =
    outcome(predictedHome, predictedAway) === outcome(actualHome, actualAway);

  const correctGoalDiff =
    predictedHome - predictedAway === actualHome - actualAway;

  let points = 0;
  if (oneTeamScore) points += 1;
  if (correctOutcome) points += 1;
  if (correctGoalDiff) points += 1;

  return {
    points,
    exactScore: false,
    oneTeamScore,
    correctOutcome,
    correctGoalDiff,
  };
}
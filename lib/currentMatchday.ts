type Matchday = {
  id: string;
  number: number;
  first_kickoff_at: string;
  last_kickoff_at: string;
  status: string;
};

export function getDefaultMatchdayId(matchdays: Matchday[]) {
  const now = new Date();

  const active = matchdays.find((matchday) => {
    const first = new Date(matchday.first_kickoff_at);
    const last = new Date(matchday.last_kickoff_at);

    return now >= first && now <= last && matchday.status !== "finished";
  });

  if (active) return active.id;

  const next = matchdays.find((matchday) => {
    return new Date(matchday.first_kickoff_at) > now;
  });

  if (next) return next.id;

  return matchdays[matchdays.length - 1]?.id;
}
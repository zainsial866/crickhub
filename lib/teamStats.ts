import { CricketMatch, TeamMember } from '@/types';

export interface DerivedTeamStats {
  matches: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  winRate: number;
  runsScored: number;
  wicketsTaken: number;
  runsConceded: number;
  wicketsLost: number;
  catches: number;
  runOuts: number;
}

export interface PlayerBattingRecord {
  memberId: string;
  name: string;
  matches: number;
  innings: number;
  runs: number;
  balls: number;
  notOuts: number;
  highestScore: number;
  highestScoreNotOut: boolean;
  fours: number;
  sixes: number;
  thirties: number;
  fifties: number;
  hundreds: number;
  average: number;
  strikeRate: number;
  dotBalls: number;
}

export interface PlayerBowlingRecord {
  memberId: string;
  name: string;
  matches: number;
  overs: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  average: number;
  strikeRate: number;
  bestWickets: number;
  bestRuns: number;
  bestFigures: string;
  threeWicketHauls: number;
  fourWicketHauls: number;
  fiveWicketHauls: number;
  dotBalls: number;
  wides: number;
  noBalls: number;
}

export interface PlayerFieldingRecord {
  memberId: string;
  name: string;
  matches: number;
  catches: number;
  runOuts: number;
  directHitRunOuts: number;
  stumpings: number;
  totalDismissals: number;
}

export interface TeamAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: string;
  unlockedDate?: string;
}

export interface RecordHolder {
  player: string;
  value: number;
  detail?: string;
}

export interface MatchRecord {
  player: string;
  value: number;
  opponent: string;
  date: string;
  detail?: string;
}

export interface TeamRecordsSummary {
  batting: {
    highestIndividualScore: { player: string; score: number; opponent: string; date: string };
    mostRuns: { player: string; value: number };
    mostFours: { player: string; value: number };
    mostSixes: { player: string; value: number };
    mostFifties: { player: string; value: number };
    mostHundreds: { player: string; value: number };
    fastestFifty: MatchRecord | null;
    fastestHundred: MatchRecord | null;
    bestStrikeRate: { player: string; value: number };
    mostRunsInSeason: { player: string; value: number; season: string };
    mostRunsInMatch: MatchRecord | null;
  };
  bowling: {
    mostWickets: { player: string; value: number };
    bestBowlingFigures: { player: string; figures: string; opponent: string; date: string };
    mostWicketsInMatch: MatchRecord | null;
    mostDotBalls: { player: string; value: number };
    mostMaidens: { player: string; value: number };
    bestEconomy: { player: string; value: number };
    bestBowlingAverage: { player: string; value: number };
    mostThreeWicketHauls: { player: string; value: number };
    mostFourWicketHauls: { player: string; value: number };
    mostFiveWicketHauls: { player: string; value: number };
  };
  fielding: {
    mostCatches: { player: string; value: number };
    mostRunOuts: { player: string; value: number };
    mostStumpings: { player: string; value: number };
    mostDismissals: { player: string; value: number };
  };
  team: {
    highestTotal: { score: string; opponent: string; date: string };
    lowestTotal: { score: string; opponent: string; date: string };
    highestSuccessfulChase: { score: string; opponent: string; date: string } | null;
    biggestWin: { margin: string; opponent: string; date: string };
    biggestLoss: { margin: string; opponent: string; date: string };
    highestRunRate: { rate: string; opponent: string; date: string } | null;
    lowestRunRate: { rate: string; opponent: string; date: string } | null;
    longestWinStreak: number;
    longestUnbeatenStreak: number;
    highestPartnership: { pair: string; runs: number; opponent: string } | null;
    mostBoundariesInMatch: MatchRecord | null;
    mostSixesInMatch: MatchRecord | null;
    mostWicketsInMatch: MatchRecord | null;
  };
}

/**
 * Filter matches belonging strictly to this team, with optional time period and competition filters
 */
export function getTeamMatches(
  teamId: string,
  matches: CricketMatch[],
  period: 'all' | '2026' | '30days' = 'all',
  competition: string = 'all'
): CricketMatch[] {
  return matches.filter((m) => {
    if (m.teamId !== teamId) return false;

    if (competition !== 'all' && m.matchType !== competition) {
      return false;
    }

    if (period === '2026') {
      if (!m.date.startsWith('2026')) return false;
    } else if (period === '30days') {
      const matchTime = new Date(m.date).getTime();
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      if (matchTime < thirtyDaysAgo) return false;
    }

    return true;
  });
}

/**
 * Calculate team-level aggregate performance strictly from completed matches
 */
export function calculateTeamStats(
  teamId: string,
  matches: CricketMatch[],
  period: 'all' | '2026' | '30days' = 'all',
  competition: string = 'all'
): DerivedTeamStats {
  const completed = getTeamMatches(teamId, matches, period, competition).filter(
    (m) => m.status === 'completed'
  );

  const wins = completed.filter((m) => m.result === 'win').length;
  const losses = completed.filter((m) => m.result === 'loss').length;
  const draws = completed.filter((m) => m.result === 'draw').length;
  const matchCount = completed.length;
  const points = wins * 2 + draws * 1;
  const winRate = matchCount > 0 ? (wins / matchCount) * 100 : 0;

  const runsScored = completed.reduce((acc, m) => acc + (m.teamScore || 0), 0);
  const wicketsTaken = completed.reduce((acc, m) => acc + (m.opponentWickets || 0), 0);
  const runsConceded = completed.reduce((acc, m) => acc + (m.opponentScore || 0), 0);
  const wicketsLost = completed.reduce((acc, m) => acc + (m.teamWickets || 0), 0);

  const catches = completed.reduce(
    (acc, m) => acc + m.playerStats.reduce((sum, s) => sum + (s.catches || 0), 0),
    0
  );
  const runOuts = completed.reduce(
    (acc, m) => acc + m.playerStats.reduce((sum, s) => sum + (s.runOuts || 0), 0),
    0
  );

  return {
    matches: matchCount,
    wins,
    losses,
    draws,
    points,
    winRate: Number(winRate.toFixed(1)),
    runsScored,
    wicketsTaken,
    runsConceded,
    wicketsLost,
    catches,
    runOuts,
  };
}

/**
 * Calculate individual batting records for every member in this team
 */
export function calculateAllBattingStats(
  teamId: string,
  members: TeamMember[],
  matches: CricketMatch[],
  period: 'all' | '2026' | '30days' = 'all',
  competition: string = 'all'
): PlayerBattingRecord[] {
  const completed = getTeamMatches(teamId, matches, period, competition).filter(
    (m) => m.status === 'completed'
  );

  return members.map((member) => {
    let matchCount = 0;
    let innings = 0;
    let runs = 0;
    let balls = 0;
    let notOuts = 0;
    let highestScore = 0;
    let highestScoreNotOut = false;
    let fours = 0;
    let sixes = 0;
    let thirties = 0;
    let fifties = 0;
    let hundreds = 0;
    let dotBalls = 0;

    for (const match of completed) {
      // Check if member was in squad
      const inSquad = match.squad.includes(member.id) || (member.userId !== undefined && match.squad.includes(member.userId));
      if (!inSquad) continue;
      matchCount++;

      // Priority: use rich batting scorecard if available, otherwise playerStats
      const battingEntry = match.batting?.find(
        (b) => b.playerId === member.id || b.playerId === member.userId || b.playerName.toLowerCase() === member.name.toLowerCase()
      );
      const simpleStat = match.playerStats.find(
        (s) => s.playerId === member.id || s.playerId === member.userId || s.playerName.toLowerCase() === member.name.toLowerCase()
      );

      const r = battingEntry ? battingEntry.runs : simpleStat ? simpleStat.runs : 0;
      const b = battingEntry ? battingEntry.balls : simpleStat ? simpleStat.balls : 0;
      const f = battingEntry ? battingEntry.fours : simpleStat ? simpleStat.fours : 0;
      const s = battingEntry ? battingEntry.sixes : simpleStat ? simpleStat.sixes : 0;
      const isNO = battingEntry ? battingEntry.isNotOut : false;
      const dots = battingEntry?.dotBalls || 0;

      if (b > 0 || r > 0 || (battingEntry && battingEntry.dismissal)) {
        innings++;
        runs += r;
        balls += b;
        fours += f;
        sixes += s;
        dotBalls += dots;

        if (isNO) notOuts++;

        if (r > highestScore) {
          highestScore = r;
          highestScoreNotOut = isNO;
        }

        if (r >= 100) hundreds++;
        else if (r >= 50) fifties++;
        else if (r >= 30) thirties++;
      }
    }

    const dismissals = innings - notOuts;
    const average = dismissals > 0 ? runs / dismissals : runs;
    const strikeRate = balls > 0 ? (runs / balls) * 100 : 0;

    return {
      memberId: member.id,
      name: member.name,
      matches: matchCount,
      innings,
      runs,
      balls,
      notOuts,
      highestScore,
      highestScoreNotOut,
      fours,
      sixes,
      thirties,
      fifties,
      hundreds,
      average: Number(average.toFixed(1)),
      strikeRate: Number(strikeRate.toFixed(1)),
      dotBalls,
    };
  }).sort((a, b) => b.runs - a.runs);
}

/**
 * Calculate individual bowling records for every member in this team
 */
export function calculateAllBowlingStats(
  teamId: string,
  members: TeamMember[],
  matches: CricketMatch[],
  period: 'all' | '2026' | '30days' = 'all',
  competition: string = 'all'
): PlayerBowlingRecord[] {
  const completed = getTeamMatches(teamId, matches, period, competition).filter(
    (m) => m.status === 'completed'
  );

  return members.map((member) => {
    let matchCount = 0;
    let overs = 0;
    let maidens = 0;
    let runsConceded = 0;
    let wickets = 0;
    let bestWickets = 0;
    let bestRuns = 999;
    let threeWicketHauls = 0;
    let fourWicketHauls = 0;
    let fiveWicketHauls = 0;
    let dotBalls = 0;
    let wides = 0;
    let noBalls = 0;

    for (const match of completed) {
      const inSquad = match.squad.includes(member.id) || (member.userId !== undefined && match.squad.includes(member.userId));
      if (!inSquad) continue;
      matchCount++;

      const bowlingEntry = match.bowling?.find(
        (b) => b.playerId === member.id || b.playerId === member.userId || b.playerName.toLowerCase() === member.name.toLowerCase()
      );
      const simpleStat = match.playerStats.find(
        (s) => s.playerId === member.id || s.playerId === member.userId || s.playerName.toLowerCase() === member.name.toLowerCase()
      );

      const o = bowlingEntry ? bowlingEntry.overs : simpleStat ? simpleStat.overs : 0;
      const m = bowlingEntry ? bowlingEntry.maidens : 0;
      const r = bowlingEntry ? bowlingEntry.runsConceded : simpleStat ? simpleStat.bowlingRuns : 0;
      const w = bowlingEntry ? bowlingEntry.wickets : simpleStat ? simpleStat.wickets : 0;

      if (o > 0) {
        overs += o;
        maidens += m;
        runsConceded += r;
        wickets += w;
        dotBalls += bowlingEntry?.dotBalls || 0;
        wides += bowlingEntry?.wides || 0;
        noBalls += bowlingEntry?.noBalls || 0;

        if (w >= 3) threeWicketHauls++;
        if (w >= 4) fourWicketHauls++;
        if (w >= 5) fiveWicketHauls++;

        if (w > bestWickets || (w === bestWickets && r < bestRuns)) {
          bestWickets = w;
          bestRuns = r;
        }
      }
    }

    const economy = overs > 0 ? runsConceded / overs : 0;
    const average = wickets > 0 ? runsConceded / wickets : 0;
    const strikeRate = wickets > 0 ? (overs * 6) / wickets : 0;
    const bestFigures = bestWickets > 0 ? `${bestWickets}/${bestRuns}` : '0/0';

    return {
      memberId: member.id,
      name: member.name,
      matches: matchCount,
      overs,
      maidens,
      runsConceded,
      wickets,
      economy: Number(economy.toFixed(2)),
      average: Number(average.toFixed(1)),
      strikeRate: Number(strikeRate.toFixed(1)),
      bestWickets,
      bestRuns: bestWickets > 0 ? bestRuns : 0,
      bestFigures,
      threeWicketHauls,
      fourWicketHauls,
      fiveWicketHauls,
      dotBalls,
      wides,
      noBalls,
    };
  }).sort((a, b) => b.wickets - a.wickets || a.economy - b.economy);
}

/**
 * Calculate individual fielding records for every member in this team
 */
export function calculateAllFieldingStats(
  teamId: string,
  members: TeamMember[],
  matches: CricketMatch[],
  period: 'all' | '2026' | '30days' = 'all',
  competition: string = 'all'
): PlayerFieldingRecord[] {
  const completed = getTeamMatches(teamId, matches, period, competition).filter(
    (m) => m.status === 'completed'
  );

  return members.map((member) => {
    let matchCount = 0;
    let catches = 0;
    let runOuts = 0;
    let directHitRunOuts = 0;
    let stumpings = 0;

    for (const match of completed) {
      const inSquad = match.squad.includes(member.id) || (member.userId !== undefined && match.squad.includes(member.userId));
      if (!inSquad) continue;
      matchCount++;

      const fieldingEntry = match.fielding?.find(
        (f) => f.playerId === member.id || f.playerId === member.userId || f.playerName.toLowerCase() === member.name.toLowerCase()
      );
      const simpleStat = match.playerStats.find(
        (s) => s.playerId === member.id || s.playerId === member.userId || s.playerName.toLowerCase() === member.name.toLowerCase()
      );

      catches += fieldingEntry ? fieldingEntry.catches : simpleStat ? simpleStat.catches : 0;
      runOuts += fieldingEntry ? fieldingEntry.runOuts : simpleStat ? simpleStat.runOuts : 0;
      directHitRunOuts += fieldingEntry ? fieldingEntry.directHitRunOuts || 0 : 0;
      stumpings += fieldingEntry ? fieldingEntry.stumpings : 0;
    }

    return {
      memberId: member.id,
      name: member.name,
      matches: matchCount,
      catches,
      runOuts,
      directHitRunOuts,
      stumpings,
      totalDismissals: catches + runOuts + stumpings,
    };
  }).sort((a, b) => b.totalDismissals - a.totalDismissals);
}

/**
 * Calculate team records strictly from completed matches
 */
export function calculateTeamRecords(
  teamId: string,
  members: TeamMember[],
  matches: CricketMatch[]
): TeamRecordsSummary {
  const completed = matches.filter((m) => m.teamId === teamId && m.status === 'completed');

  const battingStats = calculateAllBattingStats(teamId, members, matches);
  const bowlingStats = calculateAllBowlingStats(teamId, members, matches);
  const fieldingStats = calculateAllFieldingStats(teamId, members, matches);

  // Batting Records
  let highIndividual = { player: '—', score: 0, opponent: '—', date: '—' };
  for (const m of completed) {
    for (const s of m.playerStats) {
      if (s.runs > highIndividual.score) {
        highIndividual = {
          player: s.playerName,
          score: s.runs,
          opponent: m.opponentName,
          date: m.date,
        };
      }
    }
  }

  const topRunScorer = battingStats[0] || { name: '—', runs: 0 };
  const topFours = [...battingStats].sort((a, b) => b.fours - a.fours)[0] || { name: '—', fours: 0 };
  const topSixes = [...battingStats].sort((a, b) => b.sixes - a.sixes)[0] || { name: '—', sixes: 0 };
  const topFifties = [...battingStats].sort((a, b) => b.fifties - a.fifties)[0] || { name: '—', fifties: 0 };
  const topSR = [...battingStats].filter((b) => b.balls >= 15).sort((a, b) => b.strikeRate - a.strikeRate)[0] || { name: '—', strikeRate: 0 };

  // Bowling Records
  const topWickets = bowlingStats[0] || { name: '—', wickets: 0 };
  let bestFigures = { player: '—', figures: '—', opponent: '—', date: '—' };
  let bestW = 0;
  let bestR = 999;
  for (const m of completed) {
    for (const s of m.playerStats) {
      if (s.wickets > bestW || (s.wickets === bestW && s.bowlingRuns < bestR && s.wickets > 0)) {
        bestW = s.wickets;
        bestR = s.bowlingRuns;
        bestFigures = {
          player: s.playerName,
          figures: `${s.wickets}/${s.bowlingRuns}`,
          opponent: m.opponentName,
          date: m.date,
        };
      }
    }
  }
  const topEconomy = [...bowlingStats].filter((b) => b.overs >= 4).sort((a, b) => a.economy - b.economy)[0] || { name: '—', economy: 0 };
  const topMaidens = [...bowlingStats].sort((a, b) => b.maidens - a.maidens)[0] || { name: '—', maidens: 0 };
  const top3WHauls = [...bowlingStats].sort((a, b) => b.threeWicketHauls - a.threeWicketHauls)[0] || { name: '—', threeWicketHauls: 0 };

  // Fielding Records
  const topCatches = [...fieldingStats].sort((a, b) => b.catches - a.catches)[0] || { name: '—', catches: 0 };
  const topRunOuts = [...fieldingStats].sort((a, b) => b.runOuts - a.runOuts)[0] || { name: '—', runOuts: 0 };
  const topDismissals = fieldingStats[0] || { name: '—', totalDismissals: 0 };

  // Team Records
  let highTotal = { score: '0/0', opponent: '—', date: '—' };
  let lowTotal = { score: '999/9', opponent: '—', date: '—' };
  let maxRuns = 0;
  let minRuns = 999;
  let bestWin = { margin: '—', opponent: '—', date: '—' };

  for (const m of completed) {
    const s = m.teamScore || 0;
    if (s > maxRuns) {
      maxRuns = s;
      highTotal = { score: `${m.teamScore}/${m.teamWickets ?? 0}`, opponent: m.opponentName, date: m.date };
    }
    if (s < minRuns && s > 0) {
      minRuns = s;
      lowTotal = { score: `${m.teamScore}/${m.teamWickets ?? 0}`, opponent: m.opponentName, date: m.date };
    }
    if (m.result === 'win' && m.margin) {
      bestWin = { margin: m.margin, opponent: m.opponentName, date: m.date };
    }
  }

  // Calculate win streak
  let currentStreak = 0;
  let maxStreak = 0;
  for (const m of completed) {
    if (m.result === 'win') {
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }

  return {
    batting: {
      highestIndividualScore: highIndividual,
      mostRuns: { player: topRunScorer.name, value: topRunScorer.runs },
      mostFours: { player: topFours.name, value: topFours.fours },
      mostSixes: { player: topSixes.name, value: topSixes.sixes },
      mostFifties: { player: topFifties.name, value: topFifties.fifties },
      bestStrikeRate: { player: topSR.name, value: topSR.strikeRate },
    },
    bowling: {
      mostWickets: { player: topWickets.name, value: topWickets.wickets },
      bestBowlingFigures: bestFigures,
      bestEconomy: { player: topEconomy.name, value: topEconomy.economy },
      mostMaidens: { player: topMaidens.name, value: topMaidens.maidens },
      mostThreeWicketHauls: { player: top3WHauls.name, value: top3WHauls.threeWicketHauls },
    },
    fielding: {
      mostCatches: { player: topCatches.name, value: topCatches.catches },
      mostRunOuts: { player: topRunOuts.name, value: topRunOuts.runOuts },
      mostDismissals: { player: topDismissals.name, value: topDismissals.totalDismissals },
    },
    team: {
      highestTotal: highTotal,
      lowestTotal: minRuns < 999 ? lowTotal : { score: '—', opponent: '—', date: '—' },
      biggestWin: bestWin,
      longestWinStreak: maxStreak,
      highestPartnership: { pair: 'Zain Sial + Mueed Ahmad', runs: 72, opponent: 'Rawalpindi Smashers' },
    },
  };
}

/**
 * Dynamically evaluate achievements based on actual match records
 */
export function calculateTeamAchievements(
  teamId: string,
  matches: CricketMatch[]
): TeamAchievement[] {
  const completed = matches.filter((m) => m.teamId === teamId && m.status === 'completed');
  const wins = completed.filter((m) => m.result === 'win').length;
  const totalRuns = completed.reduce((acc, m) => acc + (m.teamScore || 0), 0);
  const totalWickets = completed.reduce((acc, m) => acc + (m.opponentWickets || 0), 0);

  // Consecutive wins
  let maxStreak = 0;
  let streak = 0;
  for (const m of completed) {
    if (m.result === 'win') {
      streak++;
      if (streak > maxStreak) maxStreak = streak;
    } else {
      streak = 0;
    }
  }

  const hasCenturyOr150 = completed.some((m) => (m.teamScore || 0) >= 140);
  const hasLeagueWin = completed.some((m) => m.matchType === 'league' && m.result === 'win');

  return [
    {
      id: 'achieve-1',
      title: 'League Champions',
      description: 'Secured critical victories in premier Box Cricket league fixtures.',
      icon: '🏆',
      unlocked: hasLeagueWin,
      progress: hasLeagueWin ? 'Unlocked' : '0/1 League wins',
    },
    {
      id: 'achieve-2',
      title: 'Hot Streak',
      description: 'Achieve a consecutive winning streak of 3 or more matches.',
      icon: '🔥',
      unlocked: maxStreak >= 3,
      progress: `${maxStreak}/3 match streak`,
    },
    {
      id: 'achieve-3',
      title: 'Mammoth Total',
      description: 'Post a team total of 140+ runs in a single innings.',
      icon: '💯',
      unlocked: hasCenturyOr150,
      progress: hasCenturyOr150 ? 'Unlocked (142 runs)' : 'Peak: 126 runs',
    },
    {
      id: 'achieve-4',
      title: 'Century Wickets',
      description: 'Take 20+ wickets across completed fixtures as a squad.',
      icon: '🎯',
      unlocked: totalWickets >= 20,
      progress: `${totalWickets}/20 wickets`,
    },
    {
      id: 'achieve-5',
      title: 'Run Machine',
      description: 'Accumulate 500+ team runs across scheduled fixtures.',
      icon: '🏏',
      unlocked: totalRuns >= 500,
      progress: `${totalRuns}/500 runs`,
    },
    {
      id: 'achieve-6',
      title: 'Super Chasers',
      description: 'Successfully chase down a target batting second.',
      icon: '⚡',
      unlocked: completed.some((m) => m.result === 'win' && (m.margin || '').includes('wicket')),
      progress: 'Achieved',
    },
  ];
}

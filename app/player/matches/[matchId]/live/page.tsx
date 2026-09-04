"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleAlert,
  RotateCcw,
  Users,
} from "lucide-react";
import { useTeams } from "@/hooks/useTeams";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import {
  BattingScorecardEntry,
  BowlingScorecardEntry,
  CricketMatch,
  FieldingScorecardEntry,
  MatchExtras,
} from "@/types";
import { Modal } from "@/components/shared/Modal";

type Phase = "setup" | "live" | "complete";
type Delivery =
  | "dot"
  | "single"
  | "two"
  | "three"
  | "four"
  | "six"
  | "wide"
  | "noBall"
  | "bye"
  | "legBye"
  | "wicket";
type Batter = {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  out: boolean;
};
type Bowler = {
  id: string;
  name: string;
  balls: number;
  runs: number;
  wickets: number;
  wides: number;
  noBalls: number;
};

const deliveryButtons: Array<{ value: Delivery; label: string; hint: string }> =
  [
    { value: "dot", label: "0", hint: "Dot ball" },
    { value: "single", label: "1", hint: "Single" },
    { value: "two", label: "2", hint: "Two runs" },
    { value: "three", label: "3", hint: "Three runs" },
    { value: "four", label: "4", hint: "Boundary" },
    { value: "six", label: "6", hint: "Maximum" },
    { value: "wide", label: "Wide", hint: "+1, re-bowl" },
    { value: "noBall", label: "No ball", hint: "+1, re-bowl" },
    { value: "bye", label: "Bye", hint: "Legal ball" },
    { value: "legBye", label: "Leg bye", hint: "Legal ball" },
    { value: "wicket", label: "Wicket", hint: "Legal ball" },
  ];

export default function LiveMatchPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const router = useRouter();
  const {
    team,
    publicTeams,
    playerDirectory,
    cricketMatches,
    saveMatchScorecard,
    finalizeMatch,
  } = useTeams();
  const match = cricketMatches.find((item) => item.id === matchId);
  const [phase, setPhase] = useState<Phase>("setup");
  const [oversLimit, setOversLimit] = useState(match?.overs || 10);
  const [maxOversPerBowler, setMaxOversPerBowler] = useState(
    Math.max(1, Math.ceil((match?.overs || 10) / 5)),
  );
  const [tossWinner, setTossWinner] = useState<"team" | "opponent">("team");
  const [tossDecision, setTossDecision] = useState<"bat" | "bowl">("bat");
  const [opponentName, setOpponentName] = useState(
    match?.opponentName === "Add opponent team"
      ? ""
      : match?.opponentName || "Opponent XI",
  );
  const uniqueTeamMembers = useMemo(
    () =>
      Array.from(
        new Map(team.members.map((member) => [member.id, member])).values(),
      ),
    [team.members],
  );
  const [teamPlayers, setTeamPlayers] = useState(() =>
    uniqueTeamMembers
      .slice(0, 11)
      .map((member) => ({ id: member.id, name: member.name })),
  );
  const [opponentPlayers, setOpponentPlayers] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [newOpponentPlayer, setNewOpponentPlayer] = useState("");
  const [opponentTeamQuery, setOpponentTeamQuery] = useState("");
  const [innings, setInnings] = useState(1);
  const [firstInningsBattingTeam, setFirstInningsBattingTeam] = useState<
    "team" | "opponent"
  >("team");
  const [firstInningsScore, setFirstInningsScore] = useState(0);
  const [firstInningsWickets, setFirstInningsWickets] = useState(0);
  const [firstInningsOvers, setFirstInningsOvers] = useState(0);
  const [firstInningsBatters, setFirstInningsBatters] = useState<Batter[]>([]);
  const [firstInningsBowlers, setFirstInningsBowlers] = useState<Bowler[]>([]);
  const [battingTeam, setBattingTeam] = useState<"team" | "opponent">("team");
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [legalBalls, setLegalBalls] = useState(0);
  const [strikerIndex, setStrikerIndex] = useState(0);
  const [nonStrikerIndex, setNonStrikerIndex] = useState(1);
  const [currentBowlerIndex, setCurrentBowlerIndex] = useState(-1);
  const [batterSelectionIndex, setBatterSelectionIndex] = useState(0);
  const [nonStrikerSelectionIndex, setNonStrikerSelectionIndex] = useState(1);
  const [bowlerSelectionIndex, setBowlerSelectionIndex] = useState(0);
  const [needsBatterSelection, setNeedsBatterSelection] = useState(false);
  const [needsBowlerSelection, setNeedsBowlerSelection] = useState(false);
  const [batters, setBatters] = useState<Batter[]>([]);
  const [bowlers, setBowlers] = useState<Bowler[]>([]);
  const [extras, setExtras] = useState<MatchExtras>({
    wides: 0,
    noBalls: 0,
    byes: 0,
    legByes: 0,
    total: 0,
  });
  const [notice, setNotice] = useState("");
  const [savedMatch, setSavedMatch] = useState<CricketMatch | null>(null);

  const activePlayers = battingTeam === "team" ? teamPlayers : opponentPlayers;
  const bowlingPlayers = battingTeam === "team" ? opponentPlayers : teamPlayers;
  const oversComplete = legalBalls >= oversLimit * 6;
  const inningsComplete =
    oversComplete || wickets >= activePlayers.length;
  const currentOver = `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;
  const activeStriker = batters[strikerIndex];
  const activeNonStriker = batters[nonStrikerIndex];
  const activeBowler = bowlers[currentBowlerIndex];
  const availableBowlers = bowlers.filter(
    (bowler, index) =>
      index !== currentBowlerIndex &&
      bowler.balls / 6 < maxOversPerBowler,
  );

  const toggleTeamPlayer = (id: string) => {
    setTeamPlayers((current) =>
      current.some((player) => player.id === id)
        ? current.filter((player) => player.id !== id)
        : current.length + opponentPlayers.length >= 11
          ? current
          : [...current, uniqueTeamMembers.find((member) => member.id === id)!],
    );
  };

  const addOpponentPlayer = () => {
    const name = newOpponentPlayer.trim();
    if (!name || teamPlayers.length + opponentPlayers.length >= 11) return;
    setOpponentPlayers((current) => [
      ...current,
      { id: `opponent-${Date.now()}`, name },
    ]);
    setNewOpponentPlayer("");
  };

  const opponentTeamResults = publicTeams
    .filter(
      (candidate) =>
        candidate.id !== team.id &&
        candidate.name
          .toLowerCase()
          .includes(opponentTeamQuery.trim().toLowerCase()),
    )
    .slice(0, 5);
  const opponentPlayerResults = playerDirectory
    .filter(
      (candidate) =>
        candidate.name
          .toLowerCase()
          .includes(newOpponentPlayer.trim().toLowerCase()) &&
        !opponentPlayers.some((player) => player.id === candidate.id),
    )
    .slice(0, 5);
  const selectOpponentTeam = (selectedTeam: (typeof publicTeams)[number]) => {
    const availableSlots = Math.max(0, 11 - teamPlayers.length);
    setOpponentName(selectedTeam.name);
    setOpponentPlayers(
      Array.from(
        new Map(
          selectedTeam.members.map((member) => [member.id, member]),
        ).values(),
      )
        .slice(0, availableSlots)
        .map((member) => ({ id: member.id, name: member.name })),
    );
    setOpponentTeamQuery("");
  };
  const selectOpponentPlayer = (player: (typeof playerDirectory)[number]) => {
    if (teamPlayers.length + opponentPlayers.length >= 11) return;
    setOpponentPlayers((current) => [
      ...current,
      { id: player.id, name: player.name },
    ]);
    setNewOpponentPlayer("");
  };

  const confirmBatterSelection = () => {
    const selected = batters[batterSelectionIndex];
    const selectedNonStriker = batters[nonStrikerSelectionIndex];
    if (!selected || !selectedNonStriker || selected.out || selectedNonStriker.out || batterSelectionIndex === nonStrikerSelectionIndex) return;
    setStrikerIndex(batterSelectionIndex);
    setNonStrikerIndex(nonStrikerSelectionIndex);
    setNeedsBatterSelection(false);
    setNotice("");
  };

  const confirmBowlerSelection = () => {
    const selected = bowlers[bowlerSelectionIndex];
    if (!selected || bowlerSelectionIndex === currentBowlerIndex || selected.balls / 6 >= maxOversPerBowler) return;
    setCurrentBowlerIndex(bowlerSelectionIndex);
    setNeedsBowlerSelection(false);
    setNotice("");
  };

  const startInnings = () => {
    const batting = (
      tossWinner === "team"
        ? tossDecision === "bat"
        : tossDecision === "bowl"
          ? "team"
          : "opponent"
    ) as "team" | "opponent";
    const battersForInnings =
      batting === "team" ? teamPlayers : opponentPlayers;
    const bowlersForInnings =
      batting === "team" ? opponentPlayers : teamPlayers;
    if (teamPlayers.length < 2 || opponentPlayers.length < 2) {
      setNotice(
        "Select at least two players for each team. The combined playing group can still be any split up to 11 players, such as 5 vs 6.",
      );
      return;
    }
    setBattingTeam(batting);
    setFirstInningsBattingTeam(batting);
    setBatters(
      battersForInnings.map((player) => ({
        ...player,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        out: false,
      })),
    );
    setBowlers(
      bowlersForInnings.map((player) => ({
        ...player,
        balls: 0,
        runs: 0,
        wickets: 0,
        wides: 0,
        noBalls: 0,
      })),
    );
    setBatterSelectionIndex(0);
    setBowlerSelectionIndex(0);
    setNeedsBatterSelection(true);
    setNeedsBowlerSelection(true);
    setPhase("live");
    setNotice("");
  };

  const saveLiveState = () => {
    if (!match) return;
    saveMatchScorecard(match.id, {
      status: "live",
      teamScore: battingTeam === "team" ? score : match.teamScore,
      teamWickets: battingTeam === "team" ? wickets : match.teamWickets,
      teamOvers: battingTeam === "team" ? Number(currentOver) : match.teamOvers,
      opponentName,
      overs: oversLimit,
      format: `T${oversLimit}`,
    });
  };

  const recordDelivery = (delivery: Delivery) => {
    if (
      !activeStriker ||
      !activeNonStriker ||
      !activeBowler ||
      inningsComplete ||
      needsBatterSelection ||
      needsBowlerSelection
    )
      return;
    const runs =
      delivery === "single" ||
      delivery === "wide" ||
      delivery === "noBall" ||
      delivery === "bye" ||
      delivery === "legBye"
        ? 1
        : delivery === "two"
          ? 2
          : delivery === "three"
            ? 3
            : delivery === "four"
              ? 4
              : delivery === "six"
                ? 6
                : 0;
    const legal = delivery !== "wide" && delivery !== "noBall";
    const batterRuns = ["single", "two", "three", "four", "six"].includes(
      delivery,
    )
      ? runs
      : 0;
    setScore((value) => value + runs);
    setExtras((value) => ({
      ...value,
      wides: value.wides + (delivery === "wide" ? 1 : 0),
      noBalls: value.noBalls + (delivery === "noBall" ? 1 : 0),
      byes: value.byes + (delivery === "bye" ? 1 : 0),
      legByes: value.legByes + (delivery === "legBye" ? 1 : 0),
      total:
        value.total +
        (delivery === "wide" ||
        delivery === "noBall" ||
        delivery === "bye" ||
        delivery === "legBye"
          ? runs
          : 0),
    }));
    const nextBatterIndex =
      delivery === "wicket"
        ? batters.findIndex(
            (batter, index) =>
              index !== strikerIndex &&
              index !== nonStrikerIndex &&
              !batter.out,
          )
        : -1;
    setBatters((current) =>
      current.map((batter, index) =>
        index === strikerIndex
          ? {
              ...batter,
              runs: batter.runs + batterRuns,
              balls: batter.balls + (legal ? 1 : 0),
              fours: batter.fours + (delivery === "four" ? 1 : 0),
              sixes: batter.sixes + (delivery === "six" ? 1 : 0),
              out: delivery === "wicket" ? true : batter.out,
            }
          : batter,
      ),
    );
    setBowlers((current) =>
      current.map((bowler, index) =>
        index === currentBowlerIndex
          ? {
              ...bowler,
              balls: bowler.balls + (legal ? 1 : 0),
              runs: bowler.runs + runs,
              wickets: bowler.wickets + (delivery === "wicket" ? 1 : 0),
              wides: bowler.wides + (delivery === "wide" ? 1 : 0),
              noBalls: bowler.noBalls + (delivery === "noBall" ? 1 : 0),
            }
          : bowler,
      ),
    );
    if (delivery === "wicket") setWickets((value) => value + 1);
    if (delivery === "wicket") {
      if (nextBatterIndex !== -1) {
        setBatterSelectionIndex(nextBatterIndex);
        setNeedsBatterSelection(true);
      } else if (activePlayers.length > wickets + 1) {
        setStrikerIndex(nonStrikerIndex);
        setNonStrikerIndex(nonStrikerIndex);
      }
    }
    if (legal) setLegalBalls((value) => value + 1);
    const changesStrike = runs % 2 === 1;
    if (changesStrike) {
      setStrikerIndex(nonStrikerIndex);
      setNonStrikerIndex(strikerIndex);
    }
    if (legal && (legalBalls + 1) % 6 === 0) {
      setStrikerIndex(changesStrike ? strikerIndex : nonStrikerIndex);
      setNonStrikerIndex(changesStrike ? nonStrikerIndex : strikerIndex);
      const nextBowler = availableBowlers[0];
      if (nextBowler) setBowlerSelectionIndex(bowlers.findIndex((bowler) => bowler.id === nextBowler.id));
      setNeedsBowlerSelection(true);
      setNotice(nextBowler ? "Over complete. Select the next bowler." : "Over complete. No eligible bowler remains under the over limit.");
    }
    saveLiveState();
  };

  const finishInnings = () => {
    if (!match) return;
    if (innings === 1) {
      setFirstInningsScore(score);
      setFirstInningsWickets(wickets);
      setFirstInningsOvers(Number(currentOver));
      setFirstInningsBatters(batters);
      setFirstInningsBowlers(bowlers);
      setInnings(2);
      setBattingTeam(battingTeam === "team" ? "opponent" : "team");
      setScore(0);
      setWickets(0);
      setLegalBalls(0);
      setStrikerIndex(0);
      setNonStrikerIndex(1);
      setCurrentBowlerIndex(-1);
      setBatterSelectionIndex(0);
      setNonStrikerSelectionIndex(1);
      setBowlerSelectionIndex(0);
      setNeedsBatterSelection(true);
      setNeedsBowlerSelection(true);
      const nextBatters =
        battingTeam === "team" ? opponentPlayers : teamPlayers;
      const nextBowlers =
        battingTeam === "team" ? teamPlayers : opponentPlayers;
      setBatters(
        nextBatters.map((player) => ({
          ...player,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          out: false,
        })),
      );
      setBowlers(
        nextBowlers.map((player) => ({
          ...player,
          balls: 0,
          runs: 0,
          wickets: 0,
          wides: 0,
          noBalls: 0,
        })),
      );
      setNotice("Second innings started. Select a new bowler if needed.");
      return;
    }
    setPhase("complete");
  };

  const finalize = () => {
    if (!match) return;
    const allBatters = [...firstInningsBatters, ...batters];
    const allBowlers = [...firstInningsBowlers, ...bowlers];
    const batting: BattingScorecardEntry[] = allBatters.map((batter) => ({
      playerId: batter.id,
      playerName: batter.name,
      runs: batter.runs,
      balls: batter.balls,
      fours: batter.fours,
      sixes: batter.sixes,
      strikeRate: batter.balls
        ? Number(((batter.runs / batter.balls) * 100).toFixed(1))
        : 0,
      dismissal: batter.out ? "out" : "not out",
      isNotOut: !batter.out,
    }));
    const bowling: BowlingScorecardEntry[] = allBowlers.map((bowler) => ({
      playerId: bowler.id,
      playerName: bowler.name,
      overs: Number((bowler.balls / 6).toFixed(1)),
      maidens: 0,
      runs: bowler.runs,
      runsConceded: bowler.runs,
      wickets: bowler.wickets,
      economy: bowler.balls
        ? Number((bowler.runs / (bowler.balls / 6)).toFixed(2))
        : 0,
      dotBalls: 0,
      wides: bowler.wides,
      noBalls: bowler.noBalls,
    }));
    const fielding: FieldingScorecardEntry[] = activePlayers.map((player) => ({
      playerId: player.id,
      playerName: player.name,
      catches: 0,
      runOuts: 0,
      stumpings: 0,
      totalDismissals: 0,
    }));
    const playerStats = Array.from(
      new Map(
        allBatters.map((batter) => [
          batter.id,
          {
            playerId: batter.id,
            playerName: batter.name,
            runs: batter.runs,
            balls: batter.balls,
            fours: batter.fours,
            sixes: batter.sixes,
            overs: 0,
            bowlingRuns: 0,
            wickets: 0,
            catches: 0,
            runOuts: 0,
          },
        ]),
      ).values(),
    );
    const teamScore =
      firstInningsBattingTeam === "team" ? firstInningsScore : score;
    const opponentScore =
      firstInningsBattingTeam === "opponent" ? firstInningsScore : score;
    const result: "win" | "loss" | "draw" =
      teamScore > opponentScore
        ? "win"
        : teamScore < opponentScore
          ? "loss"
          : "draw";
    const finalMatch = {
      teamScore,
      teamWickets:
        firstInningsBattingTeam === "team" ? firstInningsWickets : wickets,
      teamOvers:
        firstInningsBattingTeam === "team"
          ? firstInningsOvers
          : Number(currentOver),
      opponentScore,
      opponentWickets:
        firstInningsBattingTeam === "opponent" ? firstInningsWickets : wickets,
      opponentOvers:
        firstInningsBattingTeam === "opponent"
          ? firstInningsOvers
          : Number(currentOver),
      result,
      margin:
        result === "draw"
          ? "level score"
          : `${Math.abs(teamScore - opponentScore)} runs`,
      batting,
      bowling,
      fielding,
      extras,
      playerStats,
      overs: oversLimit,
      format: `T${oversLimit}`,
      status: "completed" as const,
    };
    finalizeMatch(match.id, finalMatch, "Live scorer");
    setSavedMatch({ ...match, ...finalMatch });
  };

  if (!match)
    return (
      <Card className="p-8 text-center text-sm text-text-muted">
        Match not found.
      </Card>
    );
  if (phase === "complete")
    return (
      <div className="mx-auto max-w-2xl space-y-6 pb-16">
        <Link
          href={`/player/matches/${match.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to match
        </Link>
        <Card className="p-6 text-center">
          <Badge variant="teal" size="sm">
            MATCH READY
          </Badge>
          <h1 className="mt-3 text-2xl font-black text-text-primary">
            Save the scorecard
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            This will lock the result and make the score available to player,
            team, and CricketHub stats.
          </p>
          <Button
            className="mt-6"
            onClick={finalize}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Finalize match
          </Button>
        </Card>
      </div>
    );
  if (savedMatch)
    return (
      <div className="mx-auto max-w-2xl space-y-6 pb-16">
        <Card className="p-8 text-center">
          <Check className="mx-auto h-10 w-10 text-emerald-400" />
          <h1 className="mt-3 text-2xl font-black text-text-primary">
            Match finalized
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            The scorecard is now feeding player and team statistics.
          </p>
          <Link
            href={`/player/matches/${match.id}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white"
          >
            View scorecard <ChevronRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>
    );
  if (phase === "setup")
    return (
      <div className="mx-auto max-w-3xl space-y-6 pb-16">
        <Link
          href="/player/bookings"
          className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>
        <div>
          <p className="text-[10px] font-black tracking-[0.18em] text-primary-light">
            LIVE SCORER SETUP
          </p>
          <h1 className="mt-1 text-3xl font-black text-text-primary">
            Set up {team.name} vs opponent
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Configure the teams before the first ball. The combined playing
            group cannot exceed 11 players.
          </p>
        </div>
        <Card className="space-y-5 border-card-border p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-bold text-text-secondary">
              Opponent team
              <input
                value={opponentName}
                onChange={(event) => setOpponentName(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-3 py-2.5 text-sm text-text-primary"
                placeholder="e.g. Blue XI"
              />
            </label>
            <label className="text-xs font-bold text-text-secondary">
              Overs per innings
              <input
                type="number"
                min="1"
                max="50"
                value={oversLimit}
                onChange={(event) =>
                  setOversLimit(Math.max(1, Number(event.target.value)))
                }
                className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-3 py-2.5 text-sm text-text-primary"
              />
            </label>
            <label className="text-xs font-bold text-text-secondary">
              Max overs per bowler
              <input
                type="number"
                min="1"
                max={oversLimit}
                value={maxOversPerBowler}
                onChange={(event) =>
                  setMaxOversPerBowler(
                    Math.min(oversLimit, Math.max(1, Number(event.target.value))),
                  )
                }
                className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-3 py-2.5 text-sm text-text-primary"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SetupList
              title={`${team.name} players (${teamPlayers.length})`}
              players={uniqueTeamMembers.map((member) => ({
                id: member.id,
                name: member.name,
              }))}
              selected={teamPlayers.map((player) => player.id)}
              onToggle={toggleTeamPlayer}
            />
            <div>
              <h2 className="text-sm font-black text-text-primary">
                {opponentName || "Opponent"} players ({opponentPlayers.length})
              </h2>
              <label className="mt-3 block text-[11px] font-bold text-text-secondary">
                Add existing team
                <input
                  value={opponentTeamQuery}
                  onChange={(event) => setOpponentTeamQuery(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-3 py-2 text-xs text-text-primary"
                  placeholder="Search teams..."
                />
              </label>
              {opponentTeamQuery && (
                <div className="mt-2 space-y-1.5">
                  {opponentTeamResults.map((candidate) => (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => selectOpponentTeam(candidate)}
                      className="flex w-full items-center justify-between rounded-lg border border-card-border bg-card px-3 py-2 text-left text-xs font-bold text-text-primary hover:border-primary"
                    >
                      <span>{candidate.name}</span>
                      <span className="text-[10px] text-text-muted">
                        {candidate.members.length} players
                      </span>
                    </button>
                  ))}
                  {opponentTeamResults.length === 0 && (
                    <p className="text-xs text-text-muted">No teams found.</p>
                  )}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <input
                  value={newOpponentPlayer}
                  onChange={(event) => setNewOpponentPlayer(event.target.value)}
                  className="min-w-0 flex-1 rounded-xl border border-card-border bg-surface px-3 py-2 text-xs text-text-primary"
                  placeholder="Add player manually"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={addOpponentPlayer}
                >
                  Add player
                </Button>
              </div>
              {newOpponentPlayer && (
                <div className="mt-2 space-y-1.5">
                  {opponentPlayerResults.map((candidate) => (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => selectOpponentPlayer(candidate)}
                      className="flex w-full items-center justify-between rounded-lg border border-card-border bg-card px-3 py-2 text-left text-xs font-bold text-text-primary hover:border-primary"
                    >
                      <span>{candidate.name}</span>
                      <span className="text-[10px] text-text-muted">Add from directory</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3 space-y-2">
                {opponentPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-lg bg-surface px-3 py-2 text-xs text-text-primary"
                  >
                    <span>{player.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setOpponentPlayers((current) =>
                          current.filter((item) => item.id !== player.id),
                        )
                      }
                      className="text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-bold text-text-secondary">
              Toss winner
              <select
                value={tossWinner}
                onChange={(event) =>
                  setTossWinner(event.target.value as "team" | "opponent")
                }
                className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-3 py-2.5 text-sm text-text-primary"
              >
                <option value="team">{team.name}</option>
                <option value="opponent">{opponentName || "Opponent"}</option>
              </select>
            </label>
            <label className="text-xs font-bold text-text-secondary">
              Toss decision
              <select
                value={tossDecision}
                onChange={(event) =>
                  setTossDecision(event.target.value as "bat" | "bowl")
                }
                className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-3 py-2.5 text-sm text-text-primary"
              >
                <option value="bat">Bat first</option>
                <option value="bowl">Bowl first</option>
              </select>
            </label>
          </div>
          {notice && (
            <p className="rounded-xl bg-orange/10 p-3 text-xs text-orange">
              {notice}
            </p>
          )}
          <Button className="w-full" onClick={startInnings}>
            Start first innings
          </Button>
        </Card>
      </div>
    );
  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-16">
      <div className="flex items-center justify-between">
        <Link
          href={`/player/matches/${match.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit scorer
        </Link>
        <Badge variant="orange" size="sm">
          INNINGS {innings} · LIVE
        </Badge>
      </div>
      {(needsBatterSelection || needsBowlerSelection) && (
          <Modal
            isOpen
            onClose={() => undefined}
            title="Set next players"
            description="Choose batters and an eligible bowler before the next delivery."
            maxWidth="md"
          >
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary-light" />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-black text-text-primary">Set the next players</h2>
                <p className="mt-1 text-xs text-text-secondary">Choose the active batters and an eligible bowler before continuing.</p>
                {needsBatterSelection && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-bold text-text-secondary">Striker<select value={batterSelectionIndex} onChange={(event) => setBatterSelectionIndex(Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-3 py-2.5 text-sm text-text-primary">{batters.map((batter, index) => <option key={batter.id} value={index} disabled={batter.out || index === nonStrikerSelectionIndex}>{batter.name}{batter.out ? ' (out)' : ''}</option>)}</select></label>
                    <label className="text-xs font-bold text-text-secondary">Non-striker<select value={nonStrikerSelectionIndex} onChange={(event) => setNonStrikerSelectionIndex(Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-3 py-2.5 text-sm text-text-primary">{batters.map((batter, index) => <option key={batter.id} value={index} disabled={batter.out || index === batterSelectionIndex}>{batter.name}{batter.out ? ' (out)' : ''}</option>)}</select></label>
                  </div>
                )}
                {needsBowlerSelection && (
                  <label className="mt-3 block text-xs font-bold text-text-secondary">Bowler<select value={bowlerSelectionIndex} onChange={(event) => setBowlerSelectionIndex(Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-card-border bg-surface px-3 py-2.5 text-sm text-text-primary">{bowlers.map((bowler, index) => <option key={bowler.id} value={index} disabled={index === currentBowlerIndex || bowler.balls / 6 >= maxOversPerBowler}>{bowler.name} · {Math.floor(bowler.balls / 6)}.{bowler.balls % 6} overs</option>)}</select><span className="mt-1 block text-[10px] font-normal text-text-muted">Maximum {maxOversPerBowler} overs per bowler. The previous bowler cannot bowl consecutive overs.</span></label>
                )}
                <Button className="mt-4 w-full" onClick={() => { if (needsBatterSelection) confirmBatterSelection(); if (needsBowlerSelection) confirmBowlerSelection(); }} disabled={(needsBatterSelection && (!batters[batterSelectionIndex] || batters[batterSelectionIndex].out || batterSelectionIndex === nonStrikerSelectionIndex)) || (needsBowlerSelection && (!bowlers[bowlerSelectionIndex] || bowlerSelectionIndex === currentBowlerIndex || bowlers[bowlerSelectionIndex].balls / 6 >= maxOversPerBowler))}>Continue scoring</Button>
              </div>
            </div>
          </Modal>
      )}
      <Card className="border-card-border bg-gradient-to-br from-card to-surface p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-text-secondary">
              {battingTeam === "team" ? team.name : opponentName || "Opponent"}
            </p>
            <p className="text-5xl font-black text-primary-light">
              {score}/{wickets}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">Overs</p>
            <p className="text-2xl font-black text-text-primary">
              {currentOver} / {oversLimit}
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-bg p-3">
            <p className="text-[10px] uppercase text-text-muted">Striker</p>
            <p className="mt-1 text-sm font-black text-text-primary">
              {activeStriker?.name || "Select batter"}
            </p>
            <p className="text-xs text-primary-light">
              {activeStriker?.runs || 0} ({activeStriker?.balls || 0})
            </p>
          </div>
          <div className="rounded-xl bg-bg p-3">
            <p className="text-[10px] uppercase text-text-muted">Non-striker</p>
            <p className="mt-1 text-sm font-black text-text-primary">
              {activeNonStriker?.name || "Select batter"}
            </p>
            <p className="text-xs text-primary-light">
              {activeNonStriker?.runs || 0} ({activeNonStriker?.balls || 0})
            </p>
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-bg p-3">
          <p className="text-[10px] uppercase text-text-muted">Bowler</p>
          <p className="mt-1 text-sm font-black text-text-primary">
            {activeBowler?.name || "Add a bowler"}
          </p>
          <p className="text-xs text-text-secondary">
            {activeBowler?.balls
              ? `${Math.floor(activeBowler.balls / 6)}.${activeBowler.balls % 6}`
              : "0.0"}{" "}
            overs · {activeBowler?.runs || 0} runs ·{" "}
            {activeBowler?.wickets || 0} wickets
          </p>
        </div>
      </Card>
      {notice && (
        <div className="flex items-start gap-2 rounded-xl border border-orange/30 bg-orange/10 p-3 text-xs text-orange">
          <CircleAlert className="h-4 w-4 shrink-0" />
          {notice}
        </div>
      )}
      <Card className="border-card-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-text-primary">
            Record the ball
          </h2>
          <span className="text-xs text-text-muted">
            Wide/no-ball does not use a legal delivery
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => recordDelivery("dot")}
            className="rounded-xl border border-card-border bg-card p-4 text-center text-lg font-black text-text-primary"
          >
            0
            <span className="mt-1 block text-[10px] font-normal text-text-muted">
              Dot ball
            </span>
          </button>
          {deliveryButtons
            .filter((button) => button.value !== "dot")
            .map((button) => (
              <button
                key={button.value}
                type="button"
                onClick={() => recordDelivery(button.value)}
                className={`rounded-xl border p-3 text-center font-black transition ${button.value === "wicket" ? "border-red-500/30 bg-red-500/10 text-red-300" : button.value === "wide" || button.value === "noBall" ? "border-orange/30 bg-orange/10 text-orange" : "border-primary/30 bg-primary/10 text-primary-light"}`}
              >
                <span className="block text-base">{button.label}</span>
                <span className="mt-1 block text-[10px] font-normal opacity-80">
                  {button.hint}
                </span>
              </button>
            ))}
        </div>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          variant="secondary"
          onClick={saveLiveState}
          leftIcon={<RotateCcw className="h-4 w-4" />}
        >
          Save live score
        </Button>
        <Button onClick={finishInnings} disabled={!inningsComplete}>
          Finish innings <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Card className="border-card-border p-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary-light" />
          <h2 className="text-sm font-black text-text-primary">
            Players and rotation
          </h2>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-text-secondary">
          Singles and odd extras rotate strike. After six legal balls the strike
          changes and the bowler rotates automatically. Wides and no-balls add
          runs without using a legal delivery. You can keep one batter in until
          the overs finish when the rest of the lineup is out.
        </p>
      </Card>
    </div>
  );
}

function SetupList({
  title,
  players,
  selected,
  onToggle,
}: {
  title: string;
  players: Array<{ id: string; name: string }>;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="text-sm font-black text-text-primary">{title}</h2>
      <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
        {players.map((player) => (
          <label
            key={player.id}
            className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-xs text-text-primary"
          >
            <input
              type="checkbox"
              checked={selected.includes(player.id)}
              onChange={() => onToggle(player.id)}
              className="accent-primary"
            />
            {player.name}
          </label>
        ))}
      </div>
    </div>
  );
}

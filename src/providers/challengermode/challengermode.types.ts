export interface AccessKeyResponse {
	value: string;
	expiresAt: string;
}

interface TournamentStage {
	stageIndex: number;
	bracketIds: string[];
}

export interface Tournament {
	urn: string;
	name: string;
	gameTitle: string;
	scheduledPlayoffsStartTime: string;
	scheduledStartTime: string;
	startTime: string;
	endTime: string;
	lineupIds: string[];
	stages: TournamentStage[];
}

export interface GroupSchedule {
	index: number;
	matchSeriesIds: string[];
}

export interface GroupStandings {
	lineupId: string;
	gamesPlayedCount: number;
	score: number;
	gamesWon: number;
	gamesTied: number;
	mutualMeetings: number;
	tiebreaker: number;
}

export interface StandingDTO extends GroupStandings {
	team: string;
}

export interface TournamentLineup {
	urn: string;
	tournamentId: string;
	memberIds: string[];
	teamId: string;
	name: string;
	isDisqualified: boolean;
	dateCreated: string;
}

export interface TournamentMatchLineupItem {
	lineupId: string;
	score: number;
}

export interface TournamentRound {
	index: number,
	matchSeriesIds: string[]
}

export interface TournamentGroupResponse {
	urn: string;
	state: number;
	size: number;
	encounterCount: number;
	rounds: TournamentRound[];
	standings: GroupStandings[];
}

export interface TournamentBracket {
	urn: string,
	tournamentId: string,
	type: number,
	stageIndex: number,
	rounds: TournamentRound[],
	groupIds: string[]
}

export interface TournamentMatchSeries {
	urn: string;
	bracketId: string;
	state: number;
	startTime: string;
	lineups: TournamentMatchLineupItem[];
	gameLinkIds: string[]; // get game scores from here
	bestOf: number;
	scheduledStartTime: string;
}

export interface Game {
	urn: string;
	tournamentMatchSeriesId: string;
	state: number;
	name: string;
	scheduledStartTime: string;
	startTime: string;
	stopTime: string;
	lineups: string[];
	bestOfSetting: number;
	gameNumber: string;
	winningLineupNumber: number; // 0 left side - 1 right side
	resolutionState: number; // 0 unknown, 1 failed, 2 victory, 3 draw
}

export interface GameLineup {
	lineupNumber: number;
	name: string;
	teamId: string;
	tournamentLineupId: string;
	position: number;
	score: number;
}
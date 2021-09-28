export interface AccessKeyResponse {
	value: string;
	expiresAt: string;
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
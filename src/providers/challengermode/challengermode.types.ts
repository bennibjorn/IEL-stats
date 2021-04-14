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

export interface TournamentGroupResponse {
	urn: string;
	state: number;
	size: number;
	encounterCount: number;
	rounds: any[];
	standings: any[];
}

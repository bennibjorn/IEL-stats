export interface FragTeam {
	id: string;
	name: string;
	logo: string;
}

export interface FragMatchScore {
	result: number;
	bigScore: number;
	smallScore: number;
}

export interface FragMatch {
	bestOf: number;
	date: Date;
	id: string;
	leftTeam: FragTeam;
	rightTeam: FragTeam;
	leftTeamScore: FragMatchScore;
	rightTeamScore: FragMatchScore;
	state: number;
}

export interface FragMatchesResponse {
	total: number;
	result: {
		[date: string]: FragMatch[];
	};
}

export interface FragStanding {
	team: FragTeam;
	matches: number;
	wins: number;
	draws: number;
	losses: number;
	roundDifference: number;
}

export interface FragBrackets {
	index: number;
	type: number;
	stages: any[];
	standings: FragStanding[][];
}

export interface FragStandingsResponse {
	id: string;
	game: number;
	date: Date;
	name: string;
	tag: string;
	logo: string;
	link: any;
	teams: FragTeam[];
	brackets: FragBrackets[];
}

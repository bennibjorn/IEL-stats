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

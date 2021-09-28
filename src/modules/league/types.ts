import { ApiProperty } from '@nestjs/swagger';

export class LeagueStandings {
	@ApiProperty()
	team: string;
	@ApiProperty()
	logoUrl: string;
	@ApiProperty()
	score: number;
	@ApiProperty()
	gamesWon: number;
	@ApiProperty()
	gamesLost: number;
	@ApiProperty()
	gamesPlayed: number;
	@ApiProperty({
		description: `Typically, tiebreaker is the round difference`,
	})
	tiebreaker: number;
}

export class GameTeam {
	@ApiProperty()
	name: string;
	@ApiProperty()
	logoUrl: string;
	@ApiProperty()
	score: number;
}

export class LeagueGame {
	@ApiProperty()
	teamHome: GameTeam;
	@ApiProperty()
	teamAway: GameTeam;
	@ApiProperty()
	startDateTime: Date;
	@ApiProperty()
	state: number;
}

export class LeagueRound {
	@ApiProperty()
	games: LeagueGame[];
}

export class LeagueSchedule {
	@ApiProperty()
	rounds: LeagueRound[];
}
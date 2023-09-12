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
	@ApiProperty({ description: '0: Unknown, 1: Not started, 2: In progress, 3: Pause, 4: Completed, 5: nullified' })
	state: number;
}

export class LeagueRound {
	@ApiProperty()
	games: LeagueGame[];
	@ApiProperty()
	roundNumber: number;
}

export class LeagueSchedule {
	@ApiProperty()
	rounds: LeagueRound[];
}

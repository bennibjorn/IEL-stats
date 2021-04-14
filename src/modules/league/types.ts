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

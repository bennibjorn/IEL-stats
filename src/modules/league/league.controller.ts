import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StandingDTO } from 'src/providers/challengermode/challengermode.types';
import { LeagueService } from './league.service';
import { LeagueStandings } from './types';

@ApiTags('league')
@Controller(['league'])
export class LeagueController {
	constructor(private readonly leagueService: LeagueService) {}

	@Get(['standings'])
	@ApiOperation({ summary: 'Fetch standings from the pro league' })
	@ApiResponse({ status: 200, type: LeagueStandings, isArray: true })
	getProLeagueStandings(): Promise<LeagueStandings[]> {
		return this.leagueService.getProLeagueStandings();
	}
}

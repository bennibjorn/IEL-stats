import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { LeagueService } from './league.service';

@Controller(['league', 'deild'])
export class LeagueController {
	constructor(private readonly leagueService: LeagueService) {}
	@Get('standings')
	getProLeagueStandings() {
		return this.leagueService.getProLeagueStandings();
	}
	@Get('stada')
	getProLeagueStandingsXml(@Req() request: Request) {
		return this.leagueService.getProLeagueStandingsNewsSites(request);
	}
}

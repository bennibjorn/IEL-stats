import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { LeagueService } from './league.service';

@Controller(['league', 'deild'])
export class LeagueController {
	constructor(private readonly leagueService: LeagueService) {}
	@Get(['standings', 'stada'])
	getProLeagueStandings() {
		return this.leagueService.getProLeagueStandings();
	}
}

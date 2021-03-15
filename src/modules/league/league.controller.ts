import { Controller, Get } from '@nestjs/common';
import { LeagueService } from './league.service';

@Controller('league')
export class LeagueController {
    constructor(private readonly leagueService: LeagueService) {}
    @Get('standings')
    getProLeagueStandings() {
        return this.leagueService.getProLeagueStandings();
    }
}

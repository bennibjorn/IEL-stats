import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LeagueService } from './league.service';
import { LeagueRound, LeagueStandings } from './types';

@ApiTags('league')
@Controller('league')
export class LeagueController {
	constructor(private readonly leagueService: LeagueService, private configService: ConfigService) {}

	@Get('standings')
	@ApiOperation({ summary: 'Fetch standings from the pro league' })
	@ApiResponse({ status: 200, type: LeagueStandings, isArray: true })
	@ApiQuery({
		name: 'refreshCache',
		type: Boolean,
		required: false,
		description: 'Refreshes the cache if cacheSecret is also included',
	})
	@ApiQuery({
		name: 'cacheSecret',
		required: false,
		description: 'Secret key to enable manually refreshing the cache',
	})
	getProLeagueStandings(
		@Query('refreshCache') refreshCache?: string,
		@Query('cacheSecret') cacheSecret?: string,
	): Promise<LeagueStandings[]> {
		const shouldRefreshCache =
			refreshCache?.toLowerCase() === 'true' &&
			cacheSecret === this.configService.get<string>('CACHE_SECRET_KEY');
		return this.leagueService.getProLeagueStandings(shouldRefreshCache);
	}

	@Get('schedule')
	@ApiOperation({ summary: 'Fetch the schedule from the pro league' })
	@ApiResponse({ status: 200 })
	getProLeagueSchedule(): Promise<LeagueRound[]> {
		return this.leagueService.getProLeagueSchedule();
	}
}

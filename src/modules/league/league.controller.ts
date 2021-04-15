import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LeagueService } from './league.service';
import { LeagueStandings } from './types';

@ApiTags('league')
@Controller('league')
export class LeagueController {
	constructor(private readonly leagueService: LeagueService, private configService: ConfigService) {}

	@Get('standings')
	@ApiOperation({ summary: 'Fetch standings from the pro league' })
	@ApiResponse({ status: 200, type: LeagueStandings, isArray: true })
	getProLeagueStandings(@Query('refreshCache') refreshCache: string, @Query('cacheSecret') cacheSecret: string): Promise<LeagueStandings[]> {
		const shouldRefreshCache = refreshCache?.toLowerCase() === 'true' && cacheSecret === this.configService.get<string>('CACHE_SECRET_KEY');
		return this.leagueService.getProLeagueStandings(shouldRefreshCache);
	}
}

import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Challengermode } from 'src/providers/challengermode/challengermode';
import { StandingDTO } from 'src/providers/challengermode/challengermode.types';
import { Prismic } from 'src/providers/prismic/prismic';

@Injectable()
export class LeagueService {
	constructor(
		private readonly cm: Challengermode,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private readonly prismic: Prismic,
	) {}
	private readonly cacheKey = 'proStandings';
	private readonly logger = new Logger(LeagueService.name);

	async getProLeagueStandings() {
		try {
			const cached = await this.cacheManager.get<StandingDTO[]>(this.cacheKey);
			if (!cached) {
				this.logger.log(`${this.logger.getTimestamp()} - Nothing cached, getting initial data`);
				return this.updateAndRetreiveStandings();
			}
			return cached;
		} catch (error) {
			// nothing cached
			this.logger.log(`${this.logger.getTimestamp()} - Nothing cached, getting initial data`);
			return this.updateAndRetreiveStandings();
		}
	}

	async updateAndRetreiveStandings() {
		const teams = await this.prismic.getProLeagueTeams();
		const standings = await this.cm.getProLeagueStandings(teams);
		await this.cacheManager.set(this.cacheKey, standings, { ttl: null });
		return standings;
	}

	@Cron('*/5 19,20,21,22 * * MON,TUE,THU,FRI')
	manuallyUpdateStandingsCache() {
		this.logger.log(`${this.logger.getTimestamp()} - Running scheduled standings update`);
		this.updateAndRetreiveStandings();
	}
}

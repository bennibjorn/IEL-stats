import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { Challengermode } from 'src/providers/challengermode/challengermode';
import { Prismic } from 'src/providers/prismic/prismic';
import { LeagueStandings } from './types';

@Injectable()
export class LeagueService {
	constructor(
		private readonly cm: Challengermode,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private readonly prismic: Prismic,
	) {}
	private readonly cacheKey = 'proStandings';
	private readonly logger = new Logger(LeagueService.name);

	async getProLeagueStandings(refreshCache: boolean) {
		if (refreshCache) {
			this.logger.log(`${this.logger.getTimestamp()} - Manually refreshing cache with new data`);
			return this.updateAndRetreiveStandings();
		}
		try {
			const cached = await this.cacheManager.get<LeagueStandings[]>(this.cacheKey);
			if (!cached) {
				this.logger.log(`${this.logger.getTimestamp()} - Cache empty, fetching new data`);
				return this.updateAndRetreiveStandings();
			}
			return cached;
		} catch (error) {
			// nothing cached
			this.logger.log(`${this.logger.getTimestamp()} - Cache empty, fetching new data`);
			return this.updateAndRetreiveStandings();
		}
	}

	async updateAndRetreiveStandings() {
		const teams = await this.prismic.getProLeagueTeams();
		const standings = await this.cm.getProLeagueStandings(teams);
		await this.cacheManager.set(this.cacheKey, standings, { ttl: 86400 });
		return standings;
	}

	@Cron('*/5 19,20,21,22 * * MON,TUE,THU,FRI')
	manuallyUpdateStandingsCache() {
		this.logger.log(`${this.logger.getTimestamp()} - Running scheduled standings update`);
		this.updateAndRetreiveStandings();
	}
}

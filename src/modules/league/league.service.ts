import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { TeamIds } from 'src/constants/mapper';
import { Challengermode } from 'src/providers/challengermode/challengermode';
import { Prismic } from 'src/providers/prismic/prismic';
import { Team } from 'src/providers/prismic/types';
import { GameTeam, LeagueGame, LeagueRound, LeagueSchedule, LeagueStandings } from './types';
import { Frag } from 'src/providers/frag.is/frag.is';

@Injectable()
export class LeagueService {
	constructor(
		private readonly cm: Challengermode,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
		private readonly prismic: Prismic,
		private readonly frag: Frag,
	) {}
	private readonly cacheKey = 'proStandings';
	private readonly cacheKeySchedule = 'proSchedule';
	private readonly logger = new Logger(LeagueService.name);

	async getProLeagueStandings(refreshCache: boolean) {
		this.logger.log(`${this.logger.getTimestamp()} - getProLeagueStandings called`);
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

	async getProLeagueSchedule(refreshCache: boolean) {
		this.logger.log(`${this.logger.getTimestamp()} - getProLeagueSchedule called`);
		if (refreshCache) {
			this.logger.log(`${this.logger.getTimestamp()} - Manually refreshing cache with new schedule data`);
			return this.updateAndRetrieveSchedule();
		}
		try {
			const cached = await this.cacheManager.get<LeagueRound[]>(this.cacheKeySchedule);
			if (!cached) {
				this.logger.log(`${this.logger.getTimestamp()} - Cache empty, fetching new schedule data`);
				return this.updateAndRetrieveSchedule();
			}
			return cached;
		} catch (error) {
			// nothing cached
			this.logger.log(`${this.logger.getTimestamp()} - Cache empty, fetching new schedule data`);
			return this.updateAndRetrieveSchedule();
		}
	}

	private teamByLineupId(lineupId: string, score: number, prismicTeams: Team[]): GameTeam {
		const name = TeamIds[lineupId];
		const logoUrl = prismicTeams.find(
			(x) =>
				x.team_name.toLowerCase() === name.toLowerCase() ||
				x.team_name_short.toLowerCase() === name.toLowerCase(),
		)?.team_logo;
		return {
			name,
			logoUrl,
			score,
		};
	}

	async getCmProLeagueSchedule() {
		const prismicTeams = await this.prismic.getProLeagueTeams();
		const group = await this.cm.getTournamentGroup();
		const matches = await this.cm.getMatchesByGroup(group);
		const orderedMatches: LeagueGame[] = matches
			.filter((x) => x.scheduledStartTime !== null)
			.sort((matchA, matchB) => {
				return new Date(matchA.scheduledStartTime).valueOf() - new Date(matchB.scheduledStartTime).valueOf();
			})
			.map((match) => {
				if (match.lineups.length !== 2) {
					return null;
				}
				const leftTeam = this.teamByLineupId(match.lineups[0].lineupId, match.lineups[0].score, prismicTeams);
				const rightTeam = this.teamByLineupId(match.lineups[1].lineupId, match.lineups[1].score, prismicTeams);
				return {
					teamHome: leftTeam,
					teamAway: rightTeam,
					startDateTime: new Date(match.scheduledStartTime),
					state: match.state,
				};
			});
		const leagueRounds: LeagueRound[] = [];
		orderedMatches.forEach((game, index, array) => {
			if (index % 4 === 0 && index !== 0) {
				// group this and last 3 games into an array and push to leagueRounds
				leagueRounds.push({
					games: [array[index - 4], array[index - 3], array[index - 2], array[index - 1]],
					roundNumber: Math.ceil(index / 4),
				});
			}
		});
		return leagueRounds;
	}

	async updateAndRetrieveSchedule() {
		const schedule = await this.frag.getProLeagueSchedule();
		await this.cacheManager.set(this.cacheKeySchedule, schedule, { ttl: 86400 });
		return schedule;
	}

	async updateAndRetreiveStandings() {
		const standings = await this.frag.getProLeagueStandings();
		await this.cacheManager.set(this.cacheKey, standings, { ttl: 86400 });
		return standings;
	}

	@Cron('*/5 19,20,21,22 * * TUE,THU')
	manuallyUpdateStandingsCache() {
		this.logger.log(`${this.logger.getTimestamp()} - Running scheduled standings update`);
		this.updateAndRetreiveStandings();
	}
}

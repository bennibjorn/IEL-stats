import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LeagueRound, LeagueSchedule, LeagueStandings } from 'src/modules/league/types';
import { FragMatchesResponse } from './frag.is.types';

@Injectable()
export class Frag {
	constructor(public http: HttpService, private configService: ConfigService) {}

	private getLeagueData = async (limit = 100) => {
		return this.http
			.post<FragMatchesResponse>('https://api.frag.is/matches/search', {
				limit,
				offset: 0,
				filters: [
					{
						field: 'tournamentId',
						operation: 0,
						terms: [
							{
								operation: 0,
								condition: 0,
								value: '8d98e91a-e83a-49f7-a3f9-794d916ee15c',
							},
						],
					},
				],
			})
			.toPromise();
	};

	public getProLeagueStandings = async (): Promise<LeagueStandings[]> => {
		const { data } = await this.getLeagueData(10);
		const standings: LeagueStandings[] = [];

		return standings;
	};
	public getProLeagueSchedule = async (): Promise<LeagueRound[]> => {
		const { data } = await this.getLeagueData(100);
		const rounds: LeagueRound[] = [];
		let matchesCounted = 0;
		let round = {
			roundNumber: 1,
			games: [],
		};

		Object.values(data.result).forEach((roundMatches) => {
			if (matchesCounted !== 0 && matchesCounted % 5 === 0) {
				rounds.push(round);
				round = {
					roundNumber: rounds.length + 1,
					games: [],
				};
			}
			roundMatches.forEach((match) => {
				matchesCounted++;
				round.games.push({
					teamHome: {
						name: match.leftTeam.name,
						logoUrl: match.leftTeam.logo,
						score: match.leftTeamScore.result,
					},
					teamAway: {
						name: match.rightTeam.name,
						logoUrl: match.rightTeam.logo,
						score: match.rightTeamScore.result,
					},
					startDateTime: match.date,
					state: match.state,
				});
			});
		});
		return rounds;
	};
}

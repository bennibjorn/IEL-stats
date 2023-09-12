import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LeagueRound, LeagueSchedule, LeagueStandings } from 'src/modules/league/types';
import { FragMatchesResponse, FragStandingsResponse } from './frag.is.types';

@Injectable()
export class Frag {
	constructor(public http: HttpService, private configService: ConfigService) {}

	private getMatchData = async (limit = 100) => {
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
	private getStandingsData = async () => {
		return this.http
			.get<FragStandingsResponse>('https://api.frag.is/tournaments/8d98e91a-e83a-49f7-a3f9-794d916ee15c')
			.toPromise();
	};

	public getProLeagueStandings = async (): Promise<LeagueStandings[]> => {
		const { data } = await this.getStandingsData();
		const standings: LeagueStandings[] = [];
		data.teams.forEach((team) => {
			standings.push({
				team: team.name,
				logoUrl: team.logo,
				gamesPlayed: 0,
				gamesWon: 0,
				gamesLost: 0,
				tiebreaker: 0,
				score: 0,
			});
		});
		if (
			data.brackets.length === 0 ||
			data.brackets[0].standings.length === 0 ||
			data.brackets[0].standings[0].length === 0
		) {
			return standings;
		}
		data.brackets[0].standings[0].forEach((standing) => {
			const team = standings.find((x) => x.team === standing.team.name);
			team.gamesPlayed = standing.matches;
			team.gamesWon = standing.wins;
			team.gamesLost = standing.losses;
			team.tiebreaker = standing.roundDifference;
			team.score = standing.wins * 2;
		});

		return standings;
	};
	public getProLeagueSchedule = async (): Promise<LeagueRound[]> => {
		const { data } = await this.getMatchData(100);
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

import { Injectable, HttpService, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LeagueStandings } from 'src/modules/league/types';
import { Team } from '../prismic/types';
import {
	AccessKeyResponse,
	GroupStandings,
	Tournament,
	TournamentBracket,
	TournamentGraphResponse,
	TournamentGroupResponse,
	TournamentMatchSeries,
} from './challengermode.types';
import { Config } from './config';
import { TeamIds } from '../../constants/mapper';

@Injectable()
export class Challengermode {
	constructor(public http: HttpService, private configService: ConfigService) {}
	private readonly logger = new Logger(Challengermode.name);
	private accessKey: string | null = null;
	private accessKeyExpiresAt: Date | null = null;
	private async getAccessToken() {
		// return existing accessKey if not expired
		const now = new Date();
		if (this.accessKey !== null && now < this.accessKeyExpiresAt) {
			return this.accessKey;
		}
		const refreshKey = this.configService.get<string>('CM_REFRESH_TOKEN');
		// authenticate with the refresh token to get an access token
		return this.http
			.post<AccessKeyResponse>(`${Config.CM_URL}/v1/auth/access_keys`, {
				refreshKey,
			})
			.toPromise()
			.then((res) => {
				if (res.status === 200) {
					this.accessKey = res.data.value;
					this.accessKeyExpiresAt = new Date(res.data.expiresAt);
					this.logger.log(`New access key created, expires at ${this.accessKeyExpiresAt.toUTCString()}`);
					return res.data.value;
				} else {
					this.logger.error(`error getting access key, status: ${res.status}. statusText: ${res.statusText}`);
					return null;
				}
			})
			.catch((err) => {
				this.logger.error('Error getting access key from Challengermode', err);
			});
	}

	private async makeRequest<ReturnType>(url: string): Promise<{ data: ReturnType }> {
		const accessKey = await this.getAccessToken();
		return this.http
			.get<ReturnType>(Config.CM_URL + url, { headers: { Authorization: 'Bearer ' + accessKey } })
			.toPromise();
	}

	private async getTournamentMatchBySeriesId(matchSeriesId: string) {
		const res = await this.makeRequest<TournamentMatchSeries>(`/v1/tournaments/match_series/${matchSeriesId}`);
		return res.data;
	}

	public async getMatchesByGroup(tournamentGroup: TournamentGroupResponse) {
		const matchSeriesPromises: Promise<TournamentMatchSeries>[] = [];
		tournamentGroup.rounds.forEach((round) => {
			round.matchSeriesIds.forEach((matchId) => {
				// TODO: check if match result is in cache
				matchSeriesPromises.push(this.getTournamentMatchBySeriesId(matchId));
			});
		});
		const matches = await Promise.all(matchSeriesPromises);
		// get games for finished scores when that starts working
		return matches;
	}

	public async getTournament(tournamentId?: string) {
		const id = tournamentId || Config.latestTournamentId;
		const res = await this.makeRequest<Tournament>(`/v1/tournaments/${id}`);
		return res.data;
	}
	public async getTournamentBracket(bracketId?: string) {
		const id = bracketId || Config.latestBracketId;
		const res = await this.makeRequest<TournamentBracket>(`/v1/tournaments/brackets/${id}`);
		return res.data;
	}
	public async getTournamentGroup(groupId?: string) {
		const id = groupId || Config.latestGroupId;
		const res = await this.makeRequest<TournamentGroupResponse>(`/v1/tournaments/groups/${id}`);
		return res.data;
	}

	private getGamesWon(score: number): number {
		if (score !== 0) {
			return score / 2;
		} else {
			return 0;
		}
	}

	public async getProLeagueStandings(prismicTeams: Team[]): Promise<LeagueStandings[]> {
		const group = await this.getTournamentGroup();
		return group.standings.map((standing: GroupStandings) => {
			const teamName = TeamIds[standing.lineupId];
			const teamLogo = prismicTeams.find(
				(x) =>
					x.team_name.toLowerCase() === teamName.toLowerCase() ||
					x.team_name_short.toLowerCase() === teamName.toLowerCase(),
			)?.team_logo;
			return {
				team: TeamIds[standing.lineupId],
				logoUrl: teamLogo,
				score: standing.score,
				gamesPlayed: standing.gamesPlayedCount,
				gamesWon: this.getGamesWon(standing.score),
				gamesLost: standing.gamesPlayedCount - this.getGamesWon(standing.score),
				tiebreaker: standing.tiebreaker,
			};
		});
	}

	public async getLineupsByTournamentId(tournamentId: string) {
		const tournament = await this.getTournament(tournamentId);
		return tournament.lineupIds;
	}

	public async getMembersByLineupId(lineupId: string) {
		const res = await this.makeRequest(`/v1/tournaments/lineups/${lineupId}`);
		return res.data;
	}

	public async getLineupMemberById(memberId: string) {
		const res = await this.makeRequest(`/v1/tournaments/lineup_members/${memberId}`);
		return res.data;
	}

	public async tournamentGraph(id: string) {
		const res = await this.makeRequest<TournamentGraphResponse>(`/v1/tournaments/${id}/graph`);
		return res.data;
	}

	public async getUserById(id: string) {
		const res = await this.makeRequest(`/v1/users/${id}`);
		return res.data;
	}

	// TODO: new tournament set up, get all info
	// supply a tournamentId
	// get the bracket and group Id
	// get lineup ids and associated team ids and names for the mapper

	public async getTeamByLineupId(lineupId: string) {
		const res = await this.makeRequest(`/v1/tournaments/lineups/${lineupId}`);
		return res.data;
	}
}

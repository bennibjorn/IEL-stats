import { Injectable, HttpService, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LeagueStandings } from 'src/modules/league/types';
import { Team } from '../prismic/types';
import {
	AccessKeyResponse,
	GroupStandings,
	Tournament,
	TournamentGroupResponse,
} from './challengermode.types';
import { Config } from './config';
import { TeamIds } from './mapper';

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

	private async makeRequest<ReturnType>(url: string) {
		const accessKey = await this.getAccessToken();
		return this.http
			.get<ReturnType>(Config.CM_URL + url, { headers: { Authorization: 'Bearer ' + accessKey } })
			.toPromise();
	}

	public async getSeason5Tournament() {
		const res = await this.makeRequest<Tournament>(`/v1/tournaments/${Config.season5ProLeagueTournamentId}`);
		return res.data;
	}

	public async getSeason5TournamentBracket() {
		const res = await this.makeRequest<any>(`/v1/tournaments/brackets/${Config.season5ProLeagueBracketId}`);
		return res.data;
	}

	public async getSeason5TournamentGroup() {
		const res = await this.makeRequest<TournamentGroupResponse>(
			`/v1/tournaments/groups/${Config.season5ProLeagueGroupId}`,
		);
		return res.data;
	}

	public async getProLeagueStandings(prismicTeams: Team[]): Promise<LeagueStandings[]> {
		const group = await this.getSeason5TournamentGroup();
		return group.standings.map((standing: GroupStandings) => {
			const teamName = TeamIds[standing.lineupId];
			const teamLogo = prismicTeams.find((x) => x.team_name === teamName || x.team_name_short === teamName)
				?.team_logo;
			return {
				team: TeamIds[standing.lineupId],
				logoUrl: teamLogo,
				score: standing.score,
				gamesPlayed: standing.gamesPlayedCount,
				gamesWon: standing.gamesWon,
				gamesLost: standing.gamesPlayedCount - standing.gamesWon,
				tiebreaker: standing.tiebreaker,
			};
		});
	}

	public async getProLeagueSchedule() {
		// TODO
	}
}

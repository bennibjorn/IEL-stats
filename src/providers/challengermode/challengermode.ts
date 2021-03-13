import { Injectable, HttpService } from '@nestjs/common';
import { AccessKeyResponse, GroupStandings, StandingDTO, Tournament, TournamentGroupResponse } from './challengermode.types';
import { Config } from './config';
import { TeamIds } from './mapper';

@Injectable()
export class Challengermode {
    constructor(public http: HttpService) {}
    private accessKey: string | null = null;
    private accessKeyExpiresAt: Date | null = null;
    private async getAccessToken() {
        // return existing accessKey if not expired
        const now = new Date();
        if (this.accessKey !== null && now < this.accessKeyExpiresAt) {
            console.log(`Existing access key expires at ${this.accessKeyExpiresAt.toUTCString()}`)
            return this.accessKey;
        }
        // authenticate with the refresh token to get an access token
        return this.http.post<AccessKeyResponse>(`${Config.CM_URL}/v1/auth/access_keys`, {
            refreshKey: Config.refreshKey
        })
        .toPromise()
        .then((res) => {
            if (res.status === 200) {
                this.accessKey = res.data.value;
                this.accessKeyExpiresAt = new Date(res.data.expiresAt);
                console.log(`New access key expires at ${this.accessKeyExpiresAt.toUTCString()}`)
                return res.data.value;
            } else {
                console.log('error getting access key', res.status, res.statusText);
                return null;
            }
        });
    }

    private async makeRequest<ReturnType>(url: string) {
        const accessKey = await this.getAccessToken();
        return this.http.get<ReturnType>(Config.CM_URL + url, { headers: { 'Authorization': 'Bearer ' + accessKey } }).toPromise();
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
        const res = await this.makeRequest<TournamentGroupResponse>(`/v1/tournaments/groups/${Config.season5ProLeagueGroupId}`);
        return res.data;
    }

    public async getProLeagueStandings(): Promise<StandingDTO[]> {
        const group = await this.getSeason5TournamentGroup();
        return group.standings.map((standing: GroupStandings) => {
            return {
                team: TeamIds[standing.lineupId],
                lineupId: standing.lineupId,
                gamesPlayedCount: standing.gamesPlayedCount,
                score: standing.score,
                gamesWon: standing.gamesWon,
                gamesTied: standing.gamesTied,
                mutualMeetings: standing.mutualMeetings,
                tiebreaker: standing.tiebreaker
            }
        })
    }

    public async getProLeagueSchedule() {
        // TODO
    }
}

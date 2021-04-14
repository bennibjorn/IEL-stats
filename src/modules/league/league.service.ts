import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Challengermode } from 'src/providers/challengermode/challengermode';
import { Prismic } from 'src/providers/prismic/prismic';

@Injectable()
export class LeagueService {
	constructor(private readonly cm: Challengermode, private readonly prismic: Prismic) {}

	getProLeagueStandings() {
		return this.cm.getProLeagueStandings();
	}
	async getProLeagueStandingsNewsSites(request: Request) {
		const teams = await this.prismic.getProLeagueTeams(request);
		const standings = await this.cm.getProLeagueStandings();

		// TODO: combine standings with teams with logos
		// TODO: convert to xml
		return {
			teams,
			standings,
		};
	}
}

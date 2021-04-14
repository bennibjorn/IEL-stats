import { Injectable } from '@nestjs/common';
import { PrismicConfig } from './config';
import { Request } from 'express';
import ResolvedApi from '@prismicio/client/types/ResolvedApi';
import { RichText } from 'prismic-dom';
import { Team } from './types';
const PrismicClient = require('@prismicio/client');
@Injectable()
export class Prismic {
	private async initApi(): Promise<ResolvedApi> {
		return PrismicClient.getApi(PrismicConfig.url);
	}

	public async getProLeagueTeams(): Promise<Team[]> {
		const api = await this.initApi();
		const query = await api.query(PrismicClient.Predicates.at('document.type', 'team'));
		const teams = query.results;
		return teams.map((doc) => {
			return {
				uid: doc.uid,
				team_name: RichText.asText(doc.data.team_name),
				team_name_short: RichText.asText(doc.data.team_name_short),
				team_logo: doc.data.team_logo.url,
			};
		});
	}
}

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Challengermode } from 'src/providers/challengermode/challengermode';
import { TournamentGraph } from 'src/providers/challengermode/challengermode.types';

@Injectable()
export class TournamentService {
	constructor(private readonly cm: Challengermode, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
	async getTournamentById(tournamentId: string): Promise<any> {
		const key = `tournament-${tournamentId}`;
		const cached = await this.cacheManager.get<TournamentGraph>(key);
		if (cached) {
			return cached;
		}
		const tournamentResponse = await this.cm.tournamentGraph(tournamentId);
		await this.cacheManager.set(key, tournamentResponse.tournament, { ttl: 30 });
		return tournamentResponse.tournament;
	}
}

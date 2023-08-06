import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Challengermode } from 'src/providers/challengermode/challengermode';

@Injectable()
export class TournamentService {
	constructor(private readonly cm: Challengermode, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
	async getTournamentById(tournamentId: string): Promise<any> {
		const key = `tournament-${tournamentId}`;
		const cached = await this.cacheManager.match(key);
		if (cached) {
			return cached;
		}
		const tournament = await this.cm.tournamentGraph(tournamentId);
		return tournament;
	}
}

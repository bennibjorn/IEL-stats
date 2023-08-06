import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TournamentService } from './tournament.service';
import { Config } from '../../providers/challengermode/config';

@ApiTags('tournaments')
@Controller('tournaments')
export class TournamentController {
	constructor(private readonly tournanentService: TournamentService) {}

	@Get()
	getTournamentById(id?: string): Promise<any[]> {
		return this.tournanentService.getTournamentById(id ?? Config.latestTournamentId);
	}
}

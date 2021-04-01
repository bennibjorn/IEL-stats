import { HttpModule, Module } from '@nestjs/common';
import { Challengermode } from 'src/providers/challengermode/challengermode';
import { Prismic } from 'src/providers/prismic/prismic';
import { LeagueController } from './league.controller';
import { LeagueService } from './league.service';

@Module({
	imports: [HttpModule],
	controllers: [LeagueController],
	providers: [LeagueService, Challengermode, Prismic],
})
export class LeagueModule {}

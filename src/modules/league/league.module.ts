import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { Challengermode } from 'src/providers/challengermode/challengermode';
import { Prismic } from 'src/providers/prismic/prismic';
import { LeagueController } from './league.controller';
import { LeagueService } from './league.service';
import { Frag } from 'src/providers/frag.is/frag.is';

@Module({
	imports: [HttpModule, CacheModule.register(), ScheduleModule.forRoot(), ConfigModule.forRoot()],
	controllers: [LeagueController],
	providers: [LeagueService, Challengermode, Prismic, Frag],
})
export class LeagueModule {}

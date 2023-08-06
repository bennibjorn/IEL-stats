import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { Challengermode } from 'src/providers/challengermode/challengermode';
import { Prismic } from 'src/providers/prismic/prismic';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';

@Module({
	imports: [HttpModule, CacheModule.register(), ScheduleModule.forRoot(), ConfigModule.forRoot()],
	controllers: [TournamentController],
	providers: [TournamentService, Challengermode, Prismic],
})
export class TournamentModule {}

import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { Challengermode } from 'src/providers/challengermode/challengermode';
import { LeagueController } from './league.controller';
import { LeagueService } from './league.service';

@Module({
  imports: [HttpModule, CacheModule.register(), ScheduleModule.forRoot()],
  controllers: [LeagueController],
  providers: [LeagueService, Challengermode]
})
export class LeagueModule {}

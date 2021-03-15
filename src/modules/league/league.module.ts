import { HttpModule, Module } from '@nestjs/common';
import { Challengermode } from 'src/providers/challengermode/challengermode';
import { LeagueController } from './league.controller';
import { LeagueService } from './league.service';

@Module({
  imports: [HttpModule],
  controllers: [LeagueController],
  providers: [LeagueService, Challengermode]
})
export class LeagueModule {}

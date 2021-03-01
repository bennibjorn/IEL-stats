import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeagueModule } from './modules/league/league.module';
import { AuthModule } from './modules/auth/auth.module';
import { VetoModule } from './modules/veto/veto.module';
import { Challengermode } from './providers/challengermode/challengermode';

@Module({
  imports: [LeagueModule, AuthModule, VetoModule],
  controllers: [AppController],
  providers: [AppService, Challengermode],
})
export class AppModule {}

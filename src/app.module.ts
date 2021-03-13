import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeagueModule } from './modules/league/league.module';
import { AuthModule } from './modules/auth/auth.module';
import { VetoModule } from './modules/veto/veto.module';
import { Challengermode } from './providers/challengermode/challengermode';
import { Prismic } from './providers/prismic/prismic';

@Module({
  imports: [LeagueModule, AuthModule, VetoModule, HttpModule],
  controllers: [AppController],
  providers: [AppService, Challengermode, Prismic],
})
export class AppModule {}

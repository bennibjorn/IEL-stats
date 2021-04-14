import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeagueModule } from './modules/league/league.module';
import { AuthModule } from './modules/auth/auth.module';
import { VetoModule } from './modules/veto/veto.module';
import { Prismic } from './providers/prismic/prismic';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [LeagueModule, AuthModule, VetoModule, HttpModule, ConfigModule.forRoot()],
	controllers: [AppController],
	providers: [AppService, Prismic],
})
export class AppModule {}

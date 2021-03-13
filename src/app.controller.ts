import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Challengermode } from './providers/challengermode/challengermode';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService, private readonly cm: Challengermode) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Get('challengermode')
	challengermodeTest(): any {
		return this.cm.getProLeagueStandings();
	}
}

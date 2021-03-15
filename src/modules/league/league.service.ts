import { Injectable } from '@nestjs/common';
import { Challengermode } from 'src/providers/challengermode/challengermode';

@Injectable()
export class LeagueService {

    constructor(private readonly cm: Challengermode) {}

    getProLeagueStandings() {
        return this.cm.getProLeagueStandings();
    }
}

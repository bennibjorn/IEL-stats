import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { Challengermode } from 'src/providers/challengermode/challengermode';
import { StandingDTO } from 'src/providers/challengermode/challengermode.types';

@Injectable()
export class LeagueService {

    constructor(private readonly cm: Challengermode, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
    private readonly cacheKey = 'proStandings';
    private readonly logger = new Logger(LeagueService.name);

    async getProLeagueStandings() {
        try {
            await this.cacheManager.del(this.cacheKey);
            const cached = await this.cacheManager.get<StandingDTO[]>(this.cacheKey);
            return cached;
        } catch (error) {
            // nothing cached
            this.logger.log(`${this.logger.getTimestamp()} - Nothing cached, getting initial data`);
            return this.updateAndRetreiveStandings();
        }
    }

    async updateAndRetreiveStandings() {
        const updated = await this.cm.getProLeagueStandings();
        await this.cacheManager.set(this.cacheKey, updated, { ttl: null });
        return updated;
    }
    
    @Cron('*/5 19,20,21,22 * * MON,TUE,THU,FRI')
    manuallyUpdateStandingsCache() {
        this.logger.log(`${this.logger.getTimestamp()} - Running scheduled standings update`);
        this.updateAndRetreiveStandings();
    }
}

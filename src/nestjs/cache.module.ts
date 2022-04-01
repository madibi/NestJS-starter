import { CACHE_MANAGER, Inject, Module, OnModuleInit, CacheModule as BaseCacheModule, Logger } from '@nestjs/common';
import { Cache} from 'cache-manager';
import { LogModule } from './../services/log/log.module';
import { LogService } from './../services/log/log.service';
import * as redisStore from 'cache-manager-ioredis';

@Module({
    imports: [
        BaseCacheModule.registerAsync({
            useFactory: () => {
                return {
                    store: redisStore,
                    host: 'localhost',
                    port: 6379,
                    ttl: 10
                }
            },
        }),
        LogModule
    ],
    exports: [
        BaseCacheModule,
    ],
})
export class CacheModule implements OnModuleInit {

    constructor(
        @Inject(CACHE_MANAGER) 
        private readonly cache: Cache,
        @Inject(LogService) 
        private readonly logService: LogService,        
    ) {}

    public onModuleInit(): any {
        const logger = new Logger('CACHE');

        // Commands that are interesting to log
        const commands = [
            'get',
            'set',
            'del',
        ];
        const cache = this.cache;
        commands.forEach((commandName) => {
            const oldCommand = cache[commandName];
            cache[commandName] = async (...args) => {
                // Computes the duration
                const start = new Date();
                const result = await oldCommand.call(cache, ...args);
                const end = new Date();
                const duration = end.getTime() - start.getTime();

                // Avoid logging the options
                args = args.slice(0, 2);
                logger.log(`${commandName.toUpperCase()} ${args.join(', ')} - ${duration}ms`);

                return result;
            };
        });
    }
}
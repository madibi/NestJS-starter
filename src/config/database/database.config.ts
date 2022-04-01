import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import DatabaseLogger from "../../helpers/typeorm-logger.class";

export const postgreSql: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_DATABASE || '',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    logger: new DatabaseLogger(),
    entities: [
        'dist/**/*.entity.js',
        '**/*.entity.js'
    ],
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
    migrationsTableName: 'migrations',
    migrations: [        
        'dist/migrations/*{.ts,.js}',
    ],
    cli: {
        migrationsDir: "src/migrations"
    }
  }
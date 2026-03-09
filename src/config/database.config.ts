import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

const dbConfig = (env: ConfigService): TypeOrmModuleOptions => {
  return {
    name: 'default',
    type: 'postgres',
    schema: env.get<string>('TYPEORM_SCHEMA'),
    host: env.get<string>('TYPEORM_HOST'),
    port: env.get<number>('TYPEORM_PORT'),
    database: env.get<string>('TYPEORM_DATABASE'),
    password: env.get<string>('TYPEORM_PASSWORD'),
    username: env.get<string>('TYPEORM_USERNAME'),
    entities: [
      'dist/entities/**/*.entity{.ts,.js}',
      'dist/infrastructure/entities/**/*.entity{.ts,.js}'
    ],
    migrations: ['dist/resources/migrations/*.ts'],
    logging: ['error'],
    autoLoadEntities: true,
  };
};

// const dbAksiConfig = (env: ConfigService): TypeOrmModuleOptions => {
//   return {
//     name: 'AKSICONNECT',
//     type: 'mysql',
//     host: env.get<string>('TYPEORM_HOST_AKSI'),
//     port: env.get<number>('TYPEORM_PORT_AKSI'),
//     database: env.get<string>('TYPEORM_DATABASE_AKSI'),
//     password: env.get<string>('TYPEORM_PASSWORD_AKSI'),
//     username: env.get<string>('TYPEORM_USERNAME_AKSI'),
//     entities: ['dist/entities/aksi/*.entity{.ts,.js}'],
//     migrations: ['dist/resources/migrations/*.ts'],
//     logging: ['error']
//   };
// };

// const dbBssnConfig = (env: ConfigService): TypeOrmModuleOptions => {
//   return {
//     name: 'BSSNCONNECT',
//     type: 'postgres',
//     schema: env.get<string>('TYPEORM_SCHEMA_BSSN'),
//     host: env.get<string>('TYPEORM_HOST_BSSN'),
//     port: env.get<number>('TYPEORM_PORT_BSSN'),
//     database: env.get<string>('TYPEORM_DATABASE_BSSN'),
//     password: env.get<string>('TYPEORM_PASSWORD_BSSN'),
//     username: env.get<string>('TYPEORM_USERNAME_BSSN'),
//     entities: ['dist/entities/bssn/*.entity{.ts,.js}'],
//     migrations: ['dist/resources/migrations/*.ts'],
//     logging: ['error']
//   };
// };


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      name: 'default',
      useFactory: async (config: ConfigService) => {
        return dbConfig(config);
      },
    }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   imports: [ConfigModule],
    //   name: 'AKSICONNECT',
    //   useFactory: async (config: ConfigService) => {
    //     return dbAksiConfig(config);
    //   },
    // }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   imports: [ConfigModule],
    //   name: 'BSSNCONNECT',
    //   useFactory: async (config: ConfigService) => {
    //     return dbBssnConfig(config);
    //   },
    // }),
  ],
})
export class DatabaseModule {}

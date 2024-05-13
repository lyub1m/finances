import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {OperationsModule} from './modules/operations/operations.module'
import {AccountsModule} from "./modules/accounts/accounts.module";
import {CategoriesModule} from "./modules/categories/categories.module";
import {AuthModule} from "./modules/auth/auth.module";
import {UsersModule} from "./modules/users/users.module";
import {CurrenciesModule} from "./modules/currencies/currencies.module";
import {RegularOperationsModule} from "./modules/regular-operations/regular-operations.module";
import { ScheduleModule } from '@nestjs/schedule';
import {NotificationsModule} from "./modules/notifications/notifications.module";

@Module({
  imports: [
    CurrenciesModule,
    CategoriesModule,
    AccountsModule,
    OperationsModule,
    AuthModule,
    UsersModule,
    RegularOperationsModule,
    NotificationsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      async useFactory(configService: ConfigService) {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: false,
        };
      },
    }),
    ScheduleModule.forRoot()
  ],
})
export class AppModule {}

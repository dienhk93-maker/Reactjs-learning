import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoModule } from './todo/todo.module';
import { ConfigModule } from '@nestjs/config';
import config from 'config';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRoot(
      config.get('database.uri'),
      {
        dbName: config.get('database.name'),
      },
    ),
    TodoModule,
  ],
})
export class AppModule {}

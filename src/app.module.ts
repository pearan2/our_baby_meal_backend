import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { MealModule } from './meal/meal.module';

@Module({
  imports: [TypeOrmModule.forRoot(), MealModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

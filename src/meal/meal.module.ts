import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealRepository } from 'src/entities/meal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealRepository])],
  controllers: [MealController],
  providers: [MealService],
})
export class MealModule {}

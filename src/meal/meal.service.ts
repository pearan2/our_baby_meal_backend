import { Injectable } from '@nestjs/common';
import { Meal, MealRepository, MealTypeEnum } from '../entities/meal.entity';

@Injectable()
export class MealService {
  constructor(private readonly mealRepository: MealRepository) {}

  async create(createMeal: Meal) {
    try {
      const meal = await this.mealRepository.findOne(createMeal);
      if (meal) return;
    } catch (e) {
      return e;
    }

    try {
      return await this.mealRepository.save(createMeal);
    } catch (e) {
      return e;
    }
  }
}

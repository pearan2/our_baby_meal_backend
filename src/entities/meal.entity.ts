import { Column, Entity, EntityRepository, Repository } from 'typeorm';

export enum MealTypeEnum {
  BREAKFAST = 'BRFST',
  LAUNCH = 'LAUNCH',
  DINNER = 'DINNER',
  EXTRA = 'EXTRA',
}

@Entity('meal')
export class Meal {
  @Column({
    primary: true,
    type: 'varchar',
    length: 10,
  })
  army_unit_code: string;

  @Column({
    primary: true,
    type: 'varchar',
    length: 8,
  })
  date: string;

  @Column({
    primary: true,
    type: 'enum',
    enum: MealTypeEnum,
  })
  type: string;

  @Column({
    primary: true,
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    type: 'numeric',
    nullable: false,
  })
  calorie: number;

  @Column({
    type: 'varchar',
    length: 50,
    array: true,
  })
  allergies: string[];
}

@EntityRepository(Meal)
export class MealRepository extends Repository<Meal> {}

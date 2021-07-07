import { Controller, Get } from '@nestjs/common';
import { MealService } from './meal.service';
import axios from 'axios';
import { Meal, MealTypeEnum } from '../entities/meal.entity';

@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  // @Post()
  // create(@Body() createMealDto: CreateMealDto) {
  //   return this.mealService.create(createMealDto);
  // }

  // dates: '',
  // brst: '',
  // brst_cal: '909.84'
  // lunc: '',
  // lunc_cal: '973.45',
  // dinr: '',
  // dinr_cal: '886.97',
  // adspcfd: '',
  // adspcfd_cal: '729.44',
  // sum_cal: '3,499.70',

  // max : 11876

  // DS_TB_MNDT_DATEBYMLSVC_6176 >> 6176
  //

  @Get('setup')
  async setup() {
    interface unitType {
      unitUrl: string;
      key: string;
      endIndex: string;
    }
    interface tempType {
      from: string;
      to: string;
    }

    interface tempType2 {
      key: string;
      type: MealTypeEnum;
    }

    const units: unitType[] = [
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_8623', key: '8623', endIndex: '1' },
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_9030', key: '9030', endIndex: '1' },
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_6282', key: '6282', endIndex: '1' },
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_1691', key: '1691', endIndex: '1' },
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_2171', key: '2171', endIndex: '1' },
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_7369', key: '7369', endIndex: '1' },
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_3296', key: '3296', endIndex: '1' },
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_5322', key: '5322', endIndex: '1' },
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_6335', key: '6335', endIndex: '1' },
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_3389', key: '3389', endIndex: '1' },
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_8902', key: '8902', endIndex: '1' },
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_6176', key: '6176', endIndex: '1' },
      { unitUrl: 'DS_TB_MNDT_DATEBYMLSVC_ATC', key: 'ATC', endIndex: '1' }, // 육군훈련소
    ];

    // update total list
    for (let m: number = 0; m < units.length; m++) {
      const data = await axios(
        'https://openapi.mnd.go.kr/3238313632323536313631353832303738/json/' +
          units[m].unitUrl +
          '/1/2/',
      )
        .then((result) => result.data)
        .catch((error) => error);

      units[m].endIndex = data[units[m].unitUrl].list_total_count;
    }
    const targetMealTypes: tempType2[] = [
      { key: 'brst', type: MealTypeEnum.BREAKFAST },
      { key: 'lunc', type: MealTypeEnum.LAUNCH },
      { key: 'dinr', type: MealTypeEnum.DINNER },
      { key: 'adspcfd', type: MealTypeEnum.EXTRA },
    ];

    const targetStrings: tempType[] = [
      { from: '(01)', to: '01' },
      { from: '(02)', to: '02' },
      { from: '(03)', to: '03' },
      { from: '(04)', to: '04' },
      { from: '(05)', to: '05' },
      { from: '(06)', to: '06' },
      { from: '(07)', to: '07' },
      { from: '(08)', to: '08' },
      { from: '(09)', to: '09' },
      { from: '(10)', to: '10' },
      { from: '(11)', to: '11' },
      { from: '(12)', to: '12' },
      { from: '(13)', to: '13' },
      { from: '(14)', to: '14' },
      { from: '(15)', to: '15' },
      { from: '(16)', to: '16' },
      { from: '(17)', to: '17' },
      { from: '(18)', to: '18' },
      { from: '(19)', to: '19' },
      { from: '(20)', to: '20' },
      { from: '(1)', to: '01' },
      { from: '(2)', to: '02' },
      { from: '(3)', to: '03' },
      { from: '(4)', to: '04' },
      { from: '(5)', to: '05' },
      { from: '(6)', to: '06' },
      { from: '(7)', to: '07' },
      { from: '(8)', to: '08' },
      { from: '(9)', to: '09' },
    ];

    for (let m: number = 0; m < units.length; m++) {
      const data = await axios(
        'https://openapi.mnd.go.kr/3238313632323536313631353832303738/json/' +
          units[m].unitUrl +
          '/1/' +
          units[m].endIndex +
          '/',
      )
        .then((result) => result.data)
        .catch((error) => error);

      let date: string = '';

      for (let i: number = 0; i < data[units[m].unitUrl].row.length; i++) {
        let row: any = data[units[m].unitUrl].row[i];
        if (row.dates === '알레르기 정보') continue;
        if (row.dates && row.dates !== '') date = row.dates;

        date = date.replace(/-/gi, '');

        for (let k: number = 0; k < targetMealTypes.length; k++) {
          if (
            row[targetMealTypes[k].key] &&
            row[targetMealTypes[k].key] !== ''
          ) {
            let meal_create = new Meal();
            meal_create.date = date;
            meal_create.army_unit_code = units[m].key;
            meal_create.allergies = [];
            meal_create.type = targetMealTypes[k].type;
            meal_create.name = row[targetMealTypes[k].key];
            let tempString: string = row[targetMealTypes[k].key + '_cal'];
            tempString = tempString.toLowerCase();
            tempString = tempString.replace('kcal', '');
            tempString = tempString.replace('cal', '');
            meal_create.calorie = +tempString;
            for (let j: number = 0; j < targetStrings.length; j++) {
              if (meal_create.name.indexOf(targetStrings[j].from) !== -1) {
                meal_create.name = meal_create.name.replace(
                  targetStrings[j].from,
                  '',
                );
                meal_create.allergies.push(targetStrings[j].to);
              }
            }

            if (meal_create.date && meal_create.date !== '')
              await this.mealService.create(meal_create);
          }
        }
      }
    }
    return 'finish';
  }
}

import { Column, Entity, EntityRepository, Repository } from 'typeorm';

@Entity('allergy_code')
export class AllergyCode {
  @Column({
    primary: true,
    type: 'varchar',
    length: 10,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;
}

@EntityRepository(AllergyCode)
export class AllergyCodeRepository extends Repository<AllergyCode> {}

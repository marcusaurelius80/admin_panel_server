import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Intermediate } from 'src/intermediate.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  brand_id: number;

  @Column()
  brand_name: string;

  // 중간테이블을 left join. Brand TO Intermediate
  @OneToMany(() => Intermediate, (intermediate) => intermediate.brand)
  intermediates: Intermediate[];
}

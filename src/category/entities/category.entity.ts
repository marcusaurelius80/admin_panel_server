import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { Intermediate } from 'src/intermediate.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  category_name: string;

  // 중간 테이블을 left join. Category TO Intermediate
  @OneToMany(() => Intermediate, (intermediate) => intermediate.category)
  intermediates: Intermediate[];
}

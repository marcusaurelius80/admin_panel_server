import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Intermediate } from 'src/intermediate.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  product_name: string;

  @Column()
  sex: string;

  @Column()
  brand_id: number;

  @Column()
  category_id: number;

  @Column()
  is_kids: boolean;

  @Column()
  sales_quantity: number;

  @Column({ type: 'json', nullable: true })
  file_paths: string[];

  @ManyToOne(() => Intermediate, (intermediate) => intermediate.brandProducts)
  @JoinColumn({ name: 'brand_id', referencedColumnName: 'brand_id' })
  intermediate_brand: Intermediate;

  @ManyToOne(
    () => Intermediate,
    (intermediate) => intermediate.categoryProducts,
  )
  @JoinColumn({ name: 'category_id', referencedColumnName: 'category_id' })
  intermediate_category: Intermediate;
}

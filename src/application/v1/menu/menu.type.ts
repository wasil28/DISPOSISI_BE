import { Field, ObjectType } from '@nestjs/graphql';
import { MenuEntity } from 'src/entities/menu.entity';

@ObjectType()
export class MenuType extends MenuEntity {
  @Field((type) => [MenuType], { nullable: true })
  submenu?: MenuType[];
}

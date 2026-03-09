import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationResponse {
  @Field((type) => Int, { nullable: true, defaultValue: 1 })
  currentPage: number;

  @Field((type) => Int, { nullable: true, defaultValue: 1 })
  totalPages: number;

  @Field((type) => Int, { nullable: false, defaultValue: 1 })
  totalItems: number;
}

import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationPayload {
  @Field((type) => Int, { nullable: true })
  limit: number;

  @Field((type) => Int, { nullable: true })
  skip: number;
}

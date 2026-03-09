import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface IPaginatedResponse<T> {
  data: T[];
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export function PaginatedResponse<T>(classRef: Type<T>): Type<IPaginatedResponse<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass implements IPaginatedResponse<T> {
    @Field(() => [classRef], { nullable: true })
    data: T[];

    @Field(() => Int)
    totalItems: number;

    @Field(() => Int)
    itemCount: number;

    @Field(() => Int)
    itemsPerPage: number;

    @Field(() => Int)
    totalPages: number;

    @Field(() => Int)
    currentPage: number;
  }
  return PaginatedResponseClass as Type<IPaginatedResponse<T>>;
}

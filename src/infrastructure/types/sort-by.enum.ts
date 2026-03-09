import { registerEnumType } from '@nestjs/graphql';

export enum SortByEnum {
  ASC,
  DESC,
}

registerEnumType(SortByEnum, {
  name: 'SortByEnum',
});

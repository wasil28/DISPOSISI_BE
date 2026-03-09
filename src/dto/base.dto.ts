export abstract class PageableDto {
  start?: number = 1;
  offset?: number = 10;
}

export abstract class Meta {
  totalItems?: number = 0;
  totalPages?: number = 0;
  currentPage?: number = 0;
}

export interface ResponseDto {
  status: number;
  message: string;
  data: any;
  meta: Meta;
}

import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class AppPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = 'Постов на странице:';
    this.nextPageLabel = 'Следующая страница';
    this.previousPageLabel = 'Предыдущая страница';
    this.firstPageLabel = 'К первой странице';
    this.lastPageLabel = 'К последней странице';

    this.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `Страница ${page + 1}`;
      }
      return `${page + 1} из ${Math.ceil(length / pageSize)}`;
    };
  }
}

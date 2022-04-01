import { PaginationPageSize } from "../enums/pagination-page-size.enum";
import { PaginationFilter } from "./pagination-filter.dto";
import { PaginationSort } from "./pagination-sort.dto";

export class PaginationRQ {
    public currentPage: number = 1;
    public pageSize: PaginationPageSize = PaginationPageSize.TEN;
    public sort?: PaginationSort[];  
    public filter?: PaginationFilter[][]; // [and]or[and]

    public constructor(init?:Partial<PaginationRQ>) {
        Object.assign(this, init);
    }
}

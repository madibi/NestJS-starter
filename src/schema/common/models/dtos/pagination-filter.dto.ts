import { FilterType } from "../enums/filter-type.enum";

export class PaginationFilter {
    public column: string;
    public keyword: any;
    public filterType: FilterType;

    public constructor(init?:Partial<PaginationFilter>) {
        Object.assign(this, init);
    }
}

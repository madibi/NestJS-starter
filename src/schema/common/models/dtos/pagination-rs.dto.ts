import { PaginationDetails } from "./pagination-details.dto";

export class PaginationRS<T> {
    public paginationDetails: PaginationDetails = new PaginationDetails();
    public items: T;

    public constructor(init?:Partial<PaginationRS<T>>) {
        Object.assign(this, init);
    }    
}

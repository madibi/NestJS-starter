export class PaginationDetails {
    public totalItems: number;
    public totalPages: number;
    public currentPage: number;

    public constructor(init?:Partial<PaginationDetails>) {
        Object.assign(this, init);
    }    
}

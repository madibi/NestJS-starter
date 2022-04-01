import { PaginationRQ } from "./pagination-rq.dto";

export class Search {  
  constructor() {    
  }
    public keyword: string = '';
    public paginationRQ: PaginationRQ = new PaginationRQ();
  }
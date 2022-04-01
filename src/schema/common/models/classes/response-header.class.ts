import { CheckOut } from './check-out.class';
import { ResponseSeo } from './response-seo.class';

export class ResponseHeader {
  processInfo: CheckOut = new CheckOut();
  methodInfo: CheckOut = new CheckOut();
  responseSeo: ResponseSeo = new ResponseSeo();
}

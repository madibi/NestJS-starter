
export class RequestCodeRS {
  message: string;
  messageCode: string;
  sessionInfo: string = '';

  public constructor(init?:Partial<RequestCodeRS>) {
    Object.assign(this, init);
  }
}

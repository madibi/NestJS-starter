import { Length } from "class-validator";

export class NotificationSendToAllRQ {
    @Length(10, 20)
    public message: string;  
  }
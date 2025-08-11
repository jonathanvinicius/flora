export class MessageDto {
  message: string;
  constructor(message: string) {
    this.message = message;
  }
}
export class PostMessageDto {
  id: string | number;
  message: string;
  constructor(id: number | string, message: string) {
    this.id = id;
    this.message = message;
  }
}

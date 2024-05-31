import { User } from './User';
import { Quiz } from './Quiz';

export class Device {
    date: string = '';
    uuid: string = '';
    latlng: string= [] as any;
    user: User = new User();
    quiz?: Quiz[] = new Array<Quiz>() ;
    formUpdate: boolean = false;
    userUpdate: boolean = false;
  }

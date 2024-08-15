import { Profile } from './Profile';
import { Quiz } from './Quiz';

export class Device {
    uuid: string = '';
    latlong: string= [] as any;
    ageRange: string = '';
    profile?: Profile;
    quiz?: Quiz[];
  }

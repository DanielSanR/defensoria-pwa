import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { DeviceService } from './device.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user = new BehaviorSubject<any>(null);
  public optionChosed: BehaviorSubject<any> = new BehaviorSubject(null);
  private url = environment.url;
  constructor(public  http: HttpClient,
    private storageService: StorageService,
    private deviceService: DeviceService) {

  }

async getUser(): Promise<boolean>{
      const device = JSON.parse(await this.storageService.getStorage2('device'));
      if(device.user_update){
        this.user.next(device.user); 
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
     
  }
  
   getData(){
      return this.user.asObservable();
  }
  
  async updateUser(data: any){
    this.user.next(data);
    await this.deviceService.updateDeviceUser(data);
    const device = JSON.parse(await this.storageService.getStorage2('device'));
    return new Promise((resolve) => {
      console.log(device)
      resolve(true);
    });
  }

}

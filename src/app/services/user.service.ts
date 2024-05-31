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
  private url = environment.urlApi;
  constructor(public  http: HttpClient,
    private storageService: StorageService,
    private deviceService: DeviceService) {
      console.log("construct user" )

  }

async getUser(): Promise<boolean>{
      const device = JSON.parse(await this.storageService.getStorage2('device'));
      if(device.userUpdate){
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
    this.deviceService.updateDeviceUser(data);
    const device = JSON.parse(await this.storageService.getStorage2('device'));
     let request = this.http.post(`${this.url}/Auth/denuncias/guardar`, this.replaceEmptyArraysWithObjects(device)).toPromise().then((res: any) => {
       if (res.status === 200) {
         return true;
       }
     }).catch(err => {
        return false;
      });
      return request
  }

  replaceEmptyArraysWithObjects(obj: any): any {
    if (Array.isArray(obj) && obj.length === 0) {
      return {};
    } else if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          obj[key] = this.replaceEmptyArraysWithObjects(obj[key]);
        }
      }
    }
    return obj;
  }

  async clearData(){
    this.user.next(null);
    this.deviceService.clearDevice();
    
    
  }

}

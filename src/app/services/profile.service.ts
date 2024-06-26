import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { DeviceService } from './device.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  public profile = new BehaviorSubject<any>(null);
  public optionChosed: BehaviorSubject<any> = new BehaviorSubject(null);
  private url = environment.urlApi;
  constructor(public  http: HttpClient,
    private storageService: StorageService,
    private deviceService: DeviceService) {

  }

async getProfile(): Promise<boolean>{
      const device = JSON.parse(await this.storageService.getStorage2('device'));
      if(device.profile){
        this.profile.next(device.profile); 
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
  }
  
   getData(){
      return this.profile.asObservable();
  }
  
  async updateProfile(data: any){
    this.profile.next(data);
    await this.deviceService.updateDeviceProfile(data);
    const device = JSON.parse(await this.storageService.getStorage2('device'));
    let deviceProfile = {device: {uuid: device.uuid,profile: data}};
    if(device.profile){
      console.log("PUT para Perfil",deviceProfile);
    }
    else {
      console.log("POST para Perfil",deviceProfile);
    }
     /* let request = this.http.post(`${this.url}/Auth/denuncias/guardar`, this.replaceEmptyArraysWithObjects(device)).toPromise().then((res: any) => {
       if (res.status === 200) {
         return true;
       }
     }).catch(err => {
        return false;
      });
      return request */
      return true;
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
    this.profile.next(null);
    this.deviceService.clearDevice();
    
    
  }

}

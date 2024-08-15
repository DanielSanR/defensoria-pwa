import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { DeviceService } from './device.service';
import { Profile } from '../Interfaces/Profile';
import { Device } from '../Interfaces/Device';

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
      const hasSavedProfile = await this.storageService.getStorage2('hasSavedProfile');
      if(device.profile){
        this.profile.next(device.profile); 
        return Promise.resolve(true);
      }
      else if (hasSavedProfile){ 
        console.log("Has saved Profile",hasSavedProfile);
        // aca consultariamos a la API para traer nuevamente el perfil
        await this.getProfileDataAPI();
        
      }
      return Promise.resolve(false);
  }
  
   getData(){
      return this.profile.asObservable();
  }
  
  async updateProfile(data: Profile,dirty: Profile){
    const device =  await this.updateBehaviorAndReturnUUID(data);
    return new Promise((resolve) => {
      console.log("PUT para Update Perfil",dirty);
      //DESCOMENTAR PARA PROBAR EN LA API
        /*  this.http.put(`${this.url}/Auth/profile/${device.uuid}/`, dirty).subscribe((res: any) => {
        if (res.status === 200) {
          resolve(true);
      
        }else resolve(false);}); */

        resolve(true);
      });
  }
  async saveNewProfile(data: Profile){
    const device =  await this.updateBehaviorAndReturnUUID(data);
    console.log("PUT para New Perfil",device.profile); 
    return new Promise((resolve) => {
      //DESCOMENTAR PARA PROBAR EN LA API
    /*   this.http.put(`${this.url}/Auth/profile/${device.uuid}/save`, device.profile).subscribe((res: any) => {
        if (res.status === 200) {
          resolve(true);
      
       }else resolve(false);}); */
        resolve(true);
        //Mover esto adentro para guardarlo en local si el response es ok
        const saveProfile = this.storageService.saveStorage('hasSavedProfile', true);
      });
  }

  async updateBehaviorAndReturnUUID(data: Profile) : Promise<Device>{
    this.profile.next(data);
    await this.deviceService.updateDeviceProfile(data);
    const device = JSON.parse(await this.storageService.getStorage2('device'));
    return device;

  }

  async getProfileDataAPI(){
    const device = JSON.parse(await this.storageService.getStorage2('device'));
    return new Promise((resolve) => {
      //DESCOMENTAR PARA PROBAR EN LA API
       /*  this.http.get(`${this.url}/Auth/profile/${device.uuid}`).subscribe((res: any) => {
        if (res) {
          this.profile.next(res);
          resolve(true);
        } else resolve(false);
      });   */
      resolve(true)});

  }
  



  async clearData(){
    this.profile.next(null);
    this.deviceService.clearDevice();
    
    
  }

}

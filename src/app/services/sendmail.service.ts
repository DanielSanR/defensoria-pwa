import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DeviceService } from './device.service';
@Injectable({
  providedIn: 'root'
})
export class SendmailService {

  constructor(public http: HttpClient,private storageService: StorageService, public deviceService: DeviceService) { }

  async sendOnboarding(selected : string, latlng : any, uuid : string){
    console.log('sendOnboarding', this.deviceService.getCurrentDevice());
     const rangoEtario  = selected == 'teen'? 'Adolescente' : ' Niño/Niña'; 
     this.deviceService.updateDeviceUuid(uuid, rangoEtario, latlng);
     const datos  = {
      uuid,
      latlng,
      rangoEtario : rangoEtario
     }
    /*  try{
       const response : any  = await this.http.post('http://localhost:9000/api/send-onboarding',{datos}).toPromise();
       if(response){
          return Promise.resolve(true);
        }
      
     }
      catch{
        return Promise.resolve(false);
      } */
      return Promise.resolve(true);
  }
  async sendForm(type: string, data: any){
    if(type == 'user'){
      await this.deviceService.updateDeviceUser(data);
      this.storageService.getStorage2('device').then(value => {
        console.log(value);
        return Promise.resolve(true);
      }); 
    }
    if(type =='form'){
      await this.deviceService.updateDeviceForm(data);
      this.storageService.getStorage2('device').then(value =>{
        console.log(value)
        return Promise.resolve(true);
      })
    }
    
    /* const latlng = await this.storageService.getStorage('latlng');
    const rangoEtario = await this.storageService.getStorage('selected');
    const quiz = await this.storageService.getStorage('quiz');
    const user = await this.storageService.getStorage('user');
    const id = await this.storageService.getStorage('id');
    const datos = {
        latlng : latlng,
        rangoEtario : rangoEtario == 'teen'? 'Adolescente' : ' Niño/Niña',
        quiz : quiz ? [quiz] : undefined,
        uid : id,
        user : user ? [user] : undefined,

    } */
   /*  try{
      const response : any = await this.http.post('http://localhost:9000/api/send-client',{datos}).toPromise();
      if(response){
         return Promise.resolve(true);
       }

    }
      catch{
        return Promise.resolve(false);
      } */
      return Promise.resolve(true);
  }
}



import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DeviceService } from './device.service';
@Injectable({
  providedIn: 'root'
})
export class SendmailService {

  constructor(public http: HttpClient,private storageService: StorageService, public deviceService: DeviceService) { }

  async sendForm(type: string, data: any){
    if(type =='form'){
      await this.deviceService.updateDeviceForm(data);
      this.storageService.getStorage2('device').then(value =>{
        //aca "enviaria" a la API, la idea es integrarlo tambien a envio de mails, por eso este service de sendmail
        console.log(value)
        return Promise.resolve(true);
      })
    }
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



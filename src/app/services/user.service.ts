import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Help } from '../models/Help';
import { map } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { FormService } from './form.service';
import { ToastService } from './toast.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
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
    private formService: FormService,
    private toastService: ToastService,
    private router: Router,private deviceService: DeviceService) {

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
  

}

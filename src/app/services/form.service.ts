import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FormService {
  public optionChosed: BehaviorSubject<any> = new BehaviorSubject(null);
  private url= environment.url;
  constructor(public  http: HttpClient,private storageService: StorageService) {
    this.loadSelected();
  }
  async loadSelected(){
    await this.storageService.getStorage('selected').then
    (select =>{
       if(select !=null){
         this.optionChosed.next(select);
       }
       else{
         this.optionChosed.next(null);
       }
     });
  }

 getSelectedData(){
  return this.optionChosed.asObservable();
}

async getSelected(): Promise<boolean>{
  let isData: boolean = false;
    await this.storageService.hasValue('selected').then(
      res=>{
          isData = res;
      }
    );
      if(isData){
          this.optionChosed.next(await  this.storageService.getStorage2('selected'));
          return Promise.resolve(true);
      }
      else{
         return Promise.resolve(false);
      }
  }
}

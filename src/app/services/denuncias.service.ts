import { Injectable } from '@angular/core';
import { Device } from '../Interfaces/Device';
import {User} from '../Interfaces/User';
import {Quiz} from '../Interfaces/Quiz';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { FormService } from './form.service'; 
@Injectable({
  providedIn: 'root'
})

export class DenunciasService{
    denuncia = new BehaviorSubject<any>([]);

    constructor() {

    }

    getDenuncias(){
        return this.denuncia.asObservable();
    }

    setDenuncias(denuncia){
        this.denuncia.next(denuncia);
    }

    getDenuncia(id){
        return this.denuncia.getValue().find(denuncia => denuncia.id_denuncia === id);
    }
    

}
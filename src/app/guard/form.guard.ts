import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormService } from '../services/form.service';
import { filter,map,take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FormGuard implements CanActivate {
  constructor(private formService: FormService,
    private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot){
      const expectedSelected = route.data?.expectedSelected;
    return this.formService.getSelectedData().pipe(
    filter(val => val !== null),
    take(1),
    map(selectedUser =>{
        if(!selectedUser){
          return this.router.parseUrl('/');
        }
        else{
          if(!expectedSelected || expectedSelected === selectedUser){
            return true;
          }
          else {
            return this.router.parseUrl('/');
          }
        }
    })
    );


  }
}

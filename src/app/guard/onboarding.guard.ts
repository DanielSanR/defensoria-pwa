import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, CanLoad, UrlSegment, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { filter,map,take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard implements CanActivate,CanLoad {
  constructor(private storageService: StorageService,
    private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> | boolean {
      return this.storageService.getStorage2("onboarding").then
      (valor=>{
        if(!valor){
          return true;
        }
        this.router.navigateByUrl('/');
        return false;


      }); 
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
      return   this.storageService.isOnboardingDone.pipe(
        filter(val => val !== null),
        take(1),
        map(isAuth =>{
          if(isAuth){
          return true;
          }
          this.router.navigateByUrl('/onboarding');
          return false;
        })
      );
  }
}

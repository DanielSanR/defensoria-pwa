import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import {  } from 'express';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesktopGuard implements CanActivate {
  constructor(private router: Router){}
  canActivate(): boolean {
    if (window.innerWidth >= 1024) { // Ejemplo de condición para escritorio
      this.router.navigate(['/desktop']);
      return false;
    }
    return true;
  }
  
}

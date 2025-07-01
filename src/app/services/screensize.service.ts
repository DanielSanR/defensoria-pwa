import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators'
interface IScreensizeService {
  type: 'desktop' | 'mobile' | 'tablet';
}


@Injectable({
  providedIn: 'root'
})


export class ScreensizeService {
  private isDesktop = new BehaviorSubject<IScreensizeService>({ type: 'mobile' });
  constructor() { }

  onResize(width, height){ 
    //sigamos estas reglas:
    //desktop: 1024px o más y height mayor a 768px
    //tablet: entre 768px y 1024px y height mayor a 600px
    //mobile: menos de 768px y height menor a 600px 
    if (width > 1024 && height >= 800) {
      this.isDesktop.next({ type: 'desktop' });
    } else if (width >= 768 && width <= 1024 && height >= 600) {
      this.isDesktop.next({ type: 'tablet' });
    } else {
      this.isDesktop.next({ type: 'mobile' });
    }
    console.log('Screen size changed:', this.isDesktop.value.type);
  }
 

  isDesktopView(): Observable<IScreensizeService>{
    return this.isDesktop.asObservable().pipe(distinctUntilChanged())
  }
 
}


import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError,BehaviorSubject,of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Injectable()
export class JwtInterceptor implements HttpInterceptor{
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);  
    constructor(private toastCtrl: ToastController){}


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Interceptor')
        return next.handle(request).pipe(
                catchError(err =>{
                    if(err instanceof HttpErrorResponse){
                        console.log(err)
                        switch(err.status){
                            case 400:
                                    return this.handle400Error(err);
                            case 404:
                                    return this.handle404Error(request,next);
                            case 401:
                                     return this.handle401Error(request,next);
                            case 500:
                                    return this.handle500Error(err);
                            default: 
                                    return this.otherError(err);
                        }
                    }
                    return this.otherError(err);
                })
            );
    }

 private async otherError(err){
    const toast = await this.toastCtrl.create({
        message: 'Error del lado del Servidor, intente nuevamente',
        duration: 2000,
        color:'danger'
    });
    toast.present();
 }

 private async handle500Error(err){
    const toast = await this.toastCtrl.create({
        message: 'Error del lado del Servidor, intente nuevamente más tarde.',
        duration: 2000,
        color:'danger'
    });
    toast.present();
 }

 private async handle400Error(err){
    const toast = await this.toastCtrl.create({
        message: 'Sesion finalizada dado errores de Autenticación (400)',
        duration: 2000,
        color:'danger'
    });
    toast.present();
    return of(null);
 }

 private async handle404Error(request: HttpRequest<any>, next: HttpHandler): Promise<any>{
    const toast = await this.toastCtrl.create({
        message: 'Ocurrio un error en la solicitud, vuelve a intentar nuevamente',
        duration: 2000,
        color:'danger'
    });
    toast.present();
    return of(null);
 }

 private async handle401Error(request: HttpRequest<any>, next: HttpHandler): Promise<any> {
    const  toast = await this.toastCtrl.create({
        message: 'Su Sesión expiró, favor de volver a iniciar sesión',
        duration: 2000,
        color:'danger'
    });
    toast.present();
    return of(null);
 }
}

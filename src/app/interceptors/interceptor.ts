import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError,BehaviorSubject,of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';

@Injectable()
export class Interceptor implements HttpInterceptor{
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);  
    constructor(private toastCtrl: ToastController,private toastService: ToastService){}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
                catchError(err =>{
                    if(err instanceof HttpErrorResponse){ 
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
    await this.toastService.toastError('Hubo un problema, lo intentaremos de nuevo más tarde.'); 
    return of(false);
 }

 private async handle500Error(err){
    await this.toastService.toastError('Sin conexión a internet, por favor revisa tu conexión.'); 
    return of(false);
 }

 private async handle400Error(err){
    await this.toastService.toastError('Al parecer hubo un error en la solicitud, por favor revisa tus datos.'); 
    return of(false);
 }

 private async handle404Error(request: HttpRequest<any>, next: HttpHandler): Promise<any>{
    await this.toastService.toastError('No se encontró la ruta solicitada.'); 
    return of(false);
 }

 private async handle401Error(request: HttpRequest<any>, next: HttpHandler): Promise<any> {
    await this.toastService.toastError('Error de Autenticación (401)'); 
    return of(false);
 }
}

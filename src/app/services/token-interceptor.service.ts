import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // throw new Error('Method not implemented.');

    // let token = 'e3eb581adb24fc310ffa4743b41afde3341ae9fc';
    // let jwttoken = req.clone({
    //   setHeaders: {
    //     Authorization: token
    //   }
    // })
    // return next.handle(jwttoken);

    let token = localStorage.getItem('id_token');
    let jwttoken = req.clone({
      setHeaders: {
        Authorization: 'bearer ' + token,
      }
    })
    return next.handle(jwttoken);
  }
}

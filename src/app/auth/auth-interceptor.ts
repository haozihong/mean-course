import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

// if we want to inject something, this class has to be injectable, too
@Injectable()
// like a middleware for all outgoing http request
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    // should not directly edit outgoing request, otherwise this will cause
    // unwanted side effects and problems due to the way requests work
    // internally and handled internally
    const authRequest = req.clone({
      // Authorization: name here is case insensitive
      headers: req.headers.set('Authorization', "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }

}

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ErrorComponent } from './error/error.component';

@Injectable()
// like a middleware for all outgoing http request
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // we are caring about the response, so pipe() a function here for response
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = error.error.message || 'An unknown error occurred!';
        this.dialog.open(ErrorComponent, { data: { message: errorMessage } });
        // pass through the error to allow the rest of app to process it
        return throwError(error);
      })
    );
  }

}

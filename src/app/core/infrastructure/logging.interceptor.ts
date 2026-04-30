import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const location = isPlatformBrowser(platformId) ? 'BROWSER' : 'SERVER';
  const started = Date.now();

  //console.log(`[${location}] >> REQUEST: ${req.method} ${req.url}`);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          //console.log(`[${location}] << RESPONSE: ${req.url} - Status ${event.status} (${elapsed}ms)`);
        }
      },
      error: (error: HttpErrorResponse) => {
        const elapsed = Date.now() - started;
        console.error(`[${location}] !! ERROR: ${req.url} - Status ${error.status} (${elapsed}ms)`);
        console.error(`[${location}] !! MESSAGE: ${error.message}`);
      }
    }),
    catchError((error) => {
      // Re-throw so the service can still handle it
      return throwError(() => error);
    })
  );
};
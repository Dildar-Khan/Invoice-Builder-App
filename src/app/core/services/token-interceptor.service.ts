import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { JwtService } from './jwt.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
    constructor(private jwtService: JwtService, private router: Router) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const headersConfig = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
        const token = this.jwtService.getToken();
        if (token) {
            // tslint:disable-next-line: no-string-literal
            headersConfig['Authorization'] = `bearer ${token}`;
        }
        const authReq = req.clone({ setHeaders: headersConfig });
        return next.handle(authReq).pipe(
            tap(
                (event: HttpEvent<any>) => {},
                err => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
                            this.jwtService.destroyToken();
                            this.router.navigate(['/login']);
                        }
                    }
                }
            )
        );
    }
}

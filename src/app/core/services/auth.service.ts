import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, LoginRsp, SignupRsp, LogoutRsp } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private httpClient: HttpClient) {}

    login(body: User): Observable<LoginRsp> {
        return this.httpClient.post<LoginRsp>(
            environment.api_url + '/users/login',
            body
        );
    }

    signup(body: User): Observable<SignupRsp> {
        return this.httpClient.post<SignupRsp>(
            environment.api_url + '/users/signup',
            body
        );
    }

    googleAuth(): Observable<LoginRsp> {
        return this.httpClient.get<LoginRsp>(
            environment.api_url + '/auth/google'
        );
    }

    isAuthenticated(token): Observable<boolean> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `bearer ${token}`,
            }),
        };
        return this.httpClient.get<boolean>(
            environment.api_url + '/auth/authenticate',
            httpOptions
        );
    }

    logout(): Observable<LogoutRsp> {
        return this.httpClient.get<LogoutRsp>(
            environment.api_url + '/auth/logout'
        );
    }

    forgotPassword(data: { email: string }): Observable<{ message: string }> {
        return this.httpClient.post<{ message: string }>(
            environment.api_url + '/users/forgotpassword',
            data
        );
    }

    resetPassword(body): Observable<{ success: boolean }> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `bearer ${body.token}`,
            }),
        };
        return this.httpClient.put<{ success: boolean }>(
            environment.api_url + '/users/resetpassword',
            { password: body.password },
            httpOptions
        );
    }
}

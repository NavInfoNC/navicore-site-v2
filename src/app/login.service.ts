import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Subscription, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    loginSucceeded = false;
    username = '';

    loginRequest: Subscription;

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {
        this.syncWithCookie();
    }

    login<T>(username: string, password: string): Observable<T> {
        let observable = new Observable<T>((observer) => {
            // post form data
            const params = new HttpParams()
                .set("username", username)
                .set("password", password);
            this.loginRequest = this.http.post<any>('api/login', params).subscribe(
                {
                    next: value => {
                        console.log(value);
                        if (value.code == 0) {
                            this.username = username;
                            this.loginSucceeded = true;
                            this.loginRequest = undefined;
                            observer.next(value);
                        } else {
                            observer.error(value.msg);
                        }
                        this.syncWithCookie();
                    },
                    error: err => {
                        observer.error(err.errorMessage);
                        this.loginRequest = undefined;
                        this.syncWithCookie();
                    }
                }
            );

            return {
                unsubscribe() {
                    if (this.loginRequest) {
                        this.loginRequest.unsubscribe();
                    }
                }
            };
        });

        return observable;
    }

    logout() {
        this.loginSucceeded = false;
        this.username = '';
    }

    syncWithCookie() {
        this.username = this.cookieService.get('Name');
        this.loginSucceeded = this.username != '';
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})

export class UserService {


    /**
     * Constructor
     */
    user: any;
    _user: BehaviorSubject<any> = new BehaviorSubject({});
    get user$(): Observable<any>{
        return this._user.asObservable();
    }
    constructor(
        private _authService: AuthService
    ) {
        if (this._authService.user) {
            this.user = this._authService.user;
            this._user.next(this._authService.user);
            return ;
        }
        this.getUser();
    }
    getUser(){
        this._authService.getUser().subscribe((user)=>{
            this.user = user;
            this._user.next(user);
        });
    }


    getAllUsers(query:any){}
}

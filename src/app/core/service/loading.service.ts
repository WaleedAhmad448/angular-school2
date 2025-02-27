import {Injectable} from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public loading = false;
  public forceStop = false;
  _loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  _forceStop: BehaviorSubject<boolean> = new BehaviorSubject(false);
  get loading$(): Observable<boolean>{
    return this._loading.asObservable();
  }
  get forceStop$(): Observable<boolean>{
    return this._forceStop.asObservable();
  }
  constructor() { }
}

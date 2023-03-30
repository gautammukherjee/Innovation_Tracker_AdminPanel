import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import * as moment from "moment";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
@Injectable({
  providedIn: 'root'
})

export class TasService {

  private SERVER_URL: string = environment.SERVER_URL;

  constructor(private _http: HttpClient) { }

  getTasLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getTasLists', httpOptions);
  }

  getTasListsNotExistRl(id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'getTasListsNotExistRl/' + id, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  getTasListsExistRl(id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'getTasListsExistRl/' + id, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

}

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

export class MoasService {
  static deleteMoas(moa_id: any) {
    throw new Error('Method not implemented.');
  }
  private SERVER_URL: string = environment.SERVER_URL;

  constructor(private _http: HttpClient) { }

  getBackendMoasLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getBackendMoasLists', httpOptions);
  }

  addMoas(data: any) {
    return this._http.post(this.SERVER_URL + 'addMoas', data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  updateMoas(data: any, id: number) {
    return this._http.put<any>(this.SERVER_URL + 'updateMoas/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  deleteMoas(id) {
    return this._http.put(this.SERVER_URL + 'deleteMoas/' + id, httpOptions).pipe(map((res: any) => {
      //return res;
    }));
  }

  getMoaListsNotExistRl(id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'getMoaListsNotExistRl/' + id, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  getMoaListsExistRl(id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'getMoaListsExistRl/' + id, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

}

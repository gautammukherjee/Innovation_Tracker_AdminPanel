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

export class DiseasesService {

  private SERVER_URL: string = environment.SERVER_URL;

  constructor(private _http: HttpClient) { }

  getDiseasesLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getDiseasesLists', httpOptions);
  }

  addDiseases(data: any) {
    return this._http.post(this.SERVER_URL + 'addDiseases', data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  updateDiseases(data: any, id: number) {
    return this._http.put<any>(this.SERVER_URL + 'updateDiseases/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  deleteDiseases(id) {
    return this._http.put(this.SERVER_URL + 'deleteDiseases/' + id, httpOptions).pipe(map((res: any) => {
      //return res;
    }));
  }


  //For Disease Synonms
  getDiseaseSynLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getDiseaseSynLists', httpOptions);
  }

  addDiseaseSyn(data: any) {
    return this._http.post(this.SERVER_URL + 'addDiseaseSyn', data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  updateDiseaseSyn(data: any, id: number) {
    return this._http.put<any>(this.SERVER_URL + 'updateDiseaseSyn/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  deleteDiseaseSyn(id) {
    return this._http.put(this.SERVER_URL + 'deleteDiseaseSyn/' + id, httpOptions).pipe(map((res: any) => {
      //return res;
    }));
  }
}

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

export class DrugsService {

  private SERVER_URL: string = environment.SERVER_URL;

  constructor(private _http: HttpClient) { }

  getDrugsLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getDrugsLists', httpOptions);
  }

  addDrugs(data: any) {
    return this._http.post(this.SERVER_URL + 'addDrugs', data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  updateDrugs(data: any, id: number) {
    return this._http.put<any>(this.SERVER_URL + 'updateDrugs/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  deleteDrugs(id) {
    return this._http.put(this.SERVER_URL + 'deleteDrugs/' + id, httpOptions).pipe(map((res: any) => {
      //return res;
    }));
  }

  //For Drug Synonms
  getDrugSynLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getDrugSynLists', httpOptions);
  }

  addDrugSyn(data: any) {
    return this._http.post(this.SERVER_URL + 'addDrugSyn', data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  updateDrugSyn(data: any, id: number) {
    return this._http.put<any>(this.SERVER_URL + 'updateDrugSyn/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  deleteDrugSyn(id) {
    return this._http.put(this.SERVER_URL + 'deleteDrugSyn/' + id, httpOptions).pipe(map((res: any) => {
      //return res;
    }));
  }
}

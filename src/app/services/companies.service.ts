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

export class CompaniesService {

  private SERVER_URL: string = environment.SERVER_URL;

  constructor(private _http: HttpClient) { }

  getCompaniesTypes(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getCompaniesTypes', httpOptions);
  }

  getCompaniesLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getCompaniesLists', httpOptions);
  }

  addCompanies(data: any) {
    return this._http.post(this.SERVER_URL + 'addCompanies', data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  updateCompanies(data: any, id: number) {
    return this._http.put<any>(this.SERVER_URL + 'updateCompanies/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  deleteCompanies(id) {
    return this._http.put(this.SERVER_URL + 'deleteCompanies/' + id, httpOptions).pipe(map((res: any) => {
      //return res;
    }));
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
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

  getCompaniesLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getCompaniesLists', httpOptions);
  }
}

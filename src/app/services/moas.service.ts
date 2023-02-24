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

export class MoasService {

  private SERVER_URL: string = environment.SERVER_URL;

  constructor(private _http: HttpClient) { }

  getMoasLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getMoasLists', httpOptions);
  }
}

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

export class NewsService {

  private SERVER_URL: string = environment.SERVER_URL;

  constructor(private _http: HttpClient) { }

  getNewsletterLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getNewsletterLists', httpOptions);
  }

  addNewsletter(data: any) {
    return this._http.post(this.SERVER_URL + 'addNewsletter', data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  updateNewsletter(data: any, id: number) {
    return this._http.put<any>(this.SERVER_URL + 'updateNewsletter/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  trashNewsletter(id) {
    return this._http.put(this.SERVER_URL + 'trashNewsletter/' + id, httpOptions).pipe(map((res: any) => {
      //return res;
    }));
  }

  deleteNewsletter(id) {
    return this._http.delete(this.SERVER_URL + 'deleteNewsletter/' + id, httpOptions).pipe(map((res: any) => {
      //return res;
    }));
  }

  approveNewsletter(data: any) {
    return this._http.post<any>(this.SERVER_URL + 'approveNewsletter', data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  //Approved News
  getApproveNewsletterLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getApproveNewsletterLists', httpOptions);
  }

  //Disapproved News
  getDisapprovedNewsList(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getApproveNewsletterLists', httpOptions);
  }

}

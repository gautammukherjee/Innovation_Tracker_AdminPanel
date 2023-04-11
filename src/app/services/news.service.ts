import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import * as moment from "moment";

let auth_token = "e3eb581adb24fc310ffa4743b41afde3341ae9fc";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})

export class NewsService {

  private SERVER_URL: string = environment.SERVER_URL;
  private SERVER_URL_OTHER: string = "http://150.136.91.243:8886/";
  // private SERVER_URL_OTHER: string = "https://fitroz.in/getBrandNameLists/";



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

  // trashNewsletter(id) {
  //   return this._http.put(this.SERVER_URL + 'trashNewsletter/' + id, httpOptions).pipe(map((res: any) => {
  //     //return res;
  //   }));
  // }

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

  disapproveNewsletter(data: any) {
    return this._http.post<any>(this.SERVER_URL + 'disapproveNewsletter', data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  //Approved News
  getApproveNewsletterLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getApproveNewsletterLists', httpOptions);
  }

  //Pending News
  getPendingNewsletterLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getPendingNewsletterLists', httpOptions);
  }

  //Show comments on News
  getCommentsNewsletter(newsId): Observable<any> {
    return this._http.post(this.SERVER_URL + 'getCommentsNewsletter/' + newsId, httpOptions);
  }

  //Pending News
  pendingNewsletter(data: any, id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'pendingNewsletter/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  //1. Save News TA Relations
  saveNewsTaRl(data: any, id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'saveNewsTaRl/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  //2. Save News Disease Relations
  saveNewsDiseaseRl(data: any, id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'saveNewsDiseaseRl/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  //3. Save News Drug Relations
  saveNewsDrugRl(data: any, id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'saveNewsDrugRl/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  //4. Save News Company Relations
  saveNewsCompanyRl(data: any, id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'saveNewsCompanyRl/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  //5. Save News Gene Relations
  saveNewsGeneRl(data: any, id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'saveNewsGeneRl/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  //5. Save News Moa Relations
  saveNewsMoaRl(data: any, id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'saveNewsMoaRl/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }


  //////// Add Suggestion //////////////////
  getCuratedUncuratedData(data: any): Observable<any> {

    // const headers2 = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: `OAuth2.0 ${auth_token}`,
    // });

    // let header = new HttpHeaders().set(
    //   "Authorization",
    //   localStorage.getItem("e3eb581adb24fc310ffa4743b41afde3341ae9fc")
    // );

    // const headers2 = new HttpHeaders().set('Authorization', `OAuth2.0 ${auth_token}`);

    // const token = "e3eb581adb24fc310ffa4743b41afde3341ae9fc";
    // const header = new Headers({ 'Authorization': `bearer ${token}` });
    // const options: any = {
    //   headers: header,
    // };

    console.log("data: ", data);
    return this._http.post(this.SERVER_URL_OTHER + 'get_named_entities_news/', data);
  }


}

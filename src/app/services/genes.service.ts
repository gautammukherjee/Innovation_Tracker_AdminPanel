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

export class GenesService {
  static deleteGenes(gene_id: any) {
    throw new Error('Method not implemented.');
  }

  private SERVER_URL: string = environment.SERVER_URL;

  constructor(private _http: HttpClient) { }

  getBackendGenesLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getBackendGenesLists', httpOptions);
  }

  addGenes(data: any) {
    return this._http.post(this.SERVER_URL + 'addGenes', data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  updateGenes(data: any, id: number) {
    return this._http.put<any>(this.SERVER_URL + 'updateGenes/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  deleteGenes(id) {
    return this._http.put(this.SERVER_URL + 'deleteGenes/' + id, httpOptions).pipe(map((res: any) => {
      //return res;
    }));
  }

  //For Gene Synonms
  getGeneSynLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getGeneSynLists', httpOptions);
  }

  addGeneSyn(data: any) {
    return this._http.post(this.SERVER_URL + 'addGeneSyn', data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  updateGeneSyn(data: any, id: number) {
    return this._http.put<any>(this.SERVER_URL + 'updateGeneSyn/' + id, data, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  deleteGeneSyn(id) {
    return this._http.put(this.SERVER_URL + 'deleteGeneSyn/' + id, httpOptions).pipe(map((res: any) => {
      //return res;
    }));
  }

  getGeneListsNotExistRl(id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'getGeneListsNotExistRl/' + id, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

  getGeneListsExistRl(id: number): Observable<any> {
    return this._http.post<any>(this.SERVER_URL + 'getGeneListsExistRl/' + id, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }

}

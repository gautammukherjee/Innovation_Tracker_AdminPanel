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

  getGenesLists(): Observable<any> {
    return this._http.get(this.SERVER_URL + 'getGenesLists', httpOptions);
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

}

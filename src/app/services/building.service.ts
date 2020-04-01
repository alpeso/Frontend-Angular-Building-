import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { BuildingModel } from '../models/Building';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  API_URI = Global.url;

  constructor(
    private http: HttpClient
  ) {}


  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  saveBuildin(subject: BuildingModel): Observable<any> {
		const params = JSON.stringify(subject);
		return this.http.post(`${this.API_URI}buildings`, params, {headers: this.headers});
  }

  
  getSubjects(){
    return this.http.get(`${this.API_URI}buildings`, {headers: this.headers});
  }

  getSubject(id: string) {
    return this.http.get(`${this.API_URI}buildings/${id}`);
  }

  update(id: string|number, update: BuildingModel): Observable<BuildingModel> {
    const params = JSON.stringify(update);
    return this.http.put(`${this.API_URI}buildings/${id}`, params, {headers: this.headers});
  }

  delete(id: string) {
    return this.http.delete(`${this.API_URI}buildings/${id}`);
  }

}

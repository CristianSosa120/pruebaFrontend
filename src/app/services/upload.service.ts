import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  getParamsHeader(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'multipart/form-data'
    });
  }

  uploadData(data:any){
    const BODY = data;
    
    console.log(data)
    return this.http.post<any>(`${environment.apiUrl}/upload-file`, BODY).pipe(map(response => {
        return response;
      })
    );
  }

}

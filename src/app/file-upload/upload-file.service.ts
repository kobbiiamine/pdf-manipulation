import { Injectable } from '@angular/core';
import {HttpClient, HttpRequest, HttpEvent, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }

  insertImageToPdf(x: number, y: number, page: number, imageName: string , pdfName: string ) {
    let params = new HttpParams().set('x',x).set('y',y).set('page',page).set('imageName',imageName)
      .set('pdfName',pdfName);
    this.http.get(`${this.baseUrl}/pdf-image`,{params: params,responseType: 'arraybuffer'},).subscribe(
      (response) =>{

        var blob = new Blob([response], {type: "application/pdf;charset=utf-8"});
        saveAs(blob, "attachedFile.pdf")}
    ); }
}

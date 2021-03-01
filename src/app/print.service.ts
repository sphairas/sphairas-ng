import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private http: HttpClient) { }

  public async print(data: any, type: string) {
    //var tabWindowId = window.open("about: blank", "_blank");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'
    });
    this.http.post<Blob>('http://localhost:8080/sphairas-printing/pdf/' + type + '/', data, { headers: headers, responseType: 'blob' as 'json' })
      .subscribe(res => {
        const fileURL = URL.createObjectURL(res);
        let tab = window.open(fileURL, '_blank');
        //setTimeout(function () {
        //  tab.document.title = "downlaod.pdf";
        //}, 10);
        //var a = document.createElement("a");
        //a.hidden = true;
        //a.target = "_blank";
        //a.href = fileURL;
        //a.download = 'xxxxx.pdf';
        //a.click();
        //URL.revokeObjectURL(fileURL);
        //document.removeChild(a);
      });
  }

}

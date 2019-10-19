import { Injectable } from '@angular/core';

import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VisionUploadService {

  constructor(private http: HttpClient) { }

  private toBase64 = file => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.toString());
    reader.onerror = error => reject(error);
  })

  callGoogleVisionAPI(file: File): Observable<any> {
    return from(
      this.toBase64(file)
    ).pipe(
      map( x => x.replace('data:image/png;base64,', '')),
      switchMap(
        x => this.http.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBAVplBStIm8ZLRjgkV0Dzr8TxFYR2m6vA',{
          requests: [
            {
              image: {
                content: x
              },
              features: [
                {
                  type: 'DOCUMENT_TEXT_DETECTION'
                }
              ]
            }
          ]
        })
      )


    );

  }


}

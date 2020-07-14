import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

@Injectable()
export class apiProfile
{

    constructor (private httpclient: HttpClient) { }

    getProfile(): Observable<any> {
        return this.httpclient.get('https://greenbackend.herokuapp.com/api/devices/')
    }

    getInfo(deviceID): Observable<any> {
        return this.httpclient.get('https://greenbackend.herokuapp.com/api/devices/' + deviceID)
    }

    getMess(deviceID): Observable<any> {
      return this.httpclient.get('https://greenbackend.herokuapp.com/api/devices/' + deviceID + '/message')
    }

    createDv(postDv)
    {
        return this.httpclient.post<any>('https://greenbackend.herokuapp.com/api/devices/', postDv);
    }

    delete(deviceID){
        return this.httpclient.delete('https://greenbackend.herokuapp.com/api/devices/'+ deviceID)
        .pipe(map
            (data => {data}
        ))
    }

    deleteMess(dataDel, deviceID){
      console.log('Loz', dataDel, deviceID)
      return this.httpclient.post<any>('https://greenbackend.herokuapp.com/api/devices/' + deviceID + '/message', dataDel);
  }

    putDv(postDv, deviceID)
    {
        return this.httpclient.put<any>('https://greenbackend.herokuapp.com/api/devices/'+ deviceID , postDv);
    }
}

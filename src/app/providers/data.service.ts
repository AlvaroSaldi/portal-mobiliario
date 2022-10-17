import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private URL_SERVER_API='http://localhost:7000';
//   private URL_SERVER_API='https://api-maletines-dev-cmpg3q2w.ue.gateway.dev/';
  private URL_DOWNLOAD_SERVER='https://demos.capturactiva.cl/memorial/assets/images/'
  
  //https://api-maletines-dev-cmpg3q2w.ue.gateway.dev/api/v1/authenticate
  constructor(    
    private _http: HttpClient,
  ) { }

  getTokenSession(): Promise<any>{
    const authRecord={key: new Date().toDateString()}

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json');
    let options = { headers: headers };

    return new Promise((resolve, reject) => {
      this._http.post(`${this.URL_SERVER_API}/api/v1/gettokensession`, authRecord, options)
      .subscribe(
        data => {resolve(data);},
        error => {reject(this.handleError(error))}
      );      
    });
  }

  setCredential(usrmail, password){
    return new Promise((resolve, reject) => {
        const headers = new  HttpHeaders({
            'Content-Type': 'application/json',
        })        

        this._http.get(`${this.URL_SERVER_API}/api/v1/authenticate?usrmail=${usrmail}`, { headers: headers })
            .subscribe(
                data => {resolve(data);},
                error => {reject(this.handleError(error, true))}
        );
    })

  }

  getUserByMail(usrmail:string): Promise<any>{
    return new Promise((resolve, reject) => {
        const headers = new  HttpHeaders({
            'Content-Type': 'application/json',
        })        

        this._http.get(`${this.URL_SERVER_API}/api/v1/usermail?usrmail=${usrmail}`, { headers: headers })
            .subscribe(
                data => {resolve(data);},
                error => {reject(this.handleError(error, true))}
        );
    })
}

  private handleError(error: any, isSession=false) {
    console.log("error:", error)
    if(error.status == 401){
      // this.reConnect(isSession);
    }
    else{
      if(error.error.error===undefined){
        // console.log("error.error.error==undefined")
        return {error:500, logical:true}
      }else{
        const errores=error.error.error;
        return {error:500, logical:errores.errno==1062 ? true : false, description:errores.sqlMessage}
      }
    }
  }

 
}

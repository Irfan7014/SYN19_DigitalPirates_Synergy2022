import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginComponent } from '../login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AllServiceService {
  isLoggedIn: boolean = false;
  accessToken:string = "";
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {}
  login(username:number, password:string){
    var url = environment.SERVER_BASE_URL+"api/v1/token"
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post(url, body.toString(), {
      headers: new HttpHeaders().set(
        'Content-Type',
        'application/x-www-form-urlencoded'
      ),
      observe: 'response',
    });
  }
  saveTokenToLocalstorage(data: Object, username: string, password: string) {
    var dataToPut = JSON.parse(JSON.stringify(data));
    localStorage.setItem('TranscriptLoggedIn', 'true');
    localStorage.setItem('TranscriptPass', password);
    localStorage.setItem('TranscriptUsername', username);
    localStorage.setItem(
      'TranscriptAccessToken',
      'Bearer ' + dataToPut['access_token']
    );
    localStorage.setItem('TranscriptRefreshToken', dataToPut['refresh_token']);
  }
  async fetchUserDetails(accessToken:string){
    if(typeof accessToken !== 'undefined'){
      accessToken = this.storeAuthTokens();
    }
    await this.http
      .get(environment.SERVER_BASE_URL + 'api/v1/getUser', {
        headers: new HttpHeaders()
          .set('accept', 'application/json')
          .set('Authorization', accessToken),
        observe: 'response',
      })
      .subscribe(
        (res) => {
          var dataToPut = JSON.parse(JSON.stringify(res.body));
          if (dataToPut['verified'] == true) {
            localStorage.setItem('TranscriptName', dataToPut['name']);
            localStorage.setItem('TranscriptGender', dataToPut['gender']);
            localStorage.setItem('TranscriptPhone', dataToPut['phone']);
            localStorage.setItem('TranscriptEmail', dataToPut['email']);
            localStorage.setItem('TranscriptRole', dataToPut['role']);
            localStorage.setItem('TranscriptPass', dataToPut['password']);
            localStorage.setItem('TranscriptVerified', dataToPut['verified']);
            localStorage.setItem('TranscriptUsername', dataToPut['userid']);
            localStorage.setItem('Transcript_id', dataToPut['_id']);
            localStorage.setItem('TranscriptBranch', dataToPut['branch']);
            localStorage.setItem('TranscriptJoin', dataToPut['joining']);
          }
        },
        (err) => {
          this.showSnackBar('Cannot fetch your details! Try again')
        }
      );
  }

  storeAuthTokens(): string {
    var url = environment.SERVER_BASE_URL + 'api/v1/token';
    var username = localStorage.getItem('TranscriptUsername')!;
    var password = localStorage.getItem('TranscriptPass')!;
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    this.http
      .post(url, body.toString(), {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
        observe: 'response',
      })
      .subscribe(
        (res) => {
          if (res.status == 200) {
            if(localStorage.getItem('TranscriptUsername')==null || localStorage.getItem('TranscriptUsername')==undefined){
              var dataToPut = JSON.parse(JSON.stringify(res.body));
              localStorage.setItem('TranscriptLoggedIn', 'true');
              localStorage.setItem('TranscriptPass', password);
              localStorage.setItem('TranscriptUsername', username);
              localStorage.setItem(
                'TranscriptAccessToken',
                'Bearer ' + dataToPut['access_token']
              );
              localStorage.setItem('TranscriptRefreshToken', dataToPut['refresh_token']);
            }
        }
          return null;
        },
        (err) => {
          this.showSnackBar('Session Timed Out! Login again');
          return null;
        }
      );
    return localStorage.getItem('TranscriptAccessToken')!;
  }

  applyForTranscript(
    docs: File[],
    requiredDocumentsName: string[],
    comment: string="",
    copies:number=0,
    cgpa: string
  ): Observable<any> {

    this.accessToken = localStorage.getItem('TranscriptAccessToken')!;
    let formData = new FormData();
    formData.append('cgpa', cgpa);
    console.log(docs.length);
    console.log(requiredDocumentsName);
    for (let file of docs) {
      formData.append('requiredDocumentsFile', file);
    }
    for (let name of requiredDocumentsName) {
      formData.append('requiredDocumentsName', name);
    }
    formData.append('copies', copies.toString());
    formData.append('comment', comment);
    console.log(formData.getAll('requiredDocumentsName'));
    console.log(formData.getAll('copies'));
    console.log(formData.getAll('cgpa'));
    console.log(formData.getAll('comment'));
    console.log(formData.getAll('requiredDocumentsFile'));
    console.log(formData);

    return this.http.post(
      environment.SERVER_BASE_URL + 'api/v1/newApplication',
      formData,
      {
        headers: new HttpHeaders()
          .set('accept', 'application/json')
          .set('Authorization', this.accessToken ? this.accessToken : ''),
      }
    );
  }


  showSnackBar(message:string){
    this.snackBar.open(message, 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 4000,
    });
  }



}

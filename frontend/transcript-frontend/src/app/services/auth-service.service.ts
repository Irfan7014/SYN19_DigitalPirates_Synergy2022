import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { LoginComponent } from '../login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  isLoggedIn: boolean = false;
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
    localStorage.setItem('TrasncriptRefreshToken', dataToPut['refresh_token']);
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
            localStorage.setItem('TrasncriptName', dataToPut['name']);
            localStorage.setItem('TrasncriptGender', dataToPut['gender']);
            localStorage.setItem('TrasncriptPhone', dataToPut['phone']);
            localStorage.setItem('TrasncriptEmail', dataToPut['email']);
            localStorage.setItem('TrasncriptRole', dataToPut['role']);
            localStorage.setItem('TrasncriptPass', dataToPut['password']);
            localStorage.setItem('TrasncriptVerified', dataToPut['verified']);
            localStorage.setItem('TrasncriptUsername', dataToPut['userid']);
            localStorage.setItem('Trasncript_id', dataToPut['_id']);
            localStorage.setItem('TrasncriptBranch', dataToPut['branch']);
            localStorage.setItem('TrasncriptJoin', dataToPut['joining']);
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

  showSnackBar(message:string){
    this.snackBar.open(message, 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 4000,
    });
  }
}

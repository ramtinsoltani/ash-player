import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import config from '@ash-player/config';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionStaticSignal, SessionTimeSignal } from '@ash-player/model/database';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(
    private http: HttpClient
  ) { }

  private path(pathname: string) {

    return `${config.serverUrl.replace(/\/$/, '')}/${pathname.replace(/^\//, '')}`;

  }

  private authorization(token: string) {

    return { headers: { Authorization: `Bearer ${token}` } };

  }

  private get errorHandler() {

    return catchError((error: HttpErrorResponse) => {

      if ( error.error instanceof ErrorEvent ) {

        return throwError(`Client Error: ${error.error.message}`);

      }
      else {

        if ( error.error.code === 'VALIDATION_FAILED' ) {

          return throwError({ status: error.status, message: 'Invalid request!', originalMessage: error.error.message, code: error.error.code });

        }

        return throwError({ status: error.status, message: error.error.message, code: error.error.code });

      }

    });

  }

  private post<T=MessageResponse>(pathname: string, token: string, body?: any) {

    return this.http.post<T>(this.path(pathname), body, {
      ...this.authorization(token),
      responseType: 'json',
      observe: 'body'
    })
    .pipe<any>(this.errorHandler)
    .toPromise<T>();

  }

  private delete<T=MessageResponse>(pathname: string, token: string, body?: any) {

    return this.http.request<T>('delete', this.path(pathname), {
      ...this.authorization(token),
      body,
      responseType: 'json',
      observe: 'body'
    })
    .pipe<any>(this.errorHandler)
    .toPromise<T>();

  }

  public registerUser(token: string, name: string) {

    return this.post('/user/register', token, { name });

  }

  public updateUserStatus(token: string) {

    return this.post('/user/status', token);

  }

  public inviteUser(token: string, user: string, session: string) {

    return this.post('/user/invite', token, { user, session });

  }

  public acceptUserInvite(token: string, id: string) {

    return this.post('/user/invite/accept', token, { id });

  }

  public rejectUserInvite(token: string, id: string) {

    return this.post('/user/invite/reject', token, { id });

  }

  public deleteUser(token: string) {

    return this.delete('/user', token);

  }

  public addContact(token: string, email: string) {

    return this.post('/db/contacts', token, { email });

  }

  public deleteContact(token: string, uid: string) {

    return this.delete('/db/contacts', token, { uid });

  }

  public createSession(token: string, targetLength: number) {

    return this.post<SessionIdResponse>('/session/create', token, { targetLength });

  }

  public updateSession(token: string, session: string, targetLength: number) {

    return this.post<SessionMemberStatusResponse>('/session/update', token, { session, targetLength });

  }

  public sendSessionSignal(token: string, session: string, signal: SessionStaticSignal|SessionTimeSignal) {

    return this.post('/session/signal', token, { session, signal });

  }

}

export interface MessageResponse {
  message: string;
}

export interface SessionIdResponse {
  id: string;
}

export interface SessionMemberStatusResponse {
  status: 'ready'|'mismatch';
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebaseCert from '@ash-player/firebase-cert';
import { ContactsList, UserWithUID } from '@ash-player/model/database';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { cloneDeep } from 'lodash';

type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private _currentUser: UserWithUID = null;
  private _newUser: boolean = false;

  constructor(
    private router: Router
  ) {

    firebase.initializeApp(firebaseCert);

    firebase.auth().onAuthStateChanged(user => {

      if ( ! user ) {

        this.updateCurrentUser()
        .then(() => this.router.navigate(['/auth']))
        .catch(error => console.error(error));;

      }
      else {

        // If user was just registered, the user document might not be written yet
        if ( this._newUser ) return;

        this.updateCurrentUser()
        .then(() => this.router.navigate(['/home']))
        .catch(error => console.error(error));

      }

    });

  }

  public get currentUser() { return cloneDeep(this._currentUser); }

  public async updateCurrentUser() {

    if ( ! firebase.auth().currentUser ) {

      this._currentUser = null;
      return;

    }

    this._currentUser = await this.getUser(firebase.auth().currentUser.uid);
    this._newUser = false;

  }

  public async registerUser(email: string, password: string) {

    this._newUser = true;

    await firebase.auth().createUserWithEmailAndPassword(email, password);

  }

  public async login(email: string, password: string) {

    await firebase.auth().signInWithEmailAndPassword(email, password);

  }

  public async logout() {

    await firebase.auth().signOut();
    await this.updateCurrentUser();

  }

  public async resetPassword(email: string) {

    await firebase.auth().sendPasswordResetEmail(email);

  }

  public async getToken() {

    if ( ! firebase.auth().currentUser ) return null;

    return await firebase.auth().currentUser.getIdToken();

  }

  public async refreshUser() {

    await firebase.auth().currentUser?.reload();

  }

  public getContacts() {

    return new Observable<ContactsList>(observer => {

      const unsubscribe = firebase.firestore()
      .collection('contacts')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot(
        (doc: DocumentSnapshot<ContactsList>) => observer.next(doc.data()),
        observer.error
      );

      // On unsubscribe
      observer.add(unsubscribe);

    });

  }

  public async getUser(uid: string) {

    try {

      const user = await firebase.firestore().collection('users').doc(uid).get();

      if ( ! user.exists ) throw new Error('User does not exist!');

      return { ...user.data(), uid } as UserWithUID;

    }
    catch (error) {

      throw error;

    }

  }

}

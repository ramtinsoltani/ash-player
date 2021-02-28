import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import firebaseCert from '@ash-player/firebase-cert';
import { ContactsList, User } from '@ash-player/model/database';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { cloneDeep } from 'lodash';

type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private _currentUser: User = null;

  constructor(
    private router: Router
  ) {

    firebase.initializeApp(firebaseCert);

    firebase.auth().onAuthStateChanged(user => {

      if ( ! user ) this.router.navigate(['/auth']);
      else {

        this.getCurrentUser()
        .then(user => {

          this._currentUser = user;
          this.router.navigate(['/home']);

        })
        .catch(error => console.error(error));

      }

    });

  }

  private async getCurrentUser() {

    if ( ! firebase.auth().currentUser ) return null;

    const userDoc = await firebase.firestore()
    .collection('users')
    .doc(firebase.auth().currentUser.uid)
    .get();

    if ( ! userDoc.exists ) throw new Error('User does not exist!');

    return userDoc.data() as User;

  }

  public get currentUser() { return cloneDeep(this._currentUser); }

  public async registerUser(email: string, password: string) {

    await firebase.auth().createUserWithEmailAndPassword(email, password);

  }

  public async login(email: string, password: string) {

    await firebase.auth().signInWithEmailAndPassword(email, password);

  }

  public async logout() {

    await firebase.auth().signOut();

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
      observer.add(() => {

        console.log('Unsubscribed')
        unsubscribe();

      });

    });

  }

  public async getUser(uid: string) {

    try {

      const user = await firebase.firestore().collection('users').doc(uid).get();

      return user.data() as User;

    }
    catch (error) {

      throw error;

    }

  }

}

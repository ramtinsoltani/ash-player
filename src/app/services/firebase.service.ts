import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import firebaseCert from '@ash-player/firebase-cert';
import { ContactsList, User, Invitation, Session } from '@ash-player/model/database';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { cloneDeep } from 'lodash-es';

type DocumentSnapshot<T> = firebase.firestore.DocumentSnapshot<T>;
type QuerySnapshot<T> = firebase.firestore.QuerySnapshot<T>;

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private _currentUser: User = null;
  private _newUser: boolean = false;
  private _onFullAuthStateChanged$ = new Subject<User>();

  constructor() {

    firebase.initializeApp(firebaseCert);

    firebase.auth().onAuthStateChanged(() => {

      // If user was just registered, the user document might not be written yet
      if ( this._newUser ) return;

      this.updateCurrentUser()
      .catch(error => console.error(error));

    });

  }

  public onFullAuthStateChanged(observer: (user: User) => void) {

    return this._onFullAuthStateChanged$.subscribe(observer);

  }

  public get currentUser() { return cloneDeep(this._currentUser); }

  public async updateCurrentUser() {

    if ( ! firebase.auth().currentUser ) {

      this._currentUser = null;
      this._onFullAuthStateChanged$.next(null);
      return;

    }

    this._currentUser = await this.getUser(firebase.auth().currentUser.uid);
    this._newUser = false;
    this._onFullAuthStateChanged$.next(this.currentUser);

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

  public getInvitations() {

    return new Observable<Invitation[]>(observer => {

      const unsubscribe = firebase.firestore()
      .collection('invitations')
      .where('to', '==', this.currentUser.id)
      .onSnapshot(
        (query: QuerySnapshot<Invitation>) => {

          if ( ! query.size ) return;

          observer.next(query.docs.map(doc => ({ ...doc.data(), id: doc.id })));

        },
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

      return { ...user.data(), id: uid } as User;

    }
    catch (error) {

      throw error;

    }

  }

  public getUserChanges(uid: string) {

    return new Observable<User>(observer => {

      const unsubscribe = firebase.firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(
        (doc: DocumentSnapshot<User>) => observer.next({ ...doc.data(), id: doc.id }),
        observer.error
      );

      // On unsubscribe
      observer.add(unsubscribe);

    });

  }

  public async getSession(id: string) {

    try {

      const session = await firebase.firestore().collection('sessions').doc(id).get();

      if ( ! session.exists ) throw new Error('Session does not exist!');

      return { ...session.data(), id } as Session;

    }
    catch (error) {

      throw error;

    }

  }

  public getSessionChanges(id: string) {

    return new Observable<Session>(observer => {

      const unsubscribe = firebase.firestore()
      .collection('sessions')
      .doc(id)
      .onSnapshot(
        (doc: DocumentSnapshot<Session>) => observer.next({ ...doc.data(), id: doc.id }),
        observer.error
      );

      // On unsubscribe
      observer.add(unsubscribe);

    });

  }

}

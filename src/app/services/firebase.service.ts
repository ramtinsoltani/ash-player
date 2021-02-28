import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebaseCert from '@ash-player/firebase-cert';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private router: Router
  ) {

    firebase.initializeApp(firebaseCert);

    firebase.auth().onAuthStateChanged(user => {

      if ( ! user ) this.router.navigate(['/auth']);
      else this.router.navigate(['/home']);

    });

  }

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

}

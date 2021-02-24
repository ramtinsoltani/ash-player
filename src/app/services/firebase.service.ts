import { Injectable } from '@angular/core';
import firebaseCert from '@ash-player/firebase-cert';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() {

    firebase.initializeApp(firebaseCert);

  }

}

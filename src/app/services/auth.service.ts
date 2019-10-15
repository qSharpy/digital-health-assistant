import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Account } from '../models/account';
import { RequestUtil } from '../util/request.util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public angularFireAuth: AngularFireAuth,
    public angularFirestore: AngularFirestore,
  ) { }

  signIn(credentials) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  signUp(values) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(values.email, values.password);
  }

  addAccount(account: Account) {
    let accountObject = RequestUtil.cloneObjectBeforeSave(account);
    return this.angularFirestore.collection("accounts").doc(account.id).set(accountObject);  
  }
}

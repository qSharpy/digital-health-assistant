import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Account } from '../models/account';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RequestUtil } from '../util/request.util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    public angularFireAuth: AngularFireAuth,
    public angularFirestore: AngularFirestore
  ) { }

  signIn(credentials) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  signUp(values) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(
      values.email,
      values.password
    );
  }

  addAccount(account: Account) {
    const clone = RequestUtil.cloneObjectBeforeSave(account);
    return this.angularFirestore
      .collection<Account>('accounts')
      .doc(account.id)
      .set(clone);
  }

  get firebaseLoggedInAccount() {
    return this.angularFireAuth.authState;
  }

  get loggedInUserAccount() {
    return this.angularFireAuth.authState.pipe(
      switchMap(user => {
        console.log('USER', user.uid);
        if (user == null) {
          return of<Account>(null);
        }
        return this.angularFirestore.collection('accounts').doc<Account>(user.uid).valueChanges();
      })
    );
  }
}

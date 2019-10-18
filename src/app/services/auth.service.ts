import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Account } from '../models/account';
import { of, Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RequestUtil } from '../util/request.util';
import { AuthenticationCredential } from '../models/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    public angularFireAuth: AngularFireAuth,
    public angularFirestore: AngularFirestore
  ) { }

  signIn(credentials: AuthenticationCredential): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password));
  }

  signUp(authenticationCredential: AuthenticationCredential): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.auth.createUserWithEmailAndPassword(
      authenticationCredential.email,
      authenticationCredential.password
    ));
  }

  addAccount(account: Account, uid: string) {
    return this.angularFirestore
      .collection<Account>('accounts')
      .doc(uid)
      .set(account);
  }

  get firebaseLoggedInAccount() {
    return this.angularFireAuth.authState;
  }

  get loggedInUserAccount() {
    return this.angularFireAuth.authState.pipe(
      switchMap(user => {
        if (user == null) {
          return of<Account>(null);
        }
        return this.angularFirestore.collection('accounts').doc<Account>(user.uid).valueChanges();
      })
    );
  }

  signOut(): Observable<void> {
    return from(this.angularFireAuth.auth.signOut());
  }
}

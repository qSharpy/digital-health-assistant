import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { Account } from 'src/app/models/account';
import { Observable } from 'rxjs';
import { first, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-secure-navbar',
  templateUrl: './secure-navbar.component.html',
  styleUrls: ['./secure-navbar.component.scss']
})
export class SecureNavbarComponent implements OnInit {

  @Input() extendNavbar = false;

  @Output() toggleNavbarEmiter: EventEmitter<void> = new EventEmitter<void>();

  currentAccount$: Observable<Account>;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentAccount$ = this.authService.loggedInUserAccount.pipe(
      filter(account => account != null),
      first());
  }

  toggleNavbar = () => this.toggleNavbarEmiter.emit();

  signOut() {
    this.authService.signOut().subscribe(() => this.router.navigate(['/']),
      error => this.toastr.error(error));
  }

  getLetters = (currentAccount: Account) => currentAccount ?
    currentAccount.firstName.charAt(0) + currentAccount.lastName.charAt(0) : ''

  getFullName = (currentAccount: Account) => currentAccount ? `${currentAccount.firstName} ${currentAccount.lastName}` : '';
}

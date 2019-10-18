import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrls: ['./secure.component.scss']
})
export class SecureComponent implements OnInit {

  extendNavbar = true;

  constructor() { }

  ngOnInit() {
  }

  toggleNavbar = () => this.extendNavbar = !this.extendNavbar;
}

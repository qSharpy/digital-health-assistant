import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  private _currentInsurencePlan$: BehaviorSubject<InsurencePlan>;

  insurencePlans: InsurencePlan[] = [];

  get currentInsurencePlan$(): Observable<InsurencePlan> {
    return this._currentInsurencePlan$.asObservable();
  }

  constructor() { }

  ngOnInit() {
    this.buildInsurencePlans();

    this._currentInsurencePlan$ = new BehaviorSubject<InsurencePlan>(this.insurencePlans[0]);
  }

  private buildInsurencePlans(): void {
    const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
    laboris nisi ut aliquip ex ea commodo consequat.
    Duis aute irure dolor in reprehenderit in
    voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

    this.insurencePlans.push(new InsurencePlan(1, 'Platinum Insurence', description));
    this.insurencePlans.push(new InsurencePlan(2, 'Gold Insurence', description));
    this.insurencePlans.push(new InsurencePlan(3, 'Silver Insurence', description));
    this.insurencePlans.push(new InsurencePlan(4, 'Bronze Insurence', description));
  }

  changeInsurencePlan = (plan: InsurencePlan) => this._currentInsurencePlan$.next(plan);
}

class InsurencePlan {
  constructor(
    public id: number,
    public name: string,
    public description: string) { }
}

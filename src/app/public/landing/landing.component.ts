import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { filter, map, tap, defaultIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  private _currentInsurencePlan$: BehaviorSubject<InsurencePlan>;

  // tslint:disable-next-line: variable-name
  private _currentPopup$: Observable<string>;

  insurencePlans: InsurencePlan[] = [];

  get currentInsurencePlan$(): Observable<InsurencePlan> {
    return this._currentInsurencePlan$.asObservable();
  }

  get currentPopup$(): Observable<string> {
    return this._currentPopup$;
  }

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    this._currentPopup$ = this.route.queryParams.pipe(
      defaultIfEmpty({ popup: 'none' }),
      map(param => param.popup as string),
    );

    this.buildInsurencePlans();

    this._currentInsurencePlan$ = new BehaviorSubject<InsurencePlan>(this.insurencePlans[0]);
  }

  private buildInsurencePlans(): void {
    const descriptionPlatinum = `Platinum: covers 90% on average of your medical costs.<br>
  INSURED BENEFITS:<br>
  <ul>
  <li>Quick access to over 850 partner medical centers</li>
  <li>Costs paid directly by the company in the network of partner medical centers</li>
  <li>Fast programming at some of the partner medical clinics, at any time, with DGA</li>
  <li>Choosing the provider of medical services (according to the insurance conditions)</li>
  <li>The possibility of taking over the family members insurance (husband / wife, children).</li>
  <li>Ease in opening a reimbursement file, directly from the site via Digital Health Assistant</li>
  </ul>`;

    const descriptionGold = `Gold: covers 80% on average of your medical costs.<br>
INSURED BENEFITS:<br>
<ul>
<li>Quick access to over 850 partner medical centers</li>
<li>Costs paid directly by the company in the network of partner medical centers</li>
<li>Fast programming at some of the partner medical clinics, at any time, with DGA</li>
<li>Choosing the provider of medical services (according to the insurance conditions)</li>
<li>The possibility of taking over the family members insurance (husband / wife, children).</li>
<li>Ease in opening a reimbursement file, directly from the site or PWA mobila application</li>
</ul>`;

    const descriptionSilver = `Silver: covers 70% on average of your medical costs; You pay 30%
    <br>INSURED BENEFITS:<br>
    It covers medical services that do not require hospitalization in case of the following risks:
    <ul>
    <li>General medicine consultations by general practitioner, internal medicine doctor and pediatrician</li>
    <li>Consultation of various specialties: over 30 clinical and surgical medical specialties</li>
    <li>Outpatient surgery and ambulance services</li>
    </ul>
    <ul>
    Monitoring of chronic diseases:
    <li>Consultations (depending on the characteristics of the group, they can be 2/4/8 / year of insurance)</li>
    </ul>`;

    const descriptionBronze = `Bronze: covers 70% on average of your medical costs; you pay 40%.
    <br>INSURED BENEFITS:<br>
    It covers medical services that do not require hospitalization in case of the following risks:
    <ul>
    <li>Accident, illness (acute diseases and acute onset of a chronic / pre-existing disease)</li>
    <li>General medicine consultations by general practitioner, internal medicine doctor and pediatrician</li>
    <li>Consultation of various specialties: over 30 clinical and surgical medical specialties</li>
     </ul>
    <ul>
    <br>
    <b>No monitoring of chronic diseases</b>
    `;

    this.insurencePlans.push(new InsurencePlan(1, 'Platinum', descriptionPlatinum));
    this.insurencePlans.push(new InsurencePlan(2, 'Gold', descriptionGold));
    this.insurencePlans.push(new InsurencePlan(3, 'Silver', descriptionSilver));
    this.insurencePlans.push(new InsurencePlan(4, 'Bronze', descriptionBronze));
  }

  changeInsurencePlan = (plan: InsurencePlan) => this._currentInsurencePlan$.next(plan);

}

class InsurencePlan {
  constructor(
    public id: number,
    public name: string,
    public description: string) { }
}


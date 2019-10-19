import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClinicService } from 'src/app/services/clinic.service';
import { Observable } from 'rxjs';
import { Clinic } from 'src/app/models/clinic';
import { mergeMap, defaultIfEmpty, map, tap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-clinics',
  templateUrl: './clinics.component.html',
  styleUrls: ['./clinics.component.scss']
})
export class ClinicsComponent implements OnInit {

  @Input() secure = true;

  formControl: FormControl;

  constructor(private clinicService: ClinicService) { }

  clinics$: Observable<Clinic[]>;

  ngOnInit() {
    this.formControl = new FormControl('');

    this.clinics$ = this.clinicService.getAllClinics().pipe(
      mergeMap(clinics => this.formControl.valueChanges.pipe(
        startWith(''),
        map(input => clinics.filter(clinic =>
          clinic.name.toLocaleLowerCase().indexOf(input.toLocaleLowerCase()) !== -1))
      )));
  }


}

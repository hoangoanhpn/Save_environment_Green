import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { apiProfile } from '../../services/api.service';

@Component({
    selector: 'user-cmp',
    moduleId: module.id,
    templateUrl: 'user.component.html',
    styleUrls: ['create.component.css']
})

export class UserComponent implements OnInit{
  myForm: FormGroup;
  constructor(
    private _freeApi: apiProfile,
    private fb: FormBuilder,
  ){
    this.createForm();
    this.myForm.valueChanges.subscribe(console.log);
  }

  ngOnInit(): void {
  }

  createForm(){
    this.myForm = this.fb.group({
      deviceID: ['', Validators.compose([Validators.required, Validators.maxLength(6), Validators.minLength(6)])],
      deviceName: ['', Validators.compose([Validators.required])],
      sensorCount: [''],
      sensors: this.fb.array([]),
    });
  }

  get SensorForm() {
    return this.myForm.get('sensors') as FormArray;
  }

  addSensor(){
    const sensorGroup = this.fb.group({
      sensorName: [''],
      value: ['']
    });
    this.SensorForm.push(sensorGroup);
  }

  deleteSensor(i) {
    this.SensorForm.removeAt(i);
  }

  onSubmit(){
    this._freeApi.createDv(this.myForm.value)
    .subscribe(
      data => console.log('okeee!'),
      error => console.error('Error',error)
    );
    console.log('alo',this.myForm.value);
    alert('Đã tạo devices thành công!');
  }
}


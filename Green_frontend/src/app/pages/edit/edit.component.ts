import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { apiProfile } from '../../services/api.service';
import { EditItem } from  './edit';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
    selector: 'typography-cmp',
    moduleId: module.id,
    templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit {

  deviceID: any;
  data: any;
  devicelst: EditItem[];
  myForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private _freeApi: apiProfile,
    private fb: FormBuilder,
  ) {
    this.createForm();
    this.myForm.valueChanges.subscribe(console.log);
  }

  ngOnInit(): void {
    this.deviceID = this.route.snapshot.params['deviceID'];
    this.getOne();

  }

  getOne()
  {
    this._freeApi.getInfo(this.deviceID).subscribe(data=>
      {
        this.devicelst = data.device;
        console.log(this.devicelst);
      }
    )
  }
  createForm(){
    this.deviceID = this.route.snapshot.params['deviceID'];
    this.myForm = this.fb.group({
      deviceID: [this.deviceID],
      deviceName: [''],
      //sensors: this.fb.array([{
        //sensorName: ''
      //}])
    });
  }

  onUpdate(deviceID){
    this._freeApi.putDv(this.myForm.value, this.deviceID)
    .subscribe(
      data => console.log('okeee!'),
      error => console.error('Error',error)
    );
    console.log('alo',this.myForm.value);
  }
}

import { ToastrService } from "ngx-toastr";
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { apiProfile } from '../../services/api.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'notifications-cmp',
    moduleId: module.id,
    templateUrl: 'dialog.component.html',
    styleUrls: ['./dialog.component.css']
})

export class DialogComponent implements OnInit {

  deviceID = this.dataKey.deviceID;
  mess: any = [];
  nameMess : any = [];
  name: any = [];
  contentMess: any= [];
  title: any = [];
  arr = new Array();
  body = {
    dataDeleteID: []
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataKey: any,
    private _freeApi: apiProfile,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getMess();
    //console.log(this.dataKey)
  }

  getMess()
  {
    this._freeApi.getMess(this.deviceID).subscribe(res=>
      {
        //console.log(res);
        this.mess = res;
        //console.log('alo', Object.entries(this.mess));
        this.nameMess = Object.keys(this.mess.data[0]);
        this.name = this.nameMess.splice(0,5);
        this.title = this.nameMess.splice(1,2);

        this.contentMess = Object.values(this.mess.data);
        console.log(this.contentMess)
      }
    )
  }

  selChk(val, i) {
    console.log(val, i);
    this.body.dataDeleteID.push(val);
    console.log('Checkbox', this.body);

  }

  clear(){
    this.body.dataDeleteID = [];
    console.log('Checkbox clear', this.body);
  }

  onDelete(deviceID){
    console.log(this.body, deviceID);
    this._freeApi.deleteMess(this.body, deviceID).subscribe(data => {
    })
    var do_alert = setTimeout(function(){
      location.reload();
    }, 2000);
    console.log('Deleted mess: ', this.body);
    alert(`Đã xóa message với mã là: ${this.body.dataDeleteID}`);
  }

  onDel(_id, deviceID){
    this._freeApi.deleteMess(this.body, deviceID).subscribe(data => {
      }
    )
    console.log('Deleted mess: ', this.body);
    alert(`Đã xóa message với mã là: ${_id}`);
  }

  onClose(){
    this.dialog.closeAll();
  }
}

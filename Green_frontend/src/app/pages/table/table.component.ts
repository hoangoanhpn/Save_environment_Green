import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { apiProfile } from '../../services/api.service';
import { TableItem } from './table-datasource';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
    selector: 'table-cmp',
    moduleId: module.id,
    templateUrl: 'table.component.html',
    styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {

  constructor(
    private _freeApi: apiProfile,
    public dialog: MatDialog) { }

  lstTable: TableItem[];
  objTable: TableItem;
  message: string;

  listDe = [];

  Ondelete(j){
    if(confirm(`Bạn có chắc chắn muốn xóa devices với mã là: ${j} không?`)){
      alert(`Đã xóa devices với mã là: ${j}`);
      this._freeApi.delete(j)
    .subscribe(
      data => {
      }
    )
    var do_alert = setTimeout(function(){
      location.reload();
    }, 2000);
    console.log('Deleted: ', j);
		} else {
    console.log('Cancel');
    }
  }

  /*openEdit(i){
    let dialogRef = this.dialog.open(DialogComponent, {data: {i}});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Result: ${result}`);
    });
  }*/

  openInfo(i){

    //this._freeApi.getInfo(i)
    //.subscribe(
      //data => {
        //console.log(data.device);
        //this.lstInfo = data.device;
      //}
    //)
    let dialogRef = this.dialog.open(DialogComponent, {data: i, height: '700px', width: '1200px', position: {left: '20%'}});
  }

  ngOnInit() {
    var lst;
    this._freeApi.getProfile()
    .subscribe(
      data => {
        this.lstTable = data.devices;
        for (let i=0; i < data.devices.length; i++)
        {
          this.listDe.push(data.devices[i].deviceID);
        }
        console.log(this.listDe);
        localStorage.setItem('listDe', JSON.stringify(this.listDe));
      }
    )
    console.log(JSON.parse(localStorage.getItem('listDe')));


    //this._freeApi.post(opost)
    //.subscribe(
      //data => {
        //this.objTable = data;
      //}
    //)
    //console.log('post donee');

    //this._freeApi.delete()
    //.subscribe(
      //data => {
        //this.message = "Deleted! doneeee";
      //}
    //)
    //console.log('deleted');
  }
}

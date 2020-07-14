import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { apiProfile } from '../../services/api.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit{

  public canvas : any;
  public ctx;
  public chartColor;
  public chartEmail;
  public chartHours;
  lessThenOrGratterThen = 'lessThen';
  filterL = 10;
  lst: [];
  CO: any [];
  NO2: any [];
  myDev;
  listDe = [];

  constructor(
    private _freeApi: apiProfile,
  )
  {
    this.listDe = JSON.parse(localStorage.getItem('listDe'));
    this.myDev = localStorage.getItem('key');
  }

  select(dev)
  {
    localStorage.setItem('key', dev);
    var myDev = localStorage.getItem('key');
    console.log('Chon device', myDev);
    var b = [];
    var c = [];
    var t = [];
    this._freeApi.getMess(myDev).subscribe(
      data => {
        this.lst = data.data;
        console.log(data.data.length);
        for (var i = 0; i < data.data.length; i++) {
          b.push(this.lst[i][`${dev}_sensor1`]);
        }
        for (var i = 0; i < data.data.length; i++) {
          c.push(this.lst[i][`${dev}_sensor2`]);
        }
        for (var i = 0; i < data.data.length; i++) {
          t.push(this.lst[i]["time"]);
        }
        this.CO = b.slice();
        this.NO2 = c.slice();
        console.log(c);
      }
    )
      var speedCanvas = document.getElementById("speedChart");
      console.log('loz', b);

      console.log(this.listDe);

      var dataFirst = {
        data: b,
        fill: false,
        label: 'Sensor đo mức rác trong thùng',
        borderColor: '#fbc658',
        backgroundColor: 'transparent',
        pointBorderColor: '#fbc658',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8,
      };

      var dataSecond = {
        data: c,
        fill: false,
        label: 'Sensor đo khoảng cách tiếp cận',
        borderColor: '#51CACF',
        backgroundColor: 'transparent',
        pointBorderColor: '#51CACF',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8
      };

      var speedData = {
        labels: t,
        datasets: [dataFirst, dataSecond]
      };

      var chartOptions = {
        legend: {
          display: true,
          cursor: "pointer",
          position: 'bottom'
        },
        scales: {
          yAxes: [{
              stacked: false
          }]

      }
      };

      var lineChart = new Chart(speedCanvas, {
        type: 'line',
        hover: false,
        data: speedData,
        options: chartOptions
      });
    }

  ngOnInit()
  {
    var myDev = localStorage.getItem('key');
    console.log(myDev, 'chart');
    this.select(myDev);
    setTimeout(function(){ location.reload(); }, 60000);
  }



}

import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../app.service';
import { Cuota, Pago } from '../app.interfaces';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';


@Component({
  selector: 'app-dialog-modal-conciliacion',
  templateUrl: './dialog-modal-conciliacion.component.html',
  styleUrls: ['./dialog-modal-conciliacion.component.css']
})
export class DialogModalConciliacionComponent implements OnInit {
  readOnly = false;
  columnsPagos = [];
  columnsCuotas = [];
  cuotas = new MatTableDataSource<Cuota>([]);
  pagos = new MatTableDataSource<Pago>([]);
  imp_cuotas = 0;
  imp_pagos = 0;
  dif_conciliacion = 0;
  conc_inicial = false;
  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Conciliar,public _appServ:AppService,
  private _adapter: DateAdapter<any>,
  private dialogRef: MatDialogRef<DialogModalConciliacionComponent>) {
    this._adapter.setLocale('es');
    this.readOnly = data.readOnly || this.readOnly;
    this.columnsPagos = data.columnsPagos;
    this.columnsCuotas = data.columnsCuotas;
    this.cuotas = new MatTableDataSource<Cuota>(data.cuotas);
    this.pagos = new MatTableDataSource<Pago>(data.pagos);
  }

  ngOnInit(): void {
    let total = 0;

    if(this.cuotas.data.length > 0) {
      total = 0;
      this.imp_cuotas = +this.cuotas.data.map(c => c.IMPORTE).reduce((imp,total) => +imp + +total);
      this.imp_cuotas = +this.imp_cuotas.toFixed(2);
    }

    if(this.pagos.data.length > 0) {
      total = 0;
      this.imp_pagos = +this.pagos.data.map(p => p.COBRADO).reduce((cob,total) => +cob + +total);
      this.imp_pagos = +this.imp_pagos.toFixed(2);
    }

    this.dif_conciliacion = +(+this.imp_cuotas + +this.imp_pagos).toFixed(2);
  }

  showElement(element) {
    if(Object.prototype.toString.call(element) === '[object Date]' || element instanceof Date)  {
      return moment(element).format('DD/MM/YYYY');
    }
    return element;
  }

  conciliar() {
    let data = { pagos:this.pagos.data.map((x:any) => x.id),
                 cuotas:this.cuotas.data.map((x:any) => x.id),
                 conc_inicial:this.conc_inicial};
    
    this.loading = true;
    this._appServ.conciliar(data).subscribe(resp => {
      this.loading = false;
      this.dialogRef.close(true);
    }, (error) => console.error(error));

  }

}


interface Conciliar {
  title?
  readOnly?
  columnsPagos:Array<any>;
  columnsCuotas:Array<any>;
  cuotas: Cuota[];
  pagos: Pago[];
}

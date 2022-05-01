import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../app.service';
import { MatTableDataSource } from '@angular/material/table';
import { Cuota, Pago } from '../app.interfaces';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { stringify } from 'querystring';

@Component({
  selector: 'app-dialog-modal-cuotas-poliza',
  templateUrl: './dialog-modal-cuotas-poliza.component.html',
  styleUrls: ['./dialog-modal-cuotas-poliza.component.css']
})
export class DialogModalCuotasPolizaComponent implements OnInit {
  readOnly = false;
  columnsCuotas = ['nrocomprobante','fechavto','nrocuota','importe'];
  cuotas = new MatTableDataSource<any>([]);
  imp_cuotas = 0;
  loading = false;
  poliza = 0;
  cuenta = 0;

  constructor(
    public _appServ: AppService,
    public dialogRef: MatDialogRef<DialogModalCuotasPolizaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.poliza = data.poliza;
      this.loading = true;
      this._appServ.getAllCuotasPoliza(this.poliza)
            .subscribe((data:any) => {
              this.cuenta = data[0].cuenta || 0;
              this.cuotas = new MatTableDataSource<Cuota>(data);
              this.loading = false;
      });
    }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getTotal() {
    if(this.cuotas.data.length > 0) {
      let total = 0;
      this.imp_cuotas = +this.cuotas.data.map(c => c.importe).reduce((imp,total) => +imp + +total);
      this.imp_cuotas = +this.imp_cuotas.toFixed(2);
      return this.imp_cuotas;
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from '../app.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Cuota, Pago } from '../app.interfaces';
import Swal from 'sweetalert2';
import { DialogModalConciliacionComponent } from '../dialog-modal-conciliacion/dialog-modal-conciliacion.component';


@Component({
  selector: 'app-conciliar',
  templateUrl: './conciliar.component.html',
  styleUrls: ['./conciliar.component.css']
})
export class ConciliarComponent implements OnInit {
  cuotas = new MatTableDataSource<Cuota>([]);
  pagos = new MatTableDataSource<Pago>([]);
  sel_cuotas = new SelectionModel<Cuota>(true, []);
  sel_pagos = new SelectionModel<Pago>(true, []);
  totalPagosSel = 0;
  totalCuotasSel = 0;
  loading = false;
  loading_cuotas = false;
  loading_pagos = false;

  columnsCuotas: string[] = [
    'CUENTA',
    'NROPERSONA',
    'POLIZA',
    'TIPOCOMP',
    'NROCOMPROBANTE',
    'EXPEDIENTE',
    'FECHAVTO',
    'CUOTAS',
    'NROCUOTA',
    'NROINTERNO',
    'IMPORTE',
    'IMP_PACK',
    'ESTADO_POLIZA',
    'NRO_VINCULANTE'
  ];

  columnsPagos: string[] = [
    'NROPERSONA',
    'ASEGURADO',
    'OPERACION',
    'CIA',
    'ENTIDAD_ASEGURADORA',
    'PROPUESTA',
    'NRORECIBO',
    'PRODUCTO',
    'POLIZA',
    'SUPLE',
    'CUOTA',
    'EXPEDIENTE',
    'EMISION',
    'MONEDA',
    'COBRADO',
    'VENCIMIENTO',
    'FECCOBRO',
    'HORCOBRO',
    'NROLOTE',
    'NROTERM',
    'MOVIMIENTO',
    'COMISION',
    'PRIMA',
    'PREMIO',
    'ESTADO_POLIZA',
  ];

  columnsPagosSel = [
    'POLIZA',
    'FECCOBRO',
    'COBRADO',
    'ASEGURADO',
    'ENTIDAD_ASEGURADORA',
    'SUPLE',
    'CUOTA',
    'NROPERSONA',
  ];
  columnsCuotasSel = [
    'CUENTA',
    'POLIZA',
    'FECHAVTO',
    'IMPORTE',
    'NROCOMPROBANTE',
    'CUOTAS',
    'NROCUOTA',
    'NROPERSONA',
    'IMP_PACK',
    'NRO_VINCULANTE'
  ];


  constructor(
    public _appServ: AppService,
    public dialog: MatDialog){}


  openDialog(data) {
    const dialogRef = this.dialog.open(DialogModalConciliacionComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDataTables();
      }
    });
  }

  conciliar() {
    if (this.sel_cuotas.isEmpty() && this.sel_pagos.isEmpty()) return;
    this.openDialog({
      columnsPagos: this.columnsPagosSel,
      columnsCuotas: this.columnsCuotasSel,
      pagos: this.sel_pagos.selected,
      cuotas: this.sel_cuotas.selected,
    });
  }

  ngOnInit() {
    this.getDataTables();
    // this.sel_pagos.changed.subscribe((resp) => {
    //   if (resp.added[0]) {
    //     this.pagos.filter = resp.added.pop().NROPERSONA + '';
    //   }
    // });
  }

  getDataTables() {
    this.getDataPagos();
    this.getDataCuotas();
  }

  getDataPagos() {
    this.loading_pagos = true;
    this.pagos.data = [];

    this._appServ.getPagos().subscribe((resp: any) => {
      this.pagos.data = resp;
      this.sel_pagos.changed.subscribe(() => {
        this.getTotalsSel();
      });
      this.loading_pagos = false;
    });

    this.sel_pagos = new SelectionModel<Pago>(true, []);
  }

  getDataCuotas() {
    this.loading_cuotas = true;
    this.cuotas.data = [];

    this._appServ.getCuotas().subscribe((resp: any) => {
      this.cuotas.data = resp;
      this.sel_cuotas.changed.subscribe(() => {
        this.getTotalsSel();
      });
      this.loading_cuotas = false;
    });

    this.sel_cuotas = new SelectionModel<Cuota>(true, []);
  }


  getTotalsSel() {
    this.totalCuotasSel = 0;
    this.totalPagosSel = 0;

    if (this.sel_cuotas.selected.length > 0) {
      this.totalCuotasSel = +this.sel_cuotas.selected
        .map((c) => c.IMPORTE)
        .reduce((imp, total) => +imp + +total,0);
      this.totalCuotasSel = +this.totalCuotasSel.toFixed(2);
    }

    if (this.sel_pagos.selected.length > 0) {
      this.totalPagosSel = +this.sel_pagos.selected
        .map((p) => p.COBRADO)
        .reduce((cob, total) => +cob + +total,0);
      this.totalPagosSel = +this.totalPagosSel.toFixed(2);
    }
  }

  conciliarAuto(tipo) {
    this.loading = true;
    this._appServ.conciliarAuto(tipo).subscribe(
      (resp: any) => {
        this.loading = false;
        if (resp.ok) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Se realizaron ${resp.count} conciliaciones`,
            showConfirmButton: false,
            timer: 5000,
          });
          this.getDataTables();
        }
      },
      (error) => console.error(error)
    );
  }

  conciliarDebCre() {
    this.loading = true;
    this._appServ.conciliarDebCre().subscribe(
      (resp: any) => {
        this.loading = false;
        if (resp.ok) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Se realizaron ${resp.count} conciliaciones`,
            showConfirmButton: false,
            timer: 5000,
          });
          this.getDataTables();
        }
      },
      (error) => console.error(error)
    );
  }

  conciliarAgroup() {
    this.loading = true;
    this._appServ.conciliarAgroup().subscribe(
      (resp: any) => {
        this.loading = false;
        if (resp.ok) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Se realizaron ${resp.count} conciliaciones`,
            showConfirmButton: false,
            timer: 5000,
          });
          this.getDataTables();
        }
      },
      (error) => console.error(error)
    );
  }

  conciliarAgroupNroPersona() {
    this.loading = true;
    this._appServ.conciliarAgroupNroPersona().subscribe(
      (resp: any) => {
        this.loading = false;
        if (resp.ok) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Se realizaron ${resp.count} conciliaciones`,
            showConfirmButton: false,
            timer: 5000,
          });
          this.getDataTables();
        }
      },
      (error) => console.error(error)
    );
  }

  conciliarPackAuto(tipo) {
    this.loading = true;
    this._appServ.conciliarPackAuto(tipo).subscribe(
      (resp: any) => {
        this.loading = false;
        if (resp.ok) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Se realizaron ${resp.count} conciliaciones`,
            showConfirmButton: false,
            timer: 5000,
          });
          this.getDataTables();
        }
      },
      (error) => console.error(error)
    );
  }

}

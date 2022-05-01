import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from '../app.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Cuota, Pago } from '../app.interfaces';
import { HostListener } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Moment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DialogModalConciliacionComponent } from '../dialog-modal-conciliacion/dialog-modal-conciliacion.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-conciliar',
  templateUrl: './conciliar.component.html',
  styleUrls: ['./conciliar.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ConciliarComponent implements OnInit {
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key == 'Escape') {
      this.clear();
    }
  }

  cuotas = new MatTableDataSource<Cuota>([]);
  pagos = new MatTableDataSource<Pago>([]);
  cuotas_last_request = new MatTableDataSource<Cuota>([]);
  pagos_last_request = new MatTableDataSource<Pago>([]);
  sel_cuotas = new SelectionModel<Cuota>(true, []);
  sel_pagos = new SelectionModel<Pago>(true, []);
  dateFilter = new FormControl();
  filterText = '';
  filterIndex = -1;
  totalPagosSel = 0;
  totalCuotasSel = 0;
  loading = false;
  loading_cuotas = false;
  loading_pagos = false;
  desde_importe: number;
  hasta_importe: number;

  columnsCuotas: string[] = [
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
    'POLIZA',
    'FECHAVTO',
    'IMPORTE',
    'NROCOMPROBANTE',
    'CUOTAS',
    'NROCUOTA',
    'NROPERSONA',
    'IMP_PACK',
  ];


  constructor(
    public _appServ: AppService,
    public dialog: MatDialog,
    private _adapter: DateAdapter<any>,
    private _cb: Clipboard
    ) {
    this._adapter.setLocale('es');
  }

  clear() {
    this.filterText = '';
    this.sel_cuotas.clear();
    this.sel_pagos.clear();
    this.getTotalsSel();
    this.filterTables();
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(DialogModalConciliacionComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clear();
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
    this.sel_pagos.changed.subscribe((resp) => {
      if (resp.added[0]) {
        this.pagos.filter = resp.added.pop().NROPERSONA + '';
      }
    });
  }

  getDataTables() {
    this.loading_cuotas = true;
    this.loading_pagos = true;
    this.cuotas.data = [];
    this.pagos.data = [];
    this.cuotas_last_request.data = [];
    this.pagos_last_request.data = [];

    this._appServ.getCuotas().subscribe((resp: any) => {
      resp.forEach((e) => {
        e.FECHAVTO = new Date(e.FECHAVTO + ' 00:00:00');
      });
      this.cuotas.data = resp;
      this.cuotas_last_request.data = resp;
      this.sel_cuotas.changed.subscribe(() => {
        this.getTotalsSel();
      });
      this.loading_cuotas = false;
      this.applyFilterDate(null);
    });

    this._appServ.getPagos().subscribe((resp: any) => {
      resp.forEach((e) => {
        e.FECCOBRO = new Date(e.FECCOBRO + ' 00:00:00');
        e.VENCIMIENTO = new Date(e.VENCIMIENTO + ' 00:00:00');
      });
      this.pagos.data = resp;
      this.pagos_last_request.data = resp;
      this.sel_pagos.changed.subscribe(() => {
        this.getTotalsSel();
      });
      this.loading_pagos = false;
      this.applyFilterDate(null);
    });

    this.sel_cuotas = new SelectionModel<Cuota>(true, []);
    this.sel_pagos = new SelectionModel<Pago>(true, []);
  }

  nextFiltroIndex() {
    this.filterIndex++;
    if (this.filterIndex == this.pagos.data.length) {
      this.filterIndex = 0;
    }
    this.clear();
    let poliza = this.pagos.data[this.filterIndex].POLIZA;
    this._cb.copy(poliza);
    this.filterText = poliza;
    this.filterTables();
  }

  prevFiltroIndex() {
    this.clear();
    this.filterIndex--;
    if (this.filterIndex < 0) {
      this.filterIndex = this.pagos.data.length - 1;
    }
    let poliza = this.pagos.data[this.filterIndex].POLIZA;
    this._cb.copy(poliza);
    this.filterText = poliza;
    this.filterTables();
  }

  clearFilterIndex() {
    this.filterIndex = 0;
    this.nextFiltroIndex();
  }

  /** Para cuando se va escribiendo */
  applyFilter(event: Event) {
    this.filterText = (event.target as HTMLInputElement).value;
    this.filterTables();
  }

  applyFilterDate(event: Event) {
    this.tablesToLastRequest();
    if(this.dateFilter.value) {
      this.pagos.data = (this.pagos.data.filter(pago => moment(pago.FECCOBRO, 'DD/MM/YYYY').format("M") == this.dateFilter.value.format("M") && moment(pago.FECCOBRO, 'DD/MM/YYYY').format("YYYY") == this.dateFilter.value.format("YYYY")));
      this.cuotas.data = (this.cuotas.data.filter(cuota => moment(cuota.FECHAVTO, 'DD/MM/YYYY').format("M") == this.dateFilter.value.format("M") && moment(cuota.FECHAVTO, 'DD/MM/YYYY').format("YYYY") == this.dateFilter.value.format("YYYY")));
    }
  }

  /** Cuando se pega contenido en el filtro */
  applyFilterPaste(event: ClipboardEvent) {
    this.filterTables();
  }

  tablesToLastRequest() {
    this.cuotas.data = this.cuotas_last_request.data.filter(e => e);
    this.pagos.data = this.pagos_last_request.data.filter(e => e);
  }

  filterTables(textEvent = false) {
    if (textEvent !== false) this.filterText = textEvent + '';
    this.filterText += '';
    this.cuotas.filter = this.filterText.trim().toLowerCase();
    this.pagos.filter = this.filterText.trim().toLowerCase();

    if (this.cuotas.paginator) {
      this.cuotas.paginator.firstPage();
    }
  }

  getTotalsSel() {
    let total = 0;
    this.totalCuotasSel = 0;
    this.totalPagosSel = 0;

    if (this.sel_cuotas.selected.length > 0) {
      total = 0;
      this.totalCuotasSel = +this.sel_cuotas.selected
        .map((c) => c.IMPORTE)
        .reduce((imp, total) => +imp + +total);
      this.totalCuotasSel = +this.totalCuotasSel.toFixed(2);
    }

    if (this.sel_pagos.selected.length > 0) {
      total = 0;
      this.totalPagosSel = +this.sel_pagos.selected
        .map((p) => p.COBRADO)
        .reduce((cob, total) => +cob + +total);
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

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
      if(!this.dateFilter.value) {
        this.dateFilter.setValue(moment());
      } 
      const ctrlValue = this.dateFilter.value;
      ctrlValue.year(normalizedYear.year());
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
      if(!this.dateFilter.value) {
        this.dateFilter.setValue(moment());
      } 
      const ctrlValue = this.dateFilter.value;
      ctrlValue.month(normalizedMonth.month());
      this.dateFilter.setValue(ctrlValue);
      datepicker.close();
      this.applyFilterDate(null);
  }
}

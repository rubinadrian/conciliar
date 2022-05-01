import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalConciliacionComponent } from '../dialog-modal-conciliacion/dialog-modal-conciliacion.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Conciliacion, Cuota, Pago } from '../app.interfaces';

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
  selector: 'app-conciliadas',
  templateUrl: './conciliadas.component.html',
  styleUrls: ['./conciliadas.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ConciliadasComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSourceConciliadas = new MatTableDataSource<Conciliacion>([]);
  fromMonthYear = new FormControl(moment().add(-1, 'M'));
  toMonthYear = new FormControl(moment());
  conc_initial = false;
  filterText = '';
  loading = false;
  totalsMonth: Object = {};
  cuotas = new MatTableDataSource<Cuota>([]);
  pagos = new MatTableDataSource<Pago>([]);
  sel_cuotas = new SelectionModel<Cuota>(true, []);
  sel_pagos = new SelectionModel<Pago>(true, []);
  totalPagosSel = 0;
  totalCuotasSel = 0;
  loading_cuotas = false;
  loading_pagos = false;

  columnsCuotas: string[] = [
    'DIF',
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
    'DIF',
  ];

  columnsPagosSel = [
    'DIF',
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
    'DIF',
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
    private dateAdapter: DateAdapter<Date>,
    public dialog: MatDialog
  ) {
    this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
    this.getConciliadas();
  }

  getConciliadas() {
    this.loading_cuotas = true;
    this.loading_pagos = true;
    this.cuotas.data = [];
    this.pagos.data = [];

    this._appServ.getCuotasConciliadas(
          this.fromMonthYear.value.format('YYYYMM'),
          this.toMonthYear.value.format('YYYYMM'),
          this.conc_initial
    ).subscribe((resp: any) => {
      this.cuotas.data = resp;

      this.loading_cuotas = false;
    });

    this._appServ.getPagosConciliados(
      this.fromMonthYear.value.format('YYYYMM'),
      this.toMonthYear.value.format('YYYYMM'),
      this.conc_initial
    ).subscribe((resp: any) => {
      this.pagos.data = resp;
      this.loading_pagos = false;
    });
  }

  delConciliacion(row: Conciliacion) {
    // event.stopPropagation();
    Swal.fire({
      title: 'Desea eliminar la conciliacion?',
      showDenyButton: true,
      showConfirmButton: false,
      showCancelButton: true,
      denyButtonText: `Si, eliminar`,
    }).then((result) => {
      if (result.isDenied) {
        this.loading = true;
        this._appServ.delConciliacion(row.conciliacion_id).subscribe(
          (resp) => {
            this.loading = false;
            this.getConciliadas();
          },
          (error) => console.error(error)
        );
      }
    });
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    if (datepicker.id == 'mat-datepicker-0') {
      const ctrlValue = this.fromMonthYear.value;
      ctrlValue.year(normalizedYear.year());
      this.fromMonthYear.setValue(ctrlValue);
    } else {
      const ctrlValue = this.toMonthYear.value;
      ctrlValue.year(normalizedYear.year());
      this.toMonthYear.setValue(ctrlValue);
    }
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    if (datepicker.id == 'mat-datepicker-0') {
      const ctrlValue = this.fromMonthYear.value;
      ctrlValue.month(normalizedMonth.month());
      this.fromMonthYear.setValue(ctrlValue);
    } else {
      const ctrlValue = this.toMonthYear.value;
      ctrlValue.month(normalizedMonth.month());
      this.toMonthYear.setValue(ctrlValue);
    }
    datepicker.close();
    this.getConciliadas();
  }

  // isEmpty(obj: Object) {
  //   for (let i in obj) return false;
  //   return true;
  // }
  
  // getTotalDif() {
  //   return this.dataSourceConciliadas.data
  //     .map((c) => +c.dif)
  //     .reduce((a, v) => +a + v, 0);
  // }

  // getSubtotalesPorMes(data: Array<Conciliacion>) {
  //   let initial = {};
  //   data.forEach(
  //     (reg) => (initial[('0' + reg.month).slice(-2) + '/' + reg.year] = 0)
  //   );

  //   if (data.length > 0) {
  //     this.totalsMonth = data.reduce(
  //       (accumulator, currentValue, index, array) => {
  //         accumulator[
  //           ('0' + currentValue.month).slice(-2) + '/' + currentValue.year
  //         ] += +currentValue.dif;
  //         return accumulator;
  //       },
  //       initial
  //     );
  //   }
  // }

  // getConciliadas() {
  //   this.loading = true;
  //   this._appServ
  //     .getConciliadas(
  //       this.fromMonthYear.value.format('YYYYMM'),
  //       this.toMonthYear.value.format('YYYYMM')
  //     )
  //     .subscribe((resp: any) => {
  //       this.getSubtotalesPorMes(resp);
  //       this.dataSourceConciliadas.data = resp;
  //       this.dataSourceConciliadas.paginator = this.paginator;
  //       this.dataSourceConciliadas.sort = this.sort;
  //       this.loading = false;
  //     });
  // }

}

import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DecimalPipe } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';

import * as moment from 'moment';
import { Moment } from 'moment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

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
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TableComponent implements AfterViewInit {
  dateFilter = new FormControl();
  filterText = '';
  filterMount = 0;
  @Input() loading: boolean;
  @Input() columnsSel: Array<any>;
  @Input() columns: Array<any>;
  @Input() dataSource: MatTableDataSource<any>;
  @Input() selectedRegs: SelectionModel<any>;
  @Input() tableTitle: string;
  @Input() dataType: string;
  @Input() seccion: string;
  @Input() showConciliadas = false;
  @Output() clickRow = new EventEmitter();
  @Output() refreshData = new EventEmitter();

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.key == 'Escape') {
      this.filterText = '';
      this.filterMount = 0;
      this.dateFilter.setValue('');
      this.selectedRegs.clear();
      this.applyFilter();
    }
  }

  constructor(
    private decimalPipe: DecimalPipe,
    private _adapter: DateAdapter<any>,
    private _cb: Clipboard
  ) {
    this._adapter.setLocale('es');
  }

  clickInTr(row) {
    this.selectedRegs.toggle(row);
    this.clickRow.emit(row);
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.customFilterPredicate;
  }

  refreshTable(){
    this.refreshData.emit();
  }


  customFilterPredicate(reg: any, filters:string): boolean {
    let match = true;
    const filterArray = filters.split('$$$');
    match = match && JSON.stringify(reg).toLowerCase().includes(filterArray[0].toLowerCase());
    if(match && filterArray[1]) {
      if(reg.FECCOBRO)
        match = match && reg.FECCOBRO.format('MM/YYYY') == filterArray[1];
      if(reg.FECHAVTO)
        match = match && reg.FECHAVTO.format('MM/YYYY') == filterArray[1];
    }

    if(match && filterArray[2] && +filterArray[2]!== 0) {
      if(reg.IMPORTE) {
        match = match && Math.abs(+reg.IMPORTE) * 1.02 > Math.abs(+filterArray[2])
                      && Math.abs(+reg.IMPORTE) * 0.98 < Math.abs(+filterArray[2]);
      } else if(reg.COBRADO) {
        match = match && Math.abs(+reg.COBRADO) * 1.02 > Math.abs(+filterArray[2])
                      && Math.abs(+reg.COBRADO) * 0.98 < Math.abs(+filterArray[2]);
      }
    }
    return match;
  }

  applyFilter() {
    let dateFtr = moment.isMoment(this.dateFilter.value)?this.dateFilter.value.format('MM/YYYY'):'';
    this.dataSource.filter = this.filterText+'$$$'+dateFtr+'$$$'+this.filterMount;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilterPaste(event:ClipboardEvent) {
    //this.filterText = event.clipboardData.getData('Text');
    this.applyFilter();
  }

  
  filterFromTools(text) {
    this.filterText = text;
    this.applyFilter();
  }

  
  applyFilterDate(event: Event) {
    this.applyFilter();
  }



  getTotal() {
    let prop = '';
    if (this.dataType == 'pagos') prop = 'COBRADO';
    else if (this.dataType == 'cuotas') prop = 'IMPORTE';
    else return 0;
    return this.dataSource.filteredData
      .map((d) => d[prop])
      .reduce((acc, curr) => acc + curr, 0);
  }

  showElement(element, column) {
    let text = element[column];
    if (moment.isMoment(text)) {
      return text.format('DD/MM/YYYY');
    }
    if (column == 'COBRADO' || column == 'IMPORTE' || column == 'DIF') {
      return this.decimalPipe.transform(text, '1.2-2');
    }
    return text;
  }


  isNumeric(text) {
    return !isNaN(text);
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    if (!this.dateFilter.value) {
      this.dateFilter.setValue(moment());
    }
    const ctrlValue = this.dateFilter.value;
    ctrlValue.year(normalizedYear.year());
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    if (!this.dateFilter.value) {
      this.dateFilter.setValue(moment());
    }
    const ctrlValue = this.dateFilter.value;
    ctrlValue.month(normalizedMonth.month());
    this.dateFilter.setValue(ctrlValue);
    datepicker.close();
    this.applyFilterDate(null);
  }


}

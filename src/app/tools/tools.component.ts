import { Component, Input, Output } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { DialogModalCuotasPolizaComponent } from '../dialog-modal-cuotas-poliza/dialog-modal-cuotas-poliza.component';
import { Conciliacion, Cuota, Pago } from '../app.interfaces';
import { EventEmitter } from '@angular/core';
import { DialogModalComentarioComponent } from '../dialog-modal-comentario/dialog-modal-comentario.component';
import { DialogModalConciliacionComponent } from '../dialog-modal-conciliacion/dialog-modal-conciliacion.component';
import { AppService } from '../app.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent {
  @Input() row:any;
  @Output() copy = new EventEmitter();
  @Output() showConciliacion = new EventEmitter();
  @Output() refreshData = new EventEmitter();
  loading = false;
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



  constructor(private _cb: Clipboard,
    public dialog: MatDialog,
    public _appServ: AppService) {}

  clipboard(event: Event, text) {
    event.stopPropagation();
    event.preventDefault();
    this._cb.copy(text);
    this.copy.emit(text);
  }

  getAllCuotasPoliza(event: Event, row: Cuota|Pago) {
    event.stopPropagation();
    event.preventDefault();
    if((''+row.POLIZA).length >= 8){
      this.openDialogCuotasPoliza({poliza: row.POLIZA});
    }
  }

  private openDialogCuotasPoliza(data) {
    this.dialog.open(DialogModalCuotasPolizaComponent, {data});
  }

  openDialogConciliacion(data) {
    const dialogRef = this.dialog.open(DialogModalConciliacionComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('%c Se cerro el modal', 'background-color:red;color:white');
    });
  }

  getConciliacionAndOpenDialog(conciliacion: Conciliacion) {
    this.loading = true;
    this._appServ.getConciliacion(conciliacion.conciliacion_id)
      .subscribe((resp: any) => {
        this.loading = false;
        this.openDialogConciliacion({
          readOnly: true,
          title: 'Conciliación',
          columnsPagos: this.columnsPagosSel,
          columnsCuotas: this.columnsCuotasSel,
          pagos: resp.pagos,
          cuotas: resp.cuotas,
        });
      });
  }

  openComentario(data) {
    data.tipo_comentario = data.tipo_comentario || 0;
    const dialogRef = this.dialog.open(DialogModalComentarioComponent, { 
        data,
        width: '80vw'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // TO DO
      }
    });
  }

  setP2(row) {
    Swal.fire({
      title: `Confirma que la poliza ${row.POLIZA} es P2?`,
      showDenyButton: true,
      showConfirmButton: false,
      showCancelButton: true,
      denyButtonText: `Si, es P2`,
    }).then((result) => {
      if (result.isDenied) {
        this.loading = true;
        this._appServ.setP2(row.id).subscribe(
          (resp) => {
            this.refreshData.emit();
            this.loading = false;
          },
          (error) => console.error(error)
        );
      }
    });
  }

}

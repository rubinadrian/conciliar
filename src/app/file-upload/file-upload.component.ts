import { Component,OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  formPagos: FormGroup;
  formListOper: FormGroup;
  filePagos:File;
  fileListOper:File;
  isLoadingPagos = false;
  isLoadingListOper = false;
  isLoadingCuotas = false;
  isLoadingDataCuotas = false;
  isLoadingAnuladas = false;

  constructor(public fb: FormBuilder, public _appServ:AppService) {
    this.formPagos = this.fb.group({
      file: [null]
    });
    this.formListOper = this.fb.group({
      file: [null]
    });
  }

  ngOnInit() { }

  uploadFilePago(event) {
    this.filePagos = (event.target as HTMLInputElement).files[0];
  }

  uploadFileListOper(event) {
    this.fileListOper = (event.target as HTMLInputElement).files[0];
  }

  updateCuotas() {
    this.isLoadingCuotas = true;
    this._appServ.updateCuotas().subscribe((resp:any) => {
      this.isLoadingCuotas = false;
      Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Se actualizaron ${resp.count} cuotas`,
          showConfirmButton: false,
          timer: 5000
      });
    },
      (error) => {console.log(error);this.isLoadingCuotas = false;},);
  }

  updateCuotasFromDate() {
    this.isLoadingCuotas = true;
    this._appServ.updateCuotasFromDate().subscribe((resp:any) => {
      this.isLoadingCuotas = false;
      Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Se controlaron ${resp.count} cuotas`,
          showConfirmButton: false,
          timer: 5000
      });
    },
      (error) => {console.log(error);this.isLoadingCuotas = false;},);
  }

  submitFormPagos() {
    this.isLoadingPagos = true;
    this._appServ.sendFilePagos(this.filePagos).subscribe(
      (response:any) => {
        this.isLoadingPagos = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Se insertaron ${response.count_insert} de ${response.count_csv}`,
          showConfirmButton: false,
          timer: 5000
        });
      },
      (error) => {
        this.isLoadingPagos = false;
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error al leer el archivo. Recuerde subir en formato .csv',
          showConfirmButton: false,
          timer: 1500
        });
      },
    );
  }

  submitFormListOper() {
    this.isLoadingListOper = true;
    this._appServ.sendFileListadoOperaciones(this.fileListOper).subscribe(
      (response) => {
        this.isLoadingListOper = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'El archivo subio correctamente',
          showConfirmButton: false,
          timer: 1500
        });
      },
      (error) => {console.log(error);this.isLoadingListOper = false;},
    );
  }

  // setCuotasAnuladas() {
  //   this.isLoadingAnuladas = true;
  //   this._appServ.setCuotasAnuladas().subscribe(
  //     (response) => {
  //       this.isLoadingAnuladas = false;
  //       Swal.fire({
  //         position: 'top-end',
  //         icon: 'success',
  //         title: 'Se actualizaron las cuotas anuladas',
  //         showConfirmButton: false,
  //         timer: 1500
  //       });
  //     },
  //     (error) => {console.log(error);this.isLoadingAnuladas = false;},
  //   );
  // }

  // setDataCuotas() {
  //   this.isLoadingDataCuotas = true;
  //   this._appServ.setDataCuotas().subscribe(
  //     (response) => {
  //       this.isLoadingDataCuotas = false;
  //       Swal.fire({
  //         position: 'top-end',
  //         icon: 'success',
  //         title: 'Se actualizaron las cuotas pack',
  //         showConfirmButton: false,
  //         timer: 1500
  //       });
  //     },
  //     (error) => {console.log(error);this.isLoadingDataCuotas = false;},
  //   );
  // }

}

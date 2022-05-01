import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../app.service';

@Component({
  selector: 'app-dialog-modal-comentario',
  templateUrl: './dialog-modal-comentario.component.html',
  styleUrls: ['./dialog-modal-comentario.component.css']
})
export class DialogModalComentarioComponent implements OnInit {

  constructor(
    public _appServ: AppService,
    public dialogRef: MatDialogRef<DialogModalComentarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this._appServ.saveComentario(this.data).subscribe(resp => this.dialogRef.close(), console.error);
  }

}

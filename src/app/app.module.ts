import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Material
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatRippleModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ConciliarComponent } from './conciliar/conciliar.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { DialogModalConciliacionComponent } from './dialog-modal-conciliacion/dialog-modal-conciliacion.component';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogModalCuotasPolizaComponent } from './dialog-modal-cuotas-poliza/dialog-modal-cuotas-poliza.component';
import { ToolsComponent } from './tools/tools.component';
import { TableComponent } from './table/table.component';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSortModule} from '@angular/material/sort';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import { LoadingFullScreenComponent } from './loading-full-screen/loading-full-screen.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ConciliadasComponent } from './conciliadas/conciliadas.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DialogModalComentarioComponent } from './dialog-modal-comentario/dialog-modal-comentario.component';



@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    ConciliarComponent,
    HeaderComponent,
    DialogModalConciliacionComponent,
    DialogModalCuotasPolizaComponent,
    ToolsComponent,
    TableComponent,
    LoadingFullScreenComponent,
    ConciliadasComponent,
    DialogModalComentarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    MaterialFileInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatRippleModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSortModule,
    MatChipsModule,
    MatExpansionModule
  ],
  providers: [
    DatePipe,
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

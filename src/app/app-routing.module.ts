import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Components
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ConciliarComponent } from './conciliar/conciliar.component';
import { ConciliadasComponent } from './conciliadas/conciliadas.component';

const routes: Routes = [
  { path: 'conciliar', component: ConciliarComponent },
  { path: 'datos', component: FileUploadComponent },
  { path: 'conciliadas', component: ConciliadasComponent },
  { path: '',   redirectTo: 'conciliar', pathMatch: 'full' },
  { path: '**', component: ConciliarComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

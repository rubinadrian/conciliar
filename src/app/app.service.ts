import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  url = environment.url;

  constructor(
    private http: HttpClient
  ) { }

  getPagos() {
    return this.http.get(this.url + 'pago').pipe(map((pagos:Array<any>)=>{
      pagos.forEach(pago => {
        pago.FECCOBRO = moment(pago.FECCOBRO);
        pago.fechaParaFiltro = 'PARAFILTROFECHA/'+pago.FECCOBRO.format('MM')+'/'+pago.FECCOBRO.year();
      });
      return pagos;
    }));
  }

  getCuotas() {
    return this.http.get(this.url + 'cuota').pipe(map((cuotas:Array<any>)=>{
      cuotas.forEach(cuota => {
        cuota.FECHAVTO = moment(cuota.FECHAVTO);
        cuota.fechaParaFiltro = 'PARAFILTROFECHA/'+cuota.FECHAVTO.format('MM')+'/'+cuota.FECHAVTO.year();
      });
      return cuotas;
    }));
  }

  getAllCuotasPoliza(poliza) {
    return this.http.post(this.url + 'cuota/poliza',{poliza});
  }

  sendFilePagos(file:File) {
    var formData: any = new FormData();
    formData.append("file", file);

    return this.http.post(this.url + 'pago/fileupload', formData);
  }

  sendFileListadoOperaciones(file:File) {
    var formData: any = new FormData();
    formData.append("file", file);

    return this.http.post(this.url + 'listoper/fileupload', formData);
  }

  updateCuotas() {
    return this.http.post(this.url + 'cuota/update', []);
  }

  updateCuotasFromDate() {
    return this.http.post(this.url + 'cuota/updateFromDate', []);
  }

  conciliar(data:{pagos,cuotas}) {
    return this.http.post(this.url + 'conciliar',data);
  }
  /**
   *
   * @param tipo 0 Current Mes | 1 Next Month | 2 Prev. Month
   */
  conciliarAuto(tipo=0) {
    return this.http.get(this.url + 'conciliar/auto/' + tipo);
  }

  conciliarDebCre() {
    return this.http.get(this.url + 'conciliar/debcre');
  }

  conciliarAgroup() {
    return this.http.get(this.url + 'conciliar/agroup');
  }

  conciliarAgroupNroPersona() {
    return this.http.get(this.url + 'conciliar/agroup_nropersona');
  }

  conciliarPackAuto(tipo=0) {
    return this.http.get(this.url + 'conciliar/pack/auto/' + tipo);
  }


  // setCuotasAnuladas() {
  //   return this.http.get(this.url + 'anulada/setAnuladas');
  // }

  // setDataCuotas() {
  //   return this.http.get(this.url + 'pack/setData');
  // }

  /**
   * @from year concat month YYYYMM
   * @to year concat month YYYYMM
   */
  getConciliadas(from,to) {
    return this.http.get(this.url + 'conciliar/conciliadas/' + from + '/' + to);
  }

  getCuotasConciliadas(from, to, inicial = false) {
    return this.http.get(this.url + 'cuotas/conciliadas/'+from+'/'+to+'/'+(inicial?1:0));
  }

  getPagosConciliados(from, to, inicial = false) {
    return this.http.get(this.url + 'pagos/conciliados/'+from+'/'+to+'/'+(inicial?1:0));
  }

  getConciliacion(conciliacion_id) {
    return this.http.get(this.url + 'conciliacion/' + conciliacion_id);
  }

  delConciliacion(conciliacion_id) {
    return this.http.delete(this.url + 'conciliacion/' + conciliacion_id);
  }

  saveComentario(data) {
    return this.http.post(this.url + 'comentario', data);
  }

  setP2(pago_id) {
    return this.http.post(this.url + 'pago/setP2', {id:pago_id});
  }

}

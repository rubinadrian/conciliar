
export interface Cuota {
  'POLIZA':string;
  'IMPORTE':number;
  'TIPOCOMP':string;
  'NROCOMPROBANTE':string;
  'FECHAVTO':string;
  'CUOTAS':string;
  'NROCUOTA':string;
  'NROINTERNO':string;
}

export interface Pago {
  'NROPERSONA':string;
  'ASEGURADO':string;
  'OPERACION':string;
  'CIA':string;
  'ENTIDAD_ASEGURADORA':string;
  'PROPUESTA':string;
  'NRORECIBO':string;
  'PRODUCTO':string;
  'POLIZA':string;
  'SUPLE':string;
  'CUOTA':string;
  'EXPEDIENTE':string;
  'EMISION':string;
  'MONEDA':string;
  'COBRADO':number;
  'VENCIMIENTO':string;
  'FECCOBRO':string;
  'HORCOBRO':string;
  'NROLOTE':string;
  'NROTERM':string;
  'MOVIMIENTO':string;
  'COMISION':number;
  'PRIMA':number;
  'PREMIO':number;
}


export interface Conciliacion {
  conciliacion_id;
  month;
  year;
  asegurado;
  cobrado;
  importe;
  dif;
}

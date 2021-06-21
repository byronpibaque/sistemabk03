import models from '../models';

export default {
  
    list: async (req,res,next) => {
        
        try {
           
            const excel = require('exceljs');
            const moment = require('moment')

            let finicio=req.query.fechainicio;
            let ffin=req.query.fechafin;
            
            models.Venta.find({$and:[{estado:1},{'codigoFarmacia':valor},
            {createdAt:{$gte:new Date(start+"T12:00:00.000Z")}},
            {createdAt:{$lt:new Date(end+"T04:59:00.000Z")}}]})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codgioPersona', model:'persona',select:'nombres'}])
            .exec(function (err,Venta) {
                if(err)throw  res.status(500).send({
                        message:'Ocurrió un error: '+err 
                            });
                if(Venta){
                    var data = Venta;
                    
                    var valores = [];
                    var fecha = "";
                    for (let index = 0; index < data.length; index++) {
                        fecha = data[index].createdAt
                        let date = new Date(fecha)
                        
                        valores.push(
                          {
                          estado: data[index].estado,
                          fecha: date.toDateString(),
                          formapago:data[index].formapago,
                          comprobante: data[index].numComprobante,
                          clave: data[index].claveAcceso,
                          impuesto: data[index].impuesto,
                          total: data[index].total,
                          usuario: data[index].codigoUsuario.nombres,
                          tipoComprobante: data[index].codigoTipoComprobante.descripcion,
                          numeroDocumento: data[index].codgioPersona.numDocumento,
                          persona: data[index].codgioPersona.nombres
                        }
                        )
                        
                    }
                        
                            let workbook = new excel.Workbook(); //creating workbook
                            let worksheet = workbook.addWorksheet('Reporte'); //creating worksheet
                            worksheet.columns = [
                                { header: 'Estado', key: 'estado', width: 10 },
                                { header: 'Fecha de emision', key: 'fecha', width: 20 },
                                { header: 'Forma pago', key: 'formapago', width: 20 },
                                { header: 'Comprobante', key: 'comprobante', width: 25 },
                                { header: 'CA/NA', key: 'clave', width: 50 },
                                { header: 'Impuesto', key: 'impuesto', width: 20},
                                { header: 'Total', key: 'total', width: 15, outlineLevel: 1},
                                { header: 'Tipo Comprobante', key: 'tipoComprobante', width: 15 },
                                { header: 'Usuario', key: 'usuario', width: 30 },
                                { header: 'Cliente', key: 'persona', width: 30, outlineLevel: 1},
                                { header: 'Documento', key: 'numeroDocumento', width: 25},
                            ];
                            worksheet.addRows(valores);
                            // Write to File
                            workbook.xlsx.writeFile('./archivos/ArchivosExportados/Excel/REPORTE - '+moment().format('MMMM Do YYYY')+".xlsx")
                            .then(function() {
                            res.status(200).send({
                                message:'generado'
                                    });
                            });
                    
                }  
            }) 
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }

}
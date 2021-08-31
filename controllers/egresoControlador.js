import models from '../models';
import Egreso from '../models/egresos';
  
  
function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}
async function aumentarStock(idarticulo, cantidad, fracciones) {//PARA ANULAR FACTURAS

    let { fraccionesTotales, fraccionCaja } = await models.Producto.findOne({ _id: idarticulo });//FRACCIONES TOTALES Y FRACCIONES POR CAJA EN ARTICULOS
   

  
        let nfracionesTotal = parseInt(fraccionesTotales) +
         ((parseInt(fraccionCaja) * parseInt(cantidad))+parseInt(fracciones))
       
        const reg = await models.Producto.findByIdAndUpdate(
            { _id: idarticulo },
            {
         
                fraccionesTotales:nfracionesTotal

            });
   


}

async function disminuirStock(idarticulo, cantidad, fracciones) {//PARA GENERAR VENTA

    let { fraccionesTotales, fraccionCaja } = await models.Producto.findOne({ _id: idarticulo });
   
        let nfracionesTotal = parseInt(fraccionesTotales)-
        ((parseInt(fraccionCaja) * parseInt(cantidad)) + parseInt(fracciones))
       

        const reg = await models.Producto.findByIdAndUpdate(
            { _id: idarticulo },
            {
                  fraccionesTotales: nfracionesTotal
            });
    
}
export default {
    emitir: async (req,res,next) =>{
        try {
            const reg = await models.Egresos.create(req.body);
            //Actualizar stock
            // let detalles=req.body.detalles;
            // detalles.map(function(x){
            //     disminuirStock(x._id,x.cantidad,x.fracciones);
            // });
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    
    query: async (req,res,next) => {
        try {

            Egreso.findOne({_id:req.query._id}).populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'persona',select:'inventarios'},
                {path:'codigoInventarioR', model:'persona',select:'inventarios'}
            ])
                .exec(function (err,Venta) {
                    if(err)  
                    return res.status(500).send({
                                    message:'Ocurrió un error: '+err
                                 });
                    if(Venta){
                     res.status(200).send(Venta);    
                    }
                    
                })  

            
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listFecha: async (req,res,next) => {
        try {
            const moment = require('moment')
            const today = moment().startOf('day');

            let valor=req.query.valor;
            Egreso.find({createdAt:{"$gte": today.toDate(), "$lt":moment(today).endOf('day').toDate()}}).populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'persona',select:'inventarios'},
                {path:'codigoInventarioR', model:'persona',select:'inventarios'}]).exec(function (err,Venta) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(Venta){
                 res.status(200).send(Venta);    
                }  
            }) 
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listU: async (req, res, next) => {
        try {

            let valor = req.query.valor;
            let valor2 = req.query.valor2;
            models.Egresos.find({ $and: [{ 'codigoInventarioE': valor }, { 'codigoUsuario': valor2 },{estado:1}] })
                .populate([
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codigoInventarioE', model: 'inventarios', },
                    { path: 'codigoInventarioR', model: 'inventarios', }])
                .exec(function (err, Venta) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Venta) {
                        res.status(200).send(Venta);
                    }
                })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try { 
           
            let valor=req.query.valor;
            Egreso.find({$or:[{'numComprobante':new RegExp(valor,'i')}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'inventarios'},
                {path:'codigoInventarioR', model:'inventarios'}
            ])
                .exec(function (err,Venta) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(Venta){
                 res.status(200).send(Venta);    
                }  
            }) 
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listOne: async (req,res,next) => {
        try {
           
            let valor=req.query.valor;
            let valor2=req.query.valor2;
            Egreso.find({$and:[{'codigoFarmacia':valor},{'codigoUsuario':valor2}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'inventarios'},
                {path:'codigoInventarioR', model:'inventarios'}
            ])
                .exec(function (err,Venta) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(Venta){
                 res.status(200).send(Venta);    
                }  
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listOneF: async (req,res,next) => {
        try {
            const moment = require('moment')
            const today = moment().startOf('day');
            let valor=req.query.valor;
            let valor2=req.query.valor2;
            Egreso.find({$and:[{'codigoFarmacia':valor},{'codigoUsuario':valor2},{createdAt:{"$gte": today.toDate(), "$lt":moment(today).endOf('day').toDate()}}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'inventarios'},
                {path:'codigoInventarioR', model:'inventarios'}]).exec(function (err,Venta) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(Venta){
                 res.status(200).send(Venta);    
                }  
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }, 
    listFiltroI: async (req,res,next) => {
        try {
            const moment = require('moment')
            const today = moment().startOf('day');
            let valor=req.query.valor;
         
            Egreso.find({$or:[{'codigoInventarioE':valor}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'inventarios'},
                {path:'codigoInventarioR', model:'inventarios'}
            ]).exec(function (err,Venta) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(Venta){
                 res.status(200).send(Venta);    
                }  
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.Egresos.findByIdAndUpdate({_id:req.body._id},{estado:0});

            //Actualizar stock
            let detalles=reg.detalles;
           
            detalles.map(function(x){
                aumentarStock(x._id,x.cantidad,x.fracciones);
            });
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }, 
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.Egresos.findByIdAndUpdate({_id:req.body._id},{estado:1});
            //Actualizar stock
                let codigoInventarioR = reg.codigoInventarioR;
                let detalles=reg.detalles;
          
            detalles.map(function(x){
                disminuirStock(x._id,x.cantidad,x.fracciones);
            });
            res.status(200).json(reg); 
        
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    contarVentas : async (req,res,next)=> {
        try {
            const reg = await models.Egresos.estimatedDocumentCount(function(err,count) {
                if (err) return handleError(err);
                 if(count){
                    
                   let contadorEntero = parseInt(count)+1
                    
                   
                     res.status(200).json(paddy(parseInt(contadorEntero),9))
                 }
                 
            });
           
           
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listporFechas: async (req,res,next) => {
        try { 
            let valor=req.query.valor;
            let finicio=req.query.fechainicio; 
            let ffin=req.query.fechafin;
            Egreso.find({$and:[{'codigoInventarioE':valor},{createdAt:{"$gte":new Date(finicio), "$lt":new Date(ffin)}}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'inventarios'},
                {path:'codigoInventarioR', model:'inventarios'}
            ])
            .exec(function (err,ingreso) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(ingreso){
                 res.status(200).send(ingreso);    
                }
                
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listporFechasAdmin: async (req,res,next) => {
        try { 
            let valor=req.query.valor;
            let finicio=req.query.fechainicio; 
            let ffin=req.query.fechafin;
            Egreso.find({$and:[{createdAt:{"$gte":new Date(finicio), "$lt":new Date(ffin)}}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'inventarios'},
                {path:'codigoInventarioR', model:'inventarios'}
            ])
            .exec(function (err,ingreso) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(ingreso){
                 res.status(200).send(ingreso);    
                }
                
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    queryHistorial: async (req, res, next) => {
        try {

            let valor = req.query.valor;
            Egreso.find({ $and: [{ 'detalles.codigoBarras': valor },{codigoInventarioE:req.query.codigoInventario}] }).populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'inventarios'},
                {path:'codigoInventarioR', model:'inventarios'}
               ])
                .sort({'createdAt':-1})
                .exec(function (err, Ingreso) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Ingreso) {
                        res.status(200).send(Ingreso[0]);
                    }
                })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'+e
            });
            next(e);
        }
    }, 
    
    
}

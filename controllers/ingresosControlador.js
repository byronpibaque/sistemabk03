import models from '../models';
import Ingreso from '../models/ingresos';
import mongoose, { model } from 'mongoose';

async function aumentarStock(idarticulo,cantidad,fracciones){
    let {fraccionesTotales}=await models.Producto.findOne({_id:idarticulo});//FRACCIONES TOTALES DE PRODUCTOS
    
    let {fraccionCaja}= await models.Producto.findOne({_id:idarticulo});//Fracciones por caja

    let nuevafrac = parseInt(cantidad)*parseInt(fraccionCaja);

    let nfracionesTotal = parseInt(fraccionesTotales)+parseInt(nuevafrac)+parseInt(fracciones);

    const reg2=await models.Producto.findByIdAndUpdate({_id:idarticulo},{fraccionesTotales:nfracionesTotal}).then((result) => {
        return true
    }).catch((err) => {
        return false
    });}

async function disminuirStock(idarticulo,cantidad,fracciones){
    let {fraccionesTotales}=await models.Producto.findOne({_id:idarticulo});
    let {fraccionCaja}= await models.Producto.findOne({_id:idarticulo});//Fracciones por caja
    let nuevafrac = parseInt(cantidad)*parseInt(fraccionCaja);
    let nfracionesTotal = parseInt(fraccionesTotales)-parseInt(nuevafrac)-parseInt(fracciones);
  
    const reg2=await models.Producto.findByIdAndUpdate({_id:idarticulo},{fraccionesTotales:nfracionesTotal}).then(async (result) => {
        return true
    }).catch((err) => {
        return false
    });
    
}

export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.Ingreso.create(req.body);
            //Actualizar stock
            let detalles=req.body.detalles;
            detalles.map(function(x){
                aumentarStock(x._id,x.cantidad,x.fraccionesN);
            });
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

            Ingreso.findOne({_id:req.query._id}).populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoPersona', model:'persona',select:'nombres'}
            ])
                .exec(function (err,ingreso) {
                    if(err)  
                    return res.status(500).send({
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
    listporFechas: async (req,res,next) => {
        try { 
            let valor=req.query.valor;
            let finicio=req.query.fechainicio; 
            let ffin=req.query.fechafin;
            Ingreso.find({$and:[{'codigoFarmacia':valor},{createdAt:{"$gte":finicio, "$lt":ffin}}]})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoPersona', model:'persona',select:'nombres'}
            ])
            .sort({createdAt:-1})
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
            Ingreso.find({$and:[{createdAt:{"$gte":new Date(finicio), "$lt":new Date(ffin)}}]})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoPersona', model:'persona',select:'nombres'}
            ])
            .sort({createdAt:-1})
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
    listFiltro: async (req,res,next) => {
        try {
            const moment = require('moment')
            const today = moment().startOf('day');
            let valor=req.query.valor;
         
            Ingreso.find({$or:[{'codigoFarmacia':valor}]})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codgioPersona', model:'persona',select:'nombres'}])
                .sort({createdAt:-1})
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
    list: async (req,res,next) => {
        try {
           
            let valor=req.query.valor;
            Ingreso.find({'codigoFarmacia':valor}).populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codgioPersona', model:'persona',select:'nombres'}])
                .sort({createdAt:-1})
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
    listtotal: async (req,res,next) => {
        try {
           
            let valor=req.query.valor;
            Ingreso.find({$or:[{'numComprobante':new RegExp(valor,'i')}]}).populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codgioPersona', model:'persona',select:'nombres'}])
                .sort({createdAt:-1})
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
    /*
    update: async (req,res,next) => {
        try {
            const reg = await models.Categoria.findByIdAndUpdate({_id:req.body._id},{nombre:req.body.nombre,descripcion:req.body.descripcion});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.Categoria.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    */
    activate: async (req,res,next) => {
        try {
            const reg = await models.Ingreso.findByIdAndUpdate({_id:req.body._id},{estado:1});
            //Actualizar stock
            let detalles=reg.detalles;
            detalles.map(function(x){
                aumentarStock(x._id,x.cantidad,x.fraccionesN);
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
            const reg = await models.Ingreso.findByIdAndUpdate({_id:req.body._id},{estado:0});
            //Actualizar stock
            let detalles=reg.detalles;
            detalles.map(function(x){
                disminuirStock(x._id,x.cantidad,x.fraccionesN);
            });
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    reportetotal:async(req,res,next) =>{
        try {
            const ObjectId1 = mongoose.Types.ObjectId;
            let Finicio = req.query.start;
            let Ffin = req.query.end;

                const reg = await models.Ingreso.aggregate(
                [
                    { $match:
                     { $and: [
                         { estado: 1 },
                      //   {codigoFarmacia:ObjectId1(cdf)},
                         { createdAt: { "$gte": new Date(Finicio), "$lt": new Date(Ffin) } }
                        ] }
                     },
                    {
                        $group:{
                            _id: {
                                codigoFarmacia: "$codigoFarmacia"
                            },
                            total: { $sum: "$total" },
                        }
                    },
                    {
                        $sort: {
                            "_id.codigoFarmacia": 1
                        }
                    }
                  
                ]
                ) 
                await models.Farmacia.populate(reg,{path:"_id.codigoFarmacia",select:{descripcion:1}})
               

                res.status(200).json(reg)
        } catch(e){
                res.status(500).send({
                    message:'Ocurrió un error'
                });
                next(e);
         }
    },
    grafico12Meses:async(req,res,next) =>{
        try {
            const reg=await models.Ingreso.aggregate(
                [
                    {
                        $group:{
                            _id:{
                                mes:{$month:"$createdAt"},
                                year:{$year: "$createdAt"}
                            },
                            total:{$sum:"$total"},
                            numero:{$sum:1}
                        }
                    },
                    {
                        $sort:{
                            "_id.year":-1,"_id.mes":-1
                        }
                    }
                ]
            ).limit(12);
            
            res.status(200).json(reg);
        } catch(e){
                res.status(500).send({
                    message:'Ocurrió un error'
                });
                next(e);
         }
    },
    consultaFechas: async (req,res,next) => {
        try {
            let start=req.query.start;
            let end=req.query.end;
            
            
            Ingreso.find({"createdAt": {"$gte": start, "$lt": end}})
            .sort({'createdAt':-1})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoPersona', model:'persona',select:'nombres'}])
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
    ReporteIngresoDetalles:async (req,res,next)=>{
        try {

            let codigoFarmacia = req.query.codigoFarmacia
            let codigoUsuario = req.query.codigoUsuario
            let finicio = req.query.fechaInicio
            let ffin = req.query.fechaFin

            let arri = []
            Ingreso.find({
                $and: [
                    { 'codigoFarmacia': codigoFarmacia },
                    { 'codigoUsuario': codigoUsuario },
                    { createdAt: { "$gte": finicio, "$lt": ffin } }
                ]
            })
                .populate([
                    { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                    { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codgioPersona', model: 'persona' }])
                .exec(function (err, Venta) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Venta) {

                       Venta.forEach(element => {

                          element.detalles.forEach(x => {
                              arri.push({
                                '_id': x._id,
                                'codigoInventario': x.codigoInventario,
                                'producto': x.producto,
                                'cantidad': x.cantidad,
                                
                                'fracciones': x.fraccionesN,
                                'f':x.fracciones,
                                'numComprobante':element.numComprobante,
                                'codgioPersona':element.codgioPersona.nombres,
                                'descripcion':element.descripcion,
                                'estado':element.estado,
                                'fecha':element.createdAt,
                               
                              })
                          });
                       });

                        res.status(200).send(arri);
                    }
                })

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'+e
            });
            next(e);
        }
    },
    queryHistorial: async (req, res, next) => {
        try {

            let valor = req.query.valor;
            Ingreso.find({ $or: [{ 'detalles._id': valor }] }).populate([
                { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                { path: 'detalles._id', model: 'productos' },
                { path: 'codgioPersona', model: 'persona' }])
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

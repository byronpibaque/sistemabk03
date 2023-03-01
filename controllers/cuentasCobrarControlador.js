
import ctacobrar from '../models/cuentasporcobrar';
import { parseZone } from 'moment';
import mongoose from 'mongoose';
import moment from "moment";
import models from '../models';

export default {
    add: async (req,res,next) =>{
        try {
            const reg = await ctacobrar.create(req.body);
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

            ctacobrar.findOne({_id:req.query._id}).populate([
                {path:'codigoVenta', model:'ventas'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoPersona', model:'persona',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'}
            ])
                .exec(function (err,CtaCobrar) {
                    if(err)  
                    return res.status(500).send({
                                    message:'Ocurrió un error: '+err
                                 });
                    if(CtaCobrar)
                    {
                     res.status(200).send(CtaCobrar);    
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
            ctacobrar.find({$or:[{'numComprobante':new RegExp(valor,'i')}]}).populate([
                {path:'codigoVenta', model:'ventas'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoPersona', model:'persona',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'}
            ])
                .exec(function (err,CtaCobrar) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(CtaCobrar){
                 res.status(200).send(CtaCobrar);    
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
            ctacobrar.find({$and:[{'descripcion':valor},{'numComprobante':valor2}]})
            .populate([
                {path:'codigoVenta', model:'ventas'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoPersona', model:'persona',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'}
            ])
                .exec(function (err,CtaCobrar) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(CtaCobrar){
                 res.status(200).send(CtaCobrar);    
                }
                
            })

            
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },

    remove: async (req,res,next) => {
        try {
            const reg = await ctacobrar.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
   
    activate: async (req,res,next) => {
        try {
            const reg = await ctacobrar.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg = await ctacobrar.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    grafico12Meses:async(req,res,next) =>{
        try {
            const reg=await ctacobrar.aggregate(
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
            
            
            ctacobrar.find({"createdAt": {"$gte": start, "$lt": end}})
            .sort({'createdAt':-1})
            .populate([
                {path:'codigoVenta', model:'ventas'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoPersona', model:'persona',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'}
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
    listporFechas: async (req,res,next) => {
        try { 
            let codigoFarmacia=req.query.codigoFarmacia;
            let finicio=req.query.fechainicio; 
            let ffin=req.query.fechafin;
            ctacobrar.find({$and:[
                {'codigoFarmacia':codigoFarmacia},
                { createdAt: { "$gte": finicio, "$lt": ffin } }
        ]
        })
            .populate([
                {path:'codigoVenta', model:'ventas'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoPersona', model:'persona',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'}
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
            ctacobrar.find({$and:[
                { createdAt: { "$gte": finicio, "$lt": ffin } }
            ]})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoPersona', model:'persona',select:'nombres'}
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
    listporCliente: async (req,res,next) => {
        try { 
            let codigoPersona=req.query.codigoPersona;
            let finicio=req.query.fechainicio; 
            let ffin=req.query.fechafin;
            ctacobrar.find({$and:[
                {codigoPersona:codigoPersona},
                { createdAt: { "$gte": finicio, "$lt": ffin } }
            ]})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoPersona', model:'persona',select:'nombres'}
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
    reporteCuentas: async (req,res,next)=>{
        try {
            const ObjectId1 = mongoose.Types.ObjectId;
            let Finicio = req.query.start;
            let Ffin = req.query.end;
            let cdf = req.query.codigoFarmacia
            let cdu = req.query.codigoUsuario
           console.log(Finicio);
           console.log(Ffin);
            

            const reg = await ctacobrar.aggregate(
            [ 
                { $match:
                 { $and: [
                     { estado: 1 },
                  //   {codigoFarmacia:ObjectId1(cdf)},
                  { createdAt: { "$gte": new Date(Finicio), "$lt":new Date(Ffin) } }
                    ] }
                 },
                {
                    $group:{
                        _id: {
                            codigoPersona: "$codigoPersona", 
                        },
                        total: { $sum: "$total" },                        
                    },
                }
             
            ]
            ) 
            await models.Persona.populate(reg,{path:"_id.codigoPersona",select:{nombres:1}})
        
            res.status(200).json(reg)
        } catch (error) {
            res.status(500).send({
                message:'Ocurrió un error:'+error
            });
            next(error);
        }
    }
    
    
    
}

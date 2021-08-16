import models from '../models';
import moment from "moment";
function formatearFecha(value) {
    if (value) {
      return moment(String(value)).format("MM/DD/YYYY hh:mm");
    }
  }
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.Arqueos.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar Arqueo.'
            });
            next(e);
        }
    },  
    query: async (req,res,next) => {
        try {
            const reg=await  models.Arqueos.findOne({_id:req.query._id});
            if (!reg){
                res.status(404).send({
                    message: 'El registro no existe.'
                });
            } else{
                res.status(200).json(reg);
            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de Rol.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let codigoFarmacia = req.query.codigoFarmacia;
            let Finicio=req.query.Finicio
            let Ffin=req.query.Ffin
            let valor=req.query.valor;
            if(codigoFarmacia!=null){
                const reg=await models.Arqueos.find({$and:[{'codigoFarmacia':codigoFarmacia},
                {createdAt: 
                {
                    "$gte":Finicio,
                    "$lte":Ffin
                }} 
            ]})
                .populate([
                    {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                    {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'}
                ])
                .sort({'createdAt':-1});
                res.status(200).json(reg);
            }else{
                const reg=await models.Arqueos.find({$and:[{'codigoFarmacia':codigoFarmacia},
                {createdAt: 
                {
                    "$gte":Finicio,
                    "$lte":Ffin
                }} 
            ]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'}
            ])
            .sort({'createdAt':-1});
                res.status(200).json(reg);
            }
            
           
        } catch(e){ 
            res.status(500).send({
                message:'Ocurrió un error al intentar listar Arqueos.'
            });
            next(e);
        }
            
    },
    remove: async (req,res,next) => {
        try {
            const reg = await  models.Arqueos.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el Rol.'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.Arqueos.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar Arqueo.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.Arqueos.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar Arqueo.'
            });
            next(e);
        }
    },
    SumarTotales:async(req,res,next)=>{
        try {
            let start = req.query.fi;
            let end = req.query.ff;
            let valor = req.query.codigoFarmacia
            let valor2 = req.query.codigoUsuario
            Venta.find({
                $and: [{ estado: 1 }, { 'codigoFarmacia': valor },
                { 'codigoUsuario': valor2 },
                { 'createdAt': { $gte:start } },
                { 'createdAt': { $lt:end } }
            ]
            })
                .populate([
                    { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                    { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codgioPersona', model: 'persona', select: 'nombres' }])
                .exec(function (err, Venta) {
                   if (err) throw res.status(500).send({ message: 'Ocurrió un error: ' + err });
                    if (Venta) {
                        res.status(200).send(Venta);
                    }
                })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
           
        }
    },
    existeRegistro:async(req,res,next)=>{
        try {
            let cf=req.query.cf;
            let cu=req.query.cu;
            // var fi =req.query.fi
            // var ff =req.query.ff
            var seccion = req.query.sc

            const reg=await  models.Arqueos
            .find({
                $and:[
                    { 
                        codigoUsuario:cu
                    },
                    {
                        codigoFarmacia:cf
                    },
                    {
                        seccion : seccion
                    },   
                                 
                ]
            })
            .exec(function (err,Existe) {
                if(err)throw  res.status(500).send({ 
                    message:'Ocurrió un error: '+err
                    });
                    res.status(200).send(Existe);
            })
        } catch(e){ 
            res.status(500).send({
                message:'Ocurrió un error al intentar listar Arqueos.'
            });
            next(e);
        }
    },  
    listporFechas: async (req,res,next) => {
        try { 
            let codigoFarmacia=req.query.codigoFarmacia;
            let finicio=req.query.fechainicio; 
            let ffin=req.query.fechafin;
            models.Arqueos.find({$and:[{'codigoFarmacia':codigoFarmacia},
            {    createdAt: 
                {
                    "$gte":finicio,
                    "$lte":ffin
                } }]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
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
            models.Arqueos.find({$and:[{createdAt:{$gte:new Date(finicio+"T12:00:00.000Z")}},
            {createdAt:{$lt:new Date(ffin+"T04:59:00.000Z")}}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
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
}

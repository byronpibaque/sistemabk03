import models from '../models';
import Farmacia from '../models/farmacia';
  

export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.Farmacia.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },query: async (req,res,next) => {
        try {
        Farmacia.findOne({_id:req.query._id}).populate([
           {path:'codigoFarmacia', model:'farmacias',select:'descripcion'},
           {path:'codigoSupervisor', model:'usuarios', select:'nombres'},
           {path:'codigoUsuario', model:'usuarios', select:'nombres'},
           {path:'codigoLider', model:'usuarios', select:'nombres'},
           {path:'codigoPropietario', model:'persona'}]).exec(function (err,farmacia) {
               if(err)  
               return res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(farmacia){
                res.status(200).send(farmacia);    
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
           Farmacia.find({$or:[{'descripcion':new RegExp(valor,'i')},
           {'num_establecimiento':new RegExp(valor,'i')}]}).populate([
            {path:'codigoFarmacias', model:'farmacias',select:'descripcion'},
            {path:'codigoSupervisor', model:'usuarios', select:'nombres'},
            {path:'codigoUsuario', model:'usuarios', select:'nombres'},
            {path:'codigoLider', model:'usuarios', select:'nombres'},
            {path:'codigoPropietario', model:'persona'}])
            .sort({descripcion:1})
            .exec(function (err,usuario) {
               if(err)throw  res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(usuario){
                res.status(200).send(usuario);    
               }
               
           })

        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    updateIP: async (req,res,next) => {
        try {         
            const reg = await models.Farmacia.findByIdAndUpdate({_id:req.body._id},
                {   ippublica:req.body.ippublica
                });
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {         
            const reg = await models.Farmacia.findByIdAndUpdate({_id:req.body._id},
                {   codigoFarmacias:req.body.codigoFarmacias,
                    correo:req.body.correo,
                    descripcion:req.body.descripcion,
                    num_establecimiento:req.body.num_establecimiento,
                    ubicacion:req.body.ubicacion,
                    codigoLider:req.body.codigoLider,
                    codigoUsuario:req.body.codigoUsuario,
                    codigoSupervisor:req.body.codigoSupervisor,
                    codigoPropietario:req.body.codigoPropietario,
                    ciudad:req.body.ciudad,
                    region:req.body.region,
                    provincia:req.body.provincia,
                    parroquia:req.body.parroquia,
                    horarioAPT:req.body.horarioAPT,
                    horarioCPT:req.body.horarioCPT,
                    horarioAST:req.body.horarioAST,
                    horarioCST:req.body.horarioCST,

                });
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
            const reg = await models.Farmacia.findByIdAndDelete({_id:req.body._id});
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
            const reg = await models.Farmacia.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg = await models.Farmacia.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }
}

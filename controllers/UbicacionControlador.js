import models from '../models';
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.Ubicacion.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar Ubicacion.'
            });
            next(e);
        }
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.Ubicacion.findOne({_id:req.query._id});
            if (!reg){
                res.status(404).send({
                    message: 'El registro no existe.'
                });
            } else{
                res.status(200).json(reg);
            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de Ubicacion.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.Ubicacion.find()
            
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar las Abreviaturas.'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {         
            const reg = await models.Ubicacion.findByIdAndUpdate({_id:req.body._id},
                {nombre:req.body.nombre,abreviatura:req.body.abreviatura});
                    
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar la Ubicacion.'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.Ubicacion.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar la Ubicacion.'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.Ubicacion.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar la Ubicacion.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.Ubicacion.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar la Ubicacion.'
            });
            next(e);
        }
    }
}

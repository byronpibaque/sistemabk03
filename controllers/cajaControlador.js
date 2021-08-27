import models from '../models';
export default {
    add: async (req,res,next) =>{  
        try {
            const reg = await models.caja.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar caja.'
            });
            next(e);
        }  
    },
    query: async (req,res,next) => {
        try {
            const reg=await models.caja.findOne({$and:[{codigoUsuario:req.query.codigoUsuario},{codigoFarmacia:req.query.codigoFarmacia}]})
            .populate([
                { path: "codigoUsuario", model: "usuarios"},
                { path: "codigoFarmacia",model: "detallefarmacias"},
              ])
            if (!reg){
                res.status(207).send({
                    message: 'El registro no existe.'
                });
            } else{
                res.status(200).json(reg);
            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de caja.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await models.caja.find()
            .populate([
                { path: "codigoUsuario", model: "usuarios"},
                { path: "codigoFarmacia",model: "detallefarmacias"},
              ])
            .sort({'nombre':1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar las cajas.'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {         
            const reg = await models.caja.findByIdAndUpdate({_id:req.body._id},
                {nombre:req.body.nombre,descripcion:req.body.descripcion});
                    
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al actualizar la caja.'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.caja.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar la caja.'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.caja.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar la caja.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.caja.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar la caja.'
            });
            next(e);
        }
    }
}

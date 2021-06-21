import models from '../models/vademecum';

export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error'
            }); 
            next(e);
        } 
    },
    queryA: async (req,res,next) => {
        try {
        
            models.findOne({_id:req.query._id}).populate([
           {path:'codigoProducto', model:'productos'},
           ]).exec(function (err,producto) {
               if(err)  
               return res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(producto){
                res.status(200).send(producto);    
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
           
           models
           .find()
           .populate
           ([
            {path:'codigoProducto', model:'productos'},
           ])
            .exec(function (err,producto) {
               if(err)throw  res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(producto){
                res.status(200).send(producto);    
               }
               
           })

        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {         
            const reg = await models.findByIdAndUpdate({_id:req.body._id},
                {  

                    codigoProducto:req.body.codigoProducto,
                    indicacion:req.body.indicacion,
                    dosificacion:req.body.dosificacion,
                    contraindicacion:req.body.contraindicacion,
                    efectosSecundarios:req.body.efectosSecundarios,


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
            const reg = await models.findByIdAndDelete({_id:req.query._id});
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
            const reg = await models.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg = await models.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }
}

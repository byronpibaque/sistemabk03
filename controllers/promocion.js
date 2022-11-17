
import cupo from '../models/promocion';



export default {
    add: async (req,res,next) =>{
        try{
            const reg = await cupo.create(req.body);
            res.status(200).json(reg);
        }catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    query: async (req,res,next) => {
        try {

            cupo.findOne({_id:req.query._id}).populate([
                {path:'producto.codigoInventario', model:'inventarios'},
                {path:'codigoUsuario', model:'usuarios'},
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
            cupo.find({$or:[{'promocion':new RegExp(valor,'i')}]})
            .populate([
               
                {path:'producto.codigoInventario', model:'inventarios'},
                {path:'codigoUsuario', model:'usuarios'},
               
              
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
            cupo.find({$and:[{'promocion':valor}]})
            .populate([
               
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
               
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
    update: async (req,res,next) => {
        try {
            const reg = await cupo.findByIdAndUpdate(
                {_id:req.body._id},{
                    descripcion:req.body.descripcion,
                    topemax:req.body.topemax,
                    topemin:req.body.topemin,
                    codigoPersona:req.body.codigoPersona
                });
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    updateCupo: async (req,res,next) => {
        try {
            const reg = await cupo.findByIdAndUpdate(
                {_id:req.body._id},{
                    
                    topemin:req.body.topemin,
                    
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
            const reg = await cupo.findByIdAndDelete({_id:req.query._id});
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
            const reg = await cupo.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg = await cupo.findByIdAndUpdate({_id:req.body._id},{estado:0});
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
            
            
            cupo.find({"createdAt": {"$gte": start, "$lt": end}})
            .sort({'createdAt':-1})
            .populate([
            
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
              
                
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
            let valor=req.query.valor;
            let finicio=req.query.fechainicio; 
            let ffin=req.query.fechafin;
            cupo.find({$and:[{createdAt:{"$gte":new Date(finicio), "$lt":new Date(ffin)}}]})
            .populate([
              
                {path:'producto.codigoInventario', model:'inventarios'},
                {path:'codigoUsuario', model:'usuarios'},
              
              
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
            cupo.find({$and:[{createdAt:{"$gte":new Date(finicio), "$lt":new Date(ffin)}}]})
            .populate([
               
                {path:'producto.codigoInventario', model:'inventarios'},
                {path:'codigoUsuario', model:'usuarios'},
               
               
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
    existeRegistro:async(req,res,next)=>{
        try {
            let cp=req.query.codigoProducto;
            const reg=await cupo.find({'producto._id':cp}) 
            .populate([
                
                {path:'producto.codigoInventario', model:'inventarios'},
                {path:'codigoUsuario', model:'usuarios'},
           
              
            ]) 
            .exec(function (err,Existe) {
               
                if(err)throw  res.status(500).send({ 
                    message:'Ocurrió un error: '+err
                    });
                  //  console.log(Existe)
                if(Object.entries(Existe).length==0){
                    
                    res.status(204).send({ message:'no existe'}); 
                    
                }else{
                    res.status(200).send(Existe);  
                    
                }
            })
            
           
        } catch(e){ 
            res.status(500).send({
                message:'Ocurrió un error al intentar buscar.'
            });
            next(e);
        }
    },
    
    
    
}

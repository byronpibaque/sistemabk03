
import cupo from '../models/cupo';
 


export default {
    add: async (req,res,next) =>{
        try {
            const reg = await cupo.create(req.body);
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

            cupo.findOne({_id:req.query._id}).populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoPersona', model:'persona',select:'nombres'},
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
            cupo.find({$or:[{'descripcion':new RegExp(valor,'i')}]})
            .populate([
                
                {path:'codigoUsuario', model:'usuarios'},
                {path:'codigoPersona', model:'persona'},
              
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
            cupo.find({$and:[{'descripcion':valor}]})
            .populate([
               
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoPersona', model:'persona',select:'nombres'},
              
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
    grafico12Meses:async(req,res,next) =>{
        try {
            const reg=await cupo.aggregate(
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
            
            
            cupo.find({"createdAt": {"$gte": start, "$lt": end}})
            .sort({'createdAt':-1})
            .populate([
            
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoPersona', model:'persona',select:'nombres'},
                
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
              
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoPersona', model:'persona',select:'nombres'},
              
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
               
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
               
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
            let cp=req.query.codigoPersona;
            const reg=await cupo.find({$and:[{codigoPersona:cp},{estado:1}]}) 
            .populate([
                
                {path:'codigoUsuario', model:'usuarios'},
                {path:'codigoPersona', model:'persona'},
              
            ])
            .exec(function (err,Existe) {
               
                if(err)throw  res.status(500).send({ 
                    message:'Ocurrió un error: '+err
                    });
                    
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

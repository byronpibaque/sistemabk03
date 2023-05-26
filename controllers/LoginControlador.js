import bcryptjs from 'bcryptjs';
import models from '../models';
import Login from '../models/login';
import token from '../services/token'
export default {
    add: async (req,res,next) =>{
        try {
            req.body.password=await bcryptjs.hash(req.body.password,10);
            const reg = await Login.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }, queryCode: async (req,res,next) => {
       

        try {
            let valor=req.query.valor;
           
            Login
            .find({'codigoUsuario':valor})
            .populate([
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'rol', model:'rol',select:'descripcion'},
               {path:'codigoUsuario', model:'usuarios',select:['nombres','rol']}])
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
    query: async (req,res,next) => {
        try {
        
           Login.findOne({_id:req.query._id}).populate([
            {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
            {path:'rol', model:'rol',select:'descripcion'},
           {path:'codigoUsuario', model:'usuarios',select:['nombres','rol']}]).exec(function (err,usuario) {
               if(err)  
               return res.status(500).send({
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
    listFiltro: async (req,res,next) => {
        try {
           let cdf=req.query.codigoFarmacia;
           Login.find({codigoFarmacia:cdf})
           .populate([
            {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
            {path:'rol', model:'rol',select:'descripcion'},
           {path:'codigoUsuario', model:'usuarios',select:'nombres'}
            ])
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
    list: async (req,res,next) => {
        try {
           let valor=req.query.valor;
           Login.find({'email':new RegExp(valor,'i')}).populate([
            {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
            {path:'rol', model:'rol',select:'descripcion'},
           {path:'codigoUsuario', model:'usuarios',select:['nombres']}
        ]).exec(function (err,usuario) {
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
    update: async (req,res,next) => {
        try { 
            console.log(req.body)
             let pass = req.body.password;
             const reg0 = await Login.findOne({codigoUsuario:req.body.codigoUsuario});
             console.log(reg0)
             if (pass!=reg0.password ) {
                req.body.password= await bcryptjs.hash(req.body.password,10);  
             }   
              
            const reg = await Login.findByIdAndUpdate({_id:reg0._id},
                {   
                    email:req.body.email,
                    password:req.body.password,
                    codigoUsuario:req.body.codigoUsuario,
                    codigoFarmacia:req.body.codigoFarmacia,
                    rol:req.body.rol,
                    usuario:req.body.usuario
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
            const reg = await Login.findByIdAndDelete({_id:req.query._id});
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
            const reg = await Login.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg = await Login.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    login:async(req,res,next)=>{
        try {
            let user = await Login.findOne({$or:[{email:req.body.email},{usuario:req.body.email}]});
                if (user) {
                    if(user.estado==1){
                       
                        let codEmpresa=req.body.codigoEmpresa;
                        if(codEmpresa){
                            let match = await bcryptjs.compare(req.body.password, user.password);
                            if (match){
                                let tokenReturn = await token.encode(user._id,user.rol,user.email,user.codigoFarmacia,user.codigoUsuario,codEmpresa);
                                res.status(200).json({user,tokenReturn});
                            }else{
                                res.status(500).send({
                                    message:'Clave incorrecta, verifique.'
                                });
                            }
                        }else{
                            
                            const rol = await models.Rol.findOne({_id:user.rol})
                            if(rol.descripcion=="Administrador"){
                                let match = await bcryptjs.compare(req.body.password, user.password);
                                if (match){
                                    let tokenReturn = await token.encode(user._id,user.rol,user.email,user.codigoFarmacia,user.codigoUsuario,null);
                                    res.status(200).json({user,tokenReturn});
                                }else{
                                    res.status(500).send({
                                        message:'Clave incorrecta, verifique.'
                                    });
                                }
                            }
                        }
                    }else{
                        res.status(500).send({
                            message:'Usuario inactivo.'
                        });  
                    }
                    
                    
                }else{
                    res.status(500).send({
                        message:'Usuario inexistente, verifique.'
                    });
                }
           

            
            

        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    actualizarDatos: async (req,res,next) => {
        try { 
            const reg0 = await Login.findOne({codigoUsuario:req.body._id});
            let tipoModificacion = req.body.tipoModificacion
            if(tipoModificacion==1){
                const reg = await Login.findByIdAndUpdate({_id:reg0._id},
                    {                          
                        usuario:req.body.usuario
                    });
                    if(reg){res.status(200).json(reg);}else{ res.status(204).send({message:'Ocurrió un error'}); }
              
            }else if(tipoModificacion==2){
                const reg = await Login.findByIdAndUpdate({_id:reg0._id},
                    {                          
                        email:req.body.correo
                    });
                    if(reg){res.status(200).json(reg);}else{ res.status(204).send({message:'Ocurrió un error'}); }
            }else if(tipoModificacion==3){
                let pass = req.body.password;              
                if (pass!=reg0.password ) {
                   req.body.password= await bcryptjs.hash(req.body.password,10);  
                }  
                const reg = await Login.findByIdAndUpdate({_id:reg0._id},
                    {                          
                        password:req.body.password
                    });
                    if(reg){res.status(200).json(reg);}else{ res.status(204).send({message:'Ocurrió un error'}); } 
            }
            
              
           
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'+e
            });
            next(e);
        }
    },
}

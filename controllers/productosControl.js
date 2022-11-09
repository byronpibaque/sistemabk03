import models from '../models';
import Producto from '../models/productos';
async function ObtenerInventario(codigoFarmacia){
    let {_id}=await models.Inventario.findOne({detalleFarmacia:ObjectId(codigoFarmacia)});

    return _id;

}
async function actualizardescuentoporproducto(id,descuento){

    const reg = await models.Producto.findByIdAndUpdate(
        { _id: id },
        {descuento:descuento}
        )
}
async function actualizarParametrosProductos(id,nombre,nombreComercial,pvp,costo,punit,desc,idLab,idCat,idPre,iva,barra) {
    const reg = await models.Producto.findByIdAndUpdate(
        { _id: id },
        {   
            nombre:nombre,
            nombreComercial:nombreComercial,
            costoNeto:costo,
            pvp:pvp,
            precioUni:punit,
            descuento:desc,
            codigoLaboratorio:idLab,
            codigoCategoria:idCat,
            codigoPresentacion:idPre,
            codigoBarras:barra,
            iva:iva
        }
        )
}
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.Producto.create(req.body);
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

            Producto.findOne({_id:req.query._id}).populate([
           {path:'codigoCategoria', model:'categoria',select:'descripcion'},
           {path:'codigoLaboratorio', model:'laboratorio',select:'descripcion'},
           {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
           {path:'codigoInventario', model:'inventarios',select:'descripcion'}])
           .exec(function (err,producto) {
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
    query: async (req,res,next) => {
        try {

            Producto.findOne({codigoBarras:req.query.codigoBarras}).populate([
           {path:'codigoCategoria', model:'categoria',select:'descripcion'},
           {path:'codigoLaboratorio', model:'laboratorio',select:'descripcion'},
           {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
           
           {path:'codigoInventario', model:'inventarios',select:'descripcion'}]).exec(function (err,producto) {
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
    queryB: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            Producto.findOne({$and:[{'codigoInventario':valor},{codigoBarras:req.query.codigoBarras}]})
            .populate([
           {path:'codigoCategoria', model:'categoria',select:'descripcion'},
           {path:'codigoLaboratorio', model:'laboratorio',select:'descripcion'},
           {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
          
           {path:'codigoInventario', model:'inventarios',select:'descripcion'}]).exec(function (err,producto) {
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
    listporCaracteres: async (req,res,next) => {
        try {
           let valor=req.query.valor;

           let caracter1 = req.query.car1
           let caracter2 = req.query.car2
           Producto
           .find(
            {$and:
            [
            {'codigoInventario':valor},
            {$or:[
            {'nombre': new RegExp('^'+caracter1,'i')},
            {'nombre':  new RegExp(caracter2+'$','i')},
            {'nombreComercial': new RegExp('^'+caracter1,'i')},
            {'nombreComercial':  new RegExp(caracter2+'$','i')},
            ]}
            ]}
            )
           .populate
           ([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:'descripcion'}
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
    busquedaAvanzada: async (req,res,next) => {
        try {
           let valor=req.query.codigoInventario;
           let CB = req.query.codigoBarras;


           Producto
           .find(
            {$and:
            [
            {'codigoInventario':valor},
            {'codigoBarras':CB}
             ]}
            )
           .populate
           ([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:'descripcion'}
           ])
            .exec(function (err,producto) {
               if(err)throw  res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
                            if(producto.length!=0){

                             res.status(200).send(producto);
                           }else{

                             res.status(204).send({
                                 message:'No hay datos'
                             });
                           }

           })

        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    busquedaAvanzadaTodas: async (req,res,next) => {
        try {
           let CB = req.query.codigoBarras;

           Producto.find({$and: [{'codigoBarras':CB}]})
           .populate([
                {path:'codigoCategoria', model:'categoria',select:'nombre'},
                {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
                {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
                {path:'codigoInventario', model:'inventarios',select:['descripcion', 'estado']}
            ]).exec(function (err,producto) {
                if(err)throw  res.status(500).send({
                    message:'Ocurrió un error: '+err
                });
                if(producto.length!=0){
                    res.status(200).send(producto);
                }else{
                    res.status(204).send({
                        message:'No hay datos'
                    });
                }
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    busquedaAvanzadaTodasL: async (req,res,next) => {
        try {

           let producto = req.query.nombreComercial;


           Producto
           .find({$or:[{'nombre':new RegExp(producto,'i')},
           {'nombreComercial':new RegExp(producto,'i')}]})
           .populate
           ([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:'descripcion'}
           ])
            .exec(function (err,producto) {
               if(err)throw  res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(producto.length!=0){

                res.status(200).send(producto);
              }else{

                res.status(204).send({
                    message:'No hay datos'
                });
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
           let producto = req.query.producto;
           Producto
           .find({$and:[{'codigoInventario':valor},
           {$or:[{'nombre':new RegExp(producto,'i')},
           {'nombreComercial':new RegExp(producto,'i')}]}]})
           .populate
           ([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:'descripcion'}
           ])
            .exec(function (err,producto) {
               if(err)throw  res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(producto.length!=0){
                res.status(200).send(producto);
              }else{
                res.status(204).send({
                    message:'No hay datos'
                });
              }
           })

        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listxcategoria: async (req,res,next) => {
        try {
            let codigoCategoria=req.query.codigoCategoria;
            let codigoInventario = req.query.codigoInventario
            Producto
                .find({$and:[{'codigoCategoria':codigoCategoria},{'codigoInventario':codigoInventario}]})
                .populate
                ([
                    {path:'codigoCategoria', model:'categoria',select:'nombre'},
                    {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
                    {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
                    {path:'codigoInventario', model:'inventarios',select:'descripcion'}
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
    listxlaboratorio: async (req,res,next) => {
        try {
            let codigoLaboratorio=req.query.codigoLaboratorio;
            let codigoInventario=req.query.codigoInventario;

            Producto
                .find({$and:[{'codigoLaboratorio':codigoLaboratorio},{'codigoInventario':codigoInventario}]})
                .populate
                ([
                    {path:'codigoCategoria', model:'categoria',select:'nombre'},
                    {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
                    {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
                    {path:'codigoInventario', model:'inventarios',select:'descripcion'}
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
    listA: async (req,res,next) => {
        try {
           let valor=req.query.valor;
           let valor2 = req.query.valor2;
           Producto
           .find({$and:[{codigoLaboratorio:valor},{codigoInventario:valor2}]})
           .populate
           ([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:'descripcion'}
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
    listB: async (req,res,next) => {
        try {
           let valor=req.query.valor;

           Producto
           .find({'codigoInventario':valor})
           .populate([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:'descripcion'}])
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
    listtotalProductos: async (req,res,next) => {
        try {
           let valor=req.query.valor;
           Producto.find({$or:[{'nombre':new RegExp(valor,'i')},
           {'nombreComercial':new RegExp(valor,'i')}]})
           .populate([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:['descripcion', 'estado']}])
            .sort({"nombreComercial":1})
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
    listtotalcero: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            Producto.find({$and:[{'codigoInventario':valor},{stock:0},{fraccionesTotales:0}]})
                .populate([
                    {path:'codigoCategoria', model:'categoria',select:'nombre'},
                    {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
                    {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
                    {path:'codigoInventario', model:'inventarios',select:'descripcion'}])
                .sort({"nombreComercial":1})
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
    listtotalfracciones: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            Producto.find({$and:[{'codigoInventario':valor},{stock:0},{fraccionesTotales:{$gt:0}}]})
                .populate([
                    {path:'codigoCategoria', model:'categoria',select:'nombre'},
                    {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
                    {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
                    {path:'codigoInventario', model:'inventarios',select:'descripcion'}])
                .sort({"nombreComercial":1})
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
            const reg = await models.Producto.findByIdAndUpdate({_id:req.body._id},
                {

                    codigoBarras:req.body.codigoBarras,
                    nombre:req.body.nombre,
                    nombreComercial:req.body.nombreComercial,
                    stock:req.body.stock,
                    fraccionesTotales:req.body.fraccionesTotales,
                    fraccionCaja: req.body.fraccionCaja,
                    fechaCaducidad:req.body.fechaCaducidad,
                    costoNeto:req.body.costoNeto,
                    pvm:req.body.pvm,
                    pvp:req.body.pvp,
                    precioUni:req.body.precioUni,
                    descuento:req.body.descuento,
                    iva:req.body.iva,
                    codigoCategoria:req.body.codigoCategoria,
                    codigoLaboratorio:req.body.codigoLaboratorio,
                    codigoInventario:req.body.codigoInventario,
                    codigoPresentacion:req.body.codigoPresentacion,
                    codigoUsuario:req.body.codigoUsuario,
                    fechaModificacion:req.body.fechaModificacion
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
            const reg = await models.Producto.findByIdAndDelete({_id:req.query._id});
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
            const reg = await models.Producto.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg = await models.Producto.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    clonado:async (req,res,next) => {
        let codigoI = req.query.codigoInventario
        let codigoN = req.query.codigoNuevo
        let BaseDoc = []
        var mongoose = require('mongoose');

        try {
           (await models.Producto
            .find({'codigoInventario':codigoI}))
            .forEach(function (doc) {
                var id = mongoose.Types.ObjectId();
                doc.stock=0
                doc.fraccionesTotales=0
                doc.codigoInventario=codigoN
                doc._id=id

                BaseDoc.push(doc)

              });

              models.Producto.insertMany(BaseDoc)
              .then(function(docs){

                res.status(200).json("OK");
              })
              .catch(function(err){
                throw err;
              });

        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    eliminado: async (req,res,next) => {
        try {
           models.Producto.deleteMany({codigoInventario:req.query.codigoInventario})
            .then((result) => {
                res.status(200).json("OK");
            }).catch((err) => {
                throw err
            });

        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listaAlfabetica: async (req,res,next) => {
        try {

          let valor=req.query.codigoInventario;
          let letra = req.query.letra
          
           Producto
           .find({$and:[
               {'codigoInventario':valor},
               {'nombreComercial': new RegExp('^'+letra ,'i')},
               {'fraccionesTotales':{$ne:0}}
            ]})
           .populate([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:'descripcion'}])
            .sort({'nombreComercial':1})
            .exec(function (err,producto) {
               if(err)throw  res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(producto){
                   console.log(producto);
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
    duplicados:async(req,res,next)=>{
        try {
            let Cinventario = req.query.codigoInventario
            models.Producto
            .aggregate([
                { $group: {
                    _id: {
                        codigoBarras: "$codigoBarras",
                        codigoInventario:"$codigoInventario"
                    },
                    duplicados: {
                        $push:
                        {
                            _id:"$_id",
                            codigoBarras:"$codigoBarras",
                            nombre:"$nombreComercial",
                            stock:"$stock",
                            fraccionesTotales:"$fraccionesTotales"
                         }
                 },
                    count: { $sum: 1 }
                }},
                { $match:  { $and: [{ count: { "$gt": 1 } }] } },
                { $sort: {"_id.nombre": 1}
                }
            ],function (err,resultado) {
                if(err){
                    console.log(err);
                }

                let resp = []
               resultado.forEach(element => {

                   if(element._id.codigoInventario==Cinventario){
                     resp.push(element)
                   }

               });
               res.status(200).json(resp)

            })





         } catch(e){
             res.status(500).send({
                 message:'Ocurrió un error'
             });
             next(e);
         }
    },
    verificarExisteCodigoBarra:async (req,res,next)=>{
        try {


            var CB = req.query.CB
            let codigoInventario = req.query.codigoInventario
            const reg=await  models.Producto
            .find({
                $and:[
                    {
                        codigoBarras:CB
                    },
                    {
                        codigoInventario:codigoInventario
                    }
                ]
            })
            .exec(function (err,Existe) {
                if(err)throw  res.status(500).send({
                    message:'Ocurrió un error: '+err
                    });
                if(Object.entries(Existe).length==0){
                    res.status(206).send({ message:'no existe'});

                }else{
                    res.status(200).send({ message:'existe'});

                }
            })


        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar Arqueos.'
            });
            next(e);
        }
    },
    descuentos:async(req,res,next)=>{
        try {

        let msgErr=""
        let tipodescuento = req.body.tipodescuento
            if(tipodescuento=="LABORATORIO"){
                let codigoLaboratorio = req.body.codigoLaboratorio
                let codigoInventario = req.body.codigoInventario
                let descuento = req.body.descuento
                const regex1 = await models.Producto
                    .update({$and:[{codigoLaboratorio:codigoLaboratorio},{codigoInventario:codigoInventario}]},
                        {$set:{descuento:descuento}},{multi:true}).then(async(result) => {
                            res.status(200).json(result);
                        }).catch((err) => {
                            msgErr="OCURRIO UN ERROR, INTENTANDO ACTUALIZAR POR LABORATORIO:"+err
                            console.log(msgErr);
                            res.status(500).send({
                                message:msgErr
                            });

                        });

            }else if(tipodescuento=="CATEGORIA"){
                let codigoCategoria = req.body.codigoCategoria
                let codigoInventario = req.body.codigoInventario
                let descuento = req.body.descuento
                const regex2 = await models.Producto
                .update({$and:[{codigoCategoria:codigoCategoria},{codigoInventario:codigoInventario}]},
                    {$set:{descuento:descuento}},{multi:true}).then(async(result) => {
                        res.status(200).json(result);
                    }).catch((err) => {
                        msgErr="OCURRIO UN ERROR, INTENTANDO ACTUALIZAR POR CATEGORIA:"+err
                        console.log(msgErr);
                        res.status(500).send({
                            message:msgErr
                        });

                    });

            }else if(tipodescuento=="PRODUCTO"){
                let productos = req.body.productos
                let descuento = req.body.descuento
                
                productos.forEach(element => {
                       
                   actualizardescuentoporproducto(element._id,descuento)
                });

                    res.status(200).send({message:"DESCUENTO ACUALIZADO"})


            }else{
                msgErr="OCURRIO UN ERROR, TIPO DE DESCUENTO NO CONTROLADO."
                console.log(msgErr);
                res.status(500).send({
                    message:msgErr
                });
            }

        } catch (error) {
            res.status(500).send({
                message:error
            });
        }



    },
    descuentosAdmin:async(req,res,next)=>{
        try {

        let msgErr=""
        let tipodescuento = req.body.tipodescuento
            if(tipodescuento=="LABORATORIO"){
                let codigoLaboratorio = req.body.codigoLaboratorio
                let codigoInventario = req.body.codigoInventario
                let descuento = req.body.descuento
                const regex1 = await models.Producto
                    .update({$and:[{codigoLaboratorio:codigoLaboratorio},{codigoInventario:codigoInventario}]},
                        {$set:{descuento:descuento}},{multi:true}).then(async(result) => {
                            res.status(200).json(result);
                        }).catch((err) => {
                            msgErr="OCURRIO UN ERROR, INTENTANDO ACTUALIZAR POR LABORATORIO:"+err
                            console.log(msgErr);
                            res.status(500).send({
                                message:msgErr
                            });

                        });

            }else if(tipodescuento=="CATEGORIA"){
                let codigoCategoria = req.body.codigoCategoria
                let codigoInventario = req.body.codigoInventario
                let descuento = req.body.descuento
                const regex2 = await models.Producto
                .update({$and:[{codigoCategoria:codigoCategoria},{codigoInventario:codigoInventario}]},
                    {$set:{descuento:descuento}},{multi:true}).then(async(result) => {
                        res.status(200).json(result);
                    }).catch((err) => {
                        msgErr="OCURRIO UN ERROR, INTENTANDO ACTUALIZAR POR CATEGORIA:"+err
                        console.log(msgErr);
                        res.status(500).send({
                            message:msgErr
                        });

                    });

            }else if(tipodescuento=="PRODUCTO"){
                let productos = req.body.productos
                let descuento = req.body.descuento
                
             
                   actualizardescuentoporproducto(productos,descuento)
                

                    res.status(200).send({message:"DESCUENTO ACUALIZADO"})


            }else{
                msgErr="OCURRIO UN ERROR, TIPO DE DESCUENTO NO CONTROLADO."
                console.log(msgErr);
                res.status(500).send({
                    message:msgErr
                });
            }

        } catch (error) {
            res.status(500).send({
                message:error
            });
        }



    },
    queryhistorial: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            Producto.findOne({$and:[{'codigoInventario':valor},{'codigoBarras':req.query.codigoBarras}]})
            .populate([
           {path:'codigoCategoria', model:'categoria',select:'descripcion'},
           {path:'codigoLaboratorio', model:'laboratorio',select:'descripcion'},
           {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
           {path:'codigoUsuario', model:'usuarios'},
           {path:'codigoInventario', model:'inventarios',select:'descripcion'}])
           .exec(function (err,producto) {
               if(err)
               return res.status(500).send({message:'Ocurrió un error: '+err});
               if(producto){
                   res.status(200).send(producto);
                }
            })
        }
        catch(e){
            res.status(500).send({
                message:'Ocurrió un error'+e
            });
            next(e);
        }
    },
    busquedaAvanzadaHistorial: async (req,res,next) => {
        try {
           let valor=req.query.codigoInventario;
           let CB = req.query.codigoBarras;


           Producto
           .find(
            {$and:
            [
            {'codigoInventario':valor},
            {'codigoBarras':CB}
             ]}
            )
           .populate
           ([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:'descripcion'},
            {path:'codigoUsuario', model:'usuarios'},
           ])
            .exec(function (err,producto) {
               if(err)throw  res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
                            if(producto.length!=0){
                             res.status(200).send(producto);
                           }else{

                             res.status(204).send({
                                 message:'No hay historial para el articulo.'
                             });
                           }

           })

        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'+e
            });
            next(e);
        }
    },
    listHistorial: async (req,res,next) => {
        try {
           let valor=req.query.valor;
           let producto = req.query.producto;
           Producto
           .find({$and:[{'codigoInventario':valor},
           {$or:[{'nombre':new RegExp(producto,'i')},
           {'nombreComercial':new RegExp(producto,'i')}]}]})
           .populate
           ([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:'descripcion'},
            {path:'codigoUsuario', model:'usuarios'},
           ])
            .exec(function (err,producto) {
               if(err)throw  res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(producto.length!=0){
                res.status(200).send(producto);
              }else{
                res.status(204).send({
                    message:'No hay historial para el articulo.'
                });
              }
           })

        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'+e
            });
            next(e);
        }
    }, 
    Actualizaciones:async(req,res,next)=>{
        try {

           
        
                let productos = req.body.productos
                let nombre = req.body.nombre
                let nombreComercial = req.body.nombreComercial
                let codigoCategoria = req.body.codigoCategoria
                let codigoLaboratorio = req.body.codigoLaboratorio
                let codigoPresentacion = req.body.codigoPresentacion
                let costo = req.body.costo
                let pvp = req.body.pvp
                let punit = req.body.punit
                let descuento = req.body.descuento
                let iva = req.body.codigoIva
                let barra = req.body.codigoBarras
                
                 
                   actualizarParametrosProductos(productos,nombre,nombreComercial,pvp,costo,punit,descuento,codigoLaboratorio,codigoCategoria,codigoPresentacion,iva,barra)
              

                    res.status(200).send({message:"INFORMACION ACUALIZADA"})


            

        } catch (error) {
            res.status(500).send({
                message:error
            });
        }



    },
}

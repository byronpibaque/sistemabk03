import { parseZone } from 'moment';
import models from '../models';
import mongoose from 'mongoose';
import moment from "moment";

export default{
    ventas: async (req, res, next) => {
        try {  
       
        const ObjectId1 = mongoose.Types.ObjectId;
        const ObjectId2 = mongoose.Types.ObjectId;
        let codigoFarmacia = req.query.codigoFarmacia
        let codigoUsuario = req.query.codigoUsuario

        const reg = await models.Venta.aggregate(
           [
               {$match:{$and:[{estado:1}]}},
               {
                   $group:{
                    _id: {
                        mes: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                        codigoFarmacia: "$codigoFarmacia"
                    },
                    total: { $sum: "$total" },
                    numero: { $sum: 1 }
                   }
               },
               {
                $sort: {
                    "_id.year": -1, "_id.mes": -1
                }
               }
           ]
        ) 
        await models.Farmacia.populate(reg,{path:"_id.codigoFarmacia",select:{_id:1,descripcion:1}})

        res.status(200).json(reg)

        
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error:\n'+e
            });
            next(e);
        }
    },
    productos: async (req, res, next) => {
        try {
            let codigoFarmacia = req.query.codigoFarmacia
            let  limite = req.query.limite
            //const { _id } = await models.Inventario.findOne({ detalleFarmacia: { _id: codigoFarmacia } })
            let arri = []
            const reg = await models.Venta.aggregate(
                [{ $match: { $and: [{ estado: 1 }] } },
                { $unwind: '$detalles' },
                {
                    $group:
                    {
                        _id: {
                            mes: { $month: "$createdAt" },
                            year: { $year: "$createdAt" },
                            producto: '$detalles._id',
                            inventario:'$detalles.codigoInventario'
                           },

                        total: { $sum: 1 },
                        cantidad:{$sum:'$detalles.cantidad'},
                        fracciones:{$sum:'$detalles.fracciones'}
                    }
                },
                {
                    $sort: {
                        "_id.detalles.producto": -1
                    }
                }
                ]
            )
            await models.Producto.populate(reg,{path:"_id.producto",select:{_id:1,nombreComercial:1,fraccionCaja:1}})
            await models.Inventario.populate(reg,{path:"_id.inventario",select:{_id:1,descripcion:1}})

            reg.map(function (x) {
              
                    if (x.total >= limite) {
                        arri.push(x)
                    }
                
            })
            res.status(200).json(arri);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
}
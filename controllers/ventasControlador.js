import { parseZone } from 'moment';
import models from '../models';
import Venta from '../models/ventas';
import mongoose from 'mongoose';
import moment from "moment";


function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}
async function aumentarStock(idarticulo, cantidad, fracciones) {//PARA ANULAR FACTURAS

    let { fraccionesTotales, fraccionCaja } = await models.Producto.findOne({ _id: idarticulo });//FRACCIONES TOTALES Y FRACCIONES POR CAJA EN ARTICULOS



        let nfracionesTotal = parseInt(fraccionesTotales) +
         ((parseInt(fraccionCaja) * parseInt(cantidad))+parseInt(fracciones))

        const reg = await models.Producto.findByIdAndUpdate(
            { _id: idarticulo },
            {

                fraccionesTotales:nfracionesTotal

            });



}

async function disminuirStock(idarticulo, cantidad, fracciones) {//PARA GENERAR VENTA

    let { fraccionesTotales, fraccionCaja } = await models.Producto.findOne({ _id: idarticulo });

        let nfracionesTotal = parseInt(fraccionesTotales)-
        ((parseInt(fraccionCaja) * parseInt(cantidad)) + parseInt(fracciones))


        const reg = await models.Producto.findByIdAndUpdate(
            { _id: idarticulo },
            {
                  fraccionesTotales: nfracionesTotal
            });

}

async function actualizarCupo(codigoPersona,total){
    let {topemin,_id} = await models.Cupo.findOne({codigoPersona:codigoPersona})
    let nuevoCupo = parseFloat(topemin)-parseFloat(total)
    const reg = await models.Cupo.findByIdAndUpdate(
        {_id:_id},
        {
            topemin:nuevoCupo
        })
}
async function aumentarCupo(codigoPersona,total){
    let {topemin,_id} = await models.Cupo.findOne({codigoPersona:codigoPersona})
    let nuevoCupo = parseFloat(topemin)+parseFloat(total)
    const reg = await models.Cupo.findByIdAndUpdate(
        {_id:_id},
        {
            topemin:nuevoCupo
        })
}

export default {
    add: async (req, res, next) => {
        try {
            const reg = await models.Venta.create(req.body);
            //Actualizar stock
            let detalles = req.body.detalles;
            detalles.map(function (x) {
                disminuirStock(x._id, x.cantidad, x.fracciones);
            });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    query: async (req, res, next) => {
        try {

            Venta.findOne({ _id: req.query._id }).populate([
                { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                { path: 'codgioPersona', model: 'persona', select: 'nombres' }
            ])
                .exec(function (err, Venta) {
                    if (err)
                        return res.status(500).send({
                            message: 'Ocurrió un error: ' + err
                        });
                    if (Venta) {
                        res.status(200).send(Venta);
                    }

                })


        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    listFecha: async (req, res, next) => {
        try {
            const moment = require('moment')
            const today = moment().startOf('day');

            let valor = req.query.valor;
            Venta.find({ createdAt: { "$gte": today.toDate(), "$lt": moment(today).endOf('day').toDate() } }).populate([
                { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                { path: 'codgioPersona', model: 'persona' }]).exec(function (err, Venta) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Venta) {
                        res.status(200).send(Venta);
                    }
                })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    listFechasFiltros: async (req, res, next) => {
        try {
          
            
            let Finicio = req.query.finicio;
            let Ffin = req.query.ffin;
            let cdf = req.query.codigoFarmacia
            let cdu = req.query.codigoUsuario
           
                            Venta.find({ $and: [
                                { createdAt: { "$gte": Finicio, "$lt": Ffin } },
                                { codigoFarmacia: cdf }, { codigoUsuario: cdu },
                                
                                ] })
                                .populate([
                                { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                                { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                                { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                                { path: 'codgioPersona', model: 'persona' }])
                                .sort({createdAt:-1})
                                .exec(function (err, Venta) {
                                    if (err) throw res.status(500).send({
                                        message: 'Ocurrió un error: ' + err
                                    });
                                    if (Venta) {
                                        res.status(200).send(Venta);
                                    }
                                })
                        
            
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    listFechasFiltro: async (req, res, next) => {
        try {
            let tipoBusqueda = req.query.tipoBusqueda
            
            let Finicio = req.query.finicio;
            let Ffin = req.query.ffin;
            let cdf = req.query.codigoFarmacia
            let cdu = req.query.codigoUsuario
            if(tipoBusqueda==1){
                Venta.find({ $and: [
                    { createdAt: { "$gte": Finicio, "$lt": Ffin } },
                    { codigoFarmacia: cdf }, { codigoUsuario: cdu },
                    {formapago:"CRÉDITO"}
                    ] })
                    .populate([
                    { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                    { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codgioPersona', model: 'persona' }])
                    .sort({createdAt:-1})
                    .exec(function (err, Venta) {
                        if (err) throw res.status(500).send({
                            message: 'Ocurrió un error: ' + err
                        });
                        if (Venta) {
                            res.status(200).send(Venta);
                        }
                    })
            }else if(tipoBusqueda==2){
                Venta.find({ $and: [
                    { createdAt: { "$gte": Finicio, "$lt": Ffin } },
                    { codigoFarmacia: cdf }, { codigoUsuario: cdu },
                    {formapago:"EFECTIVO"}
                    ] })
                    .populate([
                    { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                    { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codgioPersona', model: 'persona' }])
                    .sort({createdAt:-1})
                    .exec(function (err, Venta) {
                        if (err) throw res.status(500).send({
                            message: 'Ocurrió un error: ' + err
                        });
                        if (Venta) {
                            res.status(200).send(Venta);
                        }
                    })
                }else if(tipoBusqueda==3){
                    Venta.find({ $and: [
                        { createdAt: { "$gte": Finicio, "$lt": Ffin } },
                        { codigoFarmacia: cdf }, { codigoUsuario: cdu },
                        {formapago:"TARJETA DE DÉBITO"}
                        ] })
                        .populate([
                        { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                        { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                        { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                        { path: 'codgioPersona', model: 'persona' }])
                        .sort({createdAt:-1})
                        .exec(function (err, Venta) {
                            if (err) throw res.status(500).send({
                                message: 'Ocurrió un error: ' + err
                            });
                            if (Venta) {
                                res.status(200).send(Venta);
                            }
                        })
                    }else if(tipoBusqueda==4){
                        Venta.find({ $and: [
                            { createdAt: { "$gte": Finicio, "$lt": Ffin } },
                            { codigoFarmacia: cdf }, { codigoUsuario: cdu },
                            {formapago:"TARJETA DE CRÉDITO"}
                            ] })
                            .populate([
                            { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                            { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                            { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                            { path: 'codgioPersona', model: 'persona' }])
                            .sort({createdAt:-1})
                            .exec(function (err, Venta) {
                                if (err) throw res.status(500).send({
                                    message: 'Ocurrió un error: ' + err
                                });
                                if (Venta) {
                                    res.status(200).send(Venta);
                                }
                            })
                        }else if(tipoBusqueda==5){
                            Venta.find({ $and: [
                                { createdAt: { "$gte": Finicio, "$lt": Ffin } },
                                { codigoFarmacia: cdf }, { codigoUsuario: cdu },
                                
                                ] })
                                .populate([
                                { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                                { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                                { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                                { path: 'codgioPersona', model: 'persona' }])
                                .sort({createdAt:-1})
                                .exec(function (err, Venta) {
                                    if (err) throw res.status(500).send({
                                        message: 'Ocurrió un error: ' + err
                                    });
                                    if (Venta) {
                                        res.status(200).send(Venta);
                                    }
                                })
                        }
            
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    listLaboratorio: async (req, res, next) => {
        try {

            let valor = req.query.valor;
            Venta.find({ $or: [{ 'detalles._id': valor }] }).populate([
                { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                { path: 'detalles._id', model: 'productos' },
                { path: 'codgioPersona', model: 'persona' }
            ]).exec(function (err, Venta) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Venta) {
                        res.status(200).send(Venta);
                    }
                })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    list: async (req, res, next) => {
        try {

            let valor = req.query.valor;
            Venta.find({ $or: [{ 'numComprobante': new RegExp(valor, 'i') }] }).populate([
                { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                { path: 'detalles._id', model: 'productos' },
                { path: 'codgioPersona', model: 'persona' }]).exec(function (err, Venta) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Venta) {
                        res.status(200).send(Venta);
                    }
                })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    listFarm: async (req, res, next) => {
        try {
            var moment = require("moment")
            const today = moment().startOf('day');

            let start = req.query.start;

            let end = req.query.end;


            let valor = req.query.valor

            Venta.find({
                $and: [{ 'codigoFarmacia': valor },
                { createdAt: { $gte: new Date(start + "T12:00:00.000Z") } },
                { createdAt: { $lt: new Date(end + "T04:59:00.000Z") } }]
            })
                .populate([
                    { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                    { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codgioPersona', model: 'persona' }])
                .exec(function (err, Venta) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Venta) {
                        res.status(200).send(Venta);
                    }
                })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    listOne: async (req, res, next) => {
        try {
            let valor = req.query.valor;
            let valor2 = req.query.valor2;
            Venta.find({ $and: [{ 'codigoFarmacia': valor }, { 'codigoUsuario': valor2 }] })
                .populate([
                    { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                    { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codgioPersona', model: 'persona' }]).exec(function (err, Venta) {
                        if (err) throw res.status(500).send({
                            message: 'Ocurrió un error: ' + err
                        });
                        if (Venta) {
                            res.status(200).send(Venta);
                        }
                    })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    listOneF: async (req, res, next) => {
        try {
            const moment = require('moment')
            const today = moment().startOf('day');
            let valor = req.query.valor;
            let valor2 = req.query.valor2;
            Venta.find({
                $and: [{ 'codigoFarmacia': valor }, { 'codigoUsuario': valor2 },
                ]
            })
                .populate([
                    { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                    { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codgioPersona', model: 'persona' }])
                .sort({createdAt:1})
                .exec(function (err, Venta) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Venta) {
                        res.status(200).send(Venta);
                    }
                })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    update: async (req, res, next) => {
        try {
            const reg = await models.Venta.updateOne({ numComprobante: req.body.numComprobante }, { claveAcceso: req.body.clave });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    activate: async (req, res, next) => {
        try {
            const reg = await models.Venta.findByIdAndUpdate({ _id: req.body._id }, { estado: 1 });
           console.log(reg)
            if(reg.formapago=="CRÉDITO"){
                console.log("HAY UN CREDITO ACTIVATE")
                aumentarCupo(reg.codgioPersona,reg.total)
            }
            //Actualizar stock
            let detalles = reg.detalles;
            detalles.map(function (x) {
                disminuirStock(x._id, x.cantidad, x.fracciones);
            });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }  
    },
    activateDup: async (req, res, next) => {
        try {
            const reg = await models.Venta.findByIdAndUpdate({ _id: req.body._id }, { estado: 1 });
            
           

            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    deactivate: async (req, res, next) => {
        try {
            const reg = await models.Venta.findByIdAndUpdate({ _id: req.body._id }, { estado: 0 });
            console.log(reg)
            if(reg.formapago=="CRÉDITO"){
                console.log("HAY UN CREDITO DEACTIVATE")
                actualizarCupo(reg.codgioPersona,reg.total)
            }

            //Actualizar stock
            let detalles = reg.detalles;
            detalles.map(function (x) {
                aumentarStock(x._id, x.cantidad, x.fracciones);

            });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    deactivateDup: async (req, res, next) => {
        try {
            const reg = await models.Venta.findByIdAndUpdate({ _id: req.body._id }, { estado: 0 });

            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    grafico12Meses: async (req, res, next) => {
        try {
            const ObjectId = mongoose.Types.ObjectId;
            let codigoFarmacia = req.query.codigoFarmacia

            const reg = await models.Venta.aggregate(
                [{ $match: { $and: [{ estado: 1 },{codigoFarmacia:ObjectId(codigoFarmacia)}] } },
                {
                    $group: {
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
            ).limit(12);
            res.status(200).json(reg);


        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    consultaFechas: async (req, res, next) => {
        try {
            let start = req.query.start;
            let end = req.query.end;


            Venta.find({ "createdAt": { "$gte": start, "$lt": end } })
                .sort({ 'createdAt': -1 })
                .populate([
                    { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codigoPersona', model: 'persona', select: 'nombres' }])
                .exec(function (err, Venta) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Venta) {
                        res.status(200).send(Venta);
                    }

                })

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    contarVentas: async (req, res, next) => {
        try {
            const reg = await models.Venta.estimatedDocumentCount(function (err, count) {
                if (err) return handleError(err);


                let contadorEntero = parseInt(count) + 300
                res.status(200).json(paddy(parseInt(contadorEntero), 9))


            });


        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    graficoMasVendido: async (req, res, next) => {
        try {
            let codigoFarmacia = req.query.codigoFarmacia
            const { _id } = await models.Inventario.findOne({ detalleFarmacia: { _id: codigoFarmacia } })
            let arri = []
            const reg = await models.Venta.aggregate(
                [{ $match: { $and: [{ estado: 1 }] } },
                { $unwind: '$detalles' },
                {
                    $group:
                    {
                        _id: {
                            producto: '$detalles.producto',
                            codigoInventario: '$detalles.codigoInventario'
                        },

                        total: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        "_id.detalles.producto": -1
                    }
                }
                ]
            )
            reg.map(function (x) {
                if (x._id.codigoInventario.equals(_id)) {
                    if (x.total >= 100) {
                        arri.push(x)
                    }
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
    graficoMasVende: async (req, res, next) => {
        try {
            const reg = await models.Venta.aggregate(
                [{ $match: { $and: [{ estado: 1 }] } },

                {
                    $group:
                    {
                        _id: {
                            codigo: '$codigoUsuario',
                            codigoFarmacia: "$codigoFarmacia"
                        },
                        total: { $sum: "$total" }
                    }
                },
                {
                    $sort: {
                        "_id.codigoUsuario": -1
                    }
                }
                ]
            )
            res.status(200).json(reg);



        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    ReporteVentas: async (req, res, next) => {
        try {
            var moment = require("moment")
            let start = req.query.start;


            let end = req.query.end;


            let valor = req.query.codigoFarmacia
            let valor2 = req.query.codigoUsuario

            Venta.find({
                $and: [{ estado: 1 }, { 'codigoFarmacia': valor },
                { 'codigoUsuario': valor2 },
                { createdAt: { $gte:start } },
                { createdAt: { $lt:end } }
            ]
            })
                .populate([
                    { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                    { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codgioPersona', model: 'persona', select: 'nombres' }])
                .exec(function (err, Venta) {
                    if (err) throw res.status(500).send({ message: 'Ocurrió un error: ' + err });
                    var moment = require("moment")
                    if (Venta) {

                        res.status(200).send(Venta);
                    }

                })



        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    ReporteVentaDetalles:async (req,res,next)=>{
        try {

            let codigoFarmacia = req.query.codigoFarmacia
            let codigoUsuario = req.query.codigoUsuario
            let finicio = req.query.fechaInicio
            let ffin = req.query.fechaFin

            let arri = []
            Venta.find({
                $and: [
                    { 'codigoFarmacia': codigoFarmacia },
                    { 'codigoUsuario': codigoUsuario },
                    { createdAt: { "$gte": finicio, "$lt": ffin } }
                ]
            })
                .populate([
                    { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                    { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codgioPersona', model: 'persona' }])
                .exec(function (err, Venta) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Venta) {

                       Venta.forEach(element => {

                          element.detalles.forEach(x => {
                              arri.push({
                                '_id': x._id,
                                'codigoInventario': x.codigoInventario,
                                'producto': x.producto,
                                'cantidad': x.cantidad,
                                'iva': x.iva,
                                'fracciones': x.fracciones,
                                'precioVenta': x.precioVenta,
                                'precioUni': x.precioUni,
                                'descuento': x.descuento,
                                'numComprobante':element.numComprobante,
                                'codgioPersona':element.codgioPersona.nombres,
                                'total':element.total,
                                'estado':element.estado,
                                'fecha':element.createdAt,
                                'formapago':element.formapago
                              })
                          });
                       });

                        res.status(200).send(arri);
                    }
                })

        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'+e
            });
            next(e);
        }
    },
    list_facturasdups: async (req, res, next) => {
        try {
        let start = req.query.start;
        let fi = start.split("-",3)
        let end = req.query.end;
        let ff = end.split("-",3)
        const ObjectId = mongoose.Types.ObjectId;
        const ObjectId1 = mongoose.Types.ObjectId;
        let codigoFarmacia = req.query.codigoFarmacia
        let codigoUsuario = req.query.codigoUsuario
        const reg = await models.Venta.aggregate([
            { $match:
                { $and:
                     [
                         {estado:1},
                         {codigoFarmacia:ObjectId(codigoFarmacia)},
                         {codigoUsuario:ObjectId1(codigoUsuario)},
                    ]
                    }
            },
            { $group: {
            _id: { numComprobante: "$numComprobante" },
            info:{
                  $push:{
                      _id:"$_id",
                      numComprobante:"$numComprobante",
                      total:"$total",
                      impuesto:"$impuesto",
                      usuario:"$codigoUsuario.nombre",
                      ca:"$claveAcceso",
                      anio:{$year:"$createdAt"},
                      mes:{$month:"$createdAt"},
                      day:{$dayOfMonth:"$createdAt"},
                      hour:{$hour:"$createdAt"},
                      minutes: { $minute: "$createdAt" },
                      seconds: { $second: "$createdAt" },
                      fecha:"$createdAt",
                      estado:"$estado"
                  }
            },
                count: { $sum: 1 }
            } },
            { $match: { count: { $gte: 2 } } },
            { $sort: {"info.fecha": 1}},
           // { $limit : 10 }
          ]);
            let arri=[]
            let FechI = new Date(fi[0],fi[1],fi[2])
            let FechE = new Date(ff[0],ff[1],ff[2])
          reg.forEach(x => {
              console.log(x);
              x.info.forEach(y => {
                  console.log(y);
                let fechaa = new Date(y.anio,y.mes,y.day)
                 if(fechaa>=FechI){
                     if(fechaa<=FechE){
                      console.log(y);
                        arri.push(y)

                     }
                 }
              });
          });

          res.status(200).json(arri);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error:\n'+e
            });
            next(e);
        }
    },
    //SECCION PARA REPORTES
    reportes:async(req,res,next)=>{
        try {
            let Finicio = req.query.start;
            let Ffin = req.query.end;
            let cdf = req.query.codigoFarmacia
            let cdu = req.query.codigoUsuario
            let tiporeporte = req.query.tiporeporte;
            //    console.log(Ffin)
            //    console.log(Finicio)
            //    console.log(cdf)
            //    console.log(tiporeporte) 
            if(tiporeporte=="Por registros"){
                Venta.find({ $and: [{ createdAt: { "$gte": Finicio, "$lt": Ffin } }, { codigoFarmacia: cdf }] })
                .populate([
                    { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                    { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codgioPersona', model: 'persona' }])
                    .sort({createdAt:1})
                    .exec(function (err, Venta) {
                            if (err) throw res.status(206).send({
                                message: 'Ocurrió un error: ' + err
                            });
                            if (Venta) {
                                res.status(200).send(Venta);
                            }
                    })
        
              }else if(tiporeporte=="Por Usuario"){
                Venta.find({ $and: [{ createdAt: { "$gte": Finicio, "$lt": Ffin } }, { codigoFarmacia: cdf },{codigoUsuario:cdu}] })
                .populate([
                    { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                    { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                    { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                    { path: 'codgioPersona', model: 'persona' }])
                    .sort({createdAt:1})
                    .exec(function (err, Venta) {
                            if (err) throw res.status(206).send({
                                message: 'Ocurrió un error: ' + err
                            });
                            if (Venta) {
                                res.status(200).send(Venta);
                            }
                    })
              }else if(tiporeporte=="Totalizado"){
                     
                    const ObjectId1 = mongoose.Types.ObjectId;
                   

                    const reg = await models.Venta.aggregate(
                    [
                        { $match:
                         { $and: [
                             { estado: 1 },
                             {codigoFarmacia:ObjectId1(cdf)},
                             { createdAt: { "$gte": new Date(Finicio), "$lt": new Date(Ffin) } }
                            ] }
                         },
                        {
                            $group:{
                                _id: {
                                    codigoFarmacia: "$codigoFarmacia",
                                    codigoUsuario:"$codigoUsuario"
                                },
                                total: { $sum: "$total" },
                            }
                        },
                     
                    ]
                    ) 
                    await models.Farmacia.populate(reg,{path:"_id.codigoFarmacia",select:{descripcion:1}})
                    await models.Usuario.populate(reg,{path:"_id.codigoUsuario",select:{nombres:1}})

                    res.status(200).json(reg)
              }else if(tiporeporte=="Por Farmacia"){
                     
                const ObjectId1 = mongoose.Types.ObjectId;
               

                const reg = await models.Venta.aggregate(
                [
                    { $match:
                     { $and: [
                         { estado: 1 },
                      //   {codigoFarmacia:ObjectId1(cdf)},
                         { createdAt: { "$gte": new Date(Finicio), "$lt": new Date(Ffin) } }
                        ] }
                     },
                    {
                        $group:{
                            _id: {
                                codigoFarmacia: "$codigoFarmacia"
                            },
                            total: { $sum: "$total" },
                        }
                    },
                    {
                        $sort: {
                            "_id.codigoFarmacia": 1
                        }
                    }
                  
                ]
                ) 
                await models.Farmacia.populate(reg,{path:"_id.codigoFarmacia",select:{descripcion:1}})
               

                res.status(200).json(reg)
          }else if(tiporeporte=="Diario"){
              
          }
            
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error:'+e
            });
            next(e);
        }
    },
    queryHistorial: async (req, res, next) => {
        try {

            let valor = req.query.valor;
            Venta.find({ $or: [{ 'detalles._id': valor }] }).populate([
                { path: 'codigoTipoComprobante', model: 'tipocomprobante', select: 'descripcion' },
                { path: 'codigoFarmacia', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoUsuario', model: 'usuarios', select: 'nombres' },
                { path: 'detalles._id', model: 'productos' },
                { path: 'codgioPersona', model: 'persona' }
            ])
                .sort({'createdAt':-1})
                .exec(function (err, Ingreso) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Ingreso) {
                        res.status(200).send(Ingreso[0]);
                    }
                })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'+e
            });
            next(e);
        }
    },



}

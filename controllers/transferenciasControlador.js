
import models from '../models';
import Transferencias from '../models/transferenciasPtoP';


export default {
    add: async (req, res, next) => {
        try {
            const reg = await models.Transferencias.create(req.body);
          
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

            Transferencias.findOne({ _id: req.query._id })
            .populate([
                { path: 'codigoFarmaciaE', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoFarmaciaR', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoUsuario', model: 'usuarios' },
                { path: 'codigoPersona', model: 'persona' }])
                .exec(function (err, Transferencias) {
                    if (err)
                        return res.status(500).send({
                            message: 'Ocurrió un error: ' + err
                        });
                    if (Transferencias) {
                        res.status(200).send(Transferencias);
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
            let Finicio = req.query.finicio;
            let Ffin = req.query.ffin;
            let cdf = req.query.codigoFarmacia
            let cdu = req.query.codigoUsuario
            Transferencias.find({ $and: [{ createdAt: { "$gte": Finicio, "$lt": Ffin } }, { codigoFarmacia: cdf }, { codigoUsuario: cdu }] })
            .populate([
                { path: 'codigoFarmaciaE', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoFarmaciaR', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoUsuario', model: 'usuarios' },
                { path: 'codigoPersona', model: 'persona' }])
                .exec(function (err, Transferencias) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Transferencias) {
                        res.status(200).send(Transferencias);
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

            let codigoFarmacia = req.query.codigoFarmaciaR;
            Transferencias.find({ $and: [{ 'codigoFarmaciaR':codigoFarmacia}] })
            .populate([
                { path: 'codigoFarmaciaE', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoFarmaciaR', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoUsuario', model: 'usuarios' },
                { path: 'detalles._id', model: 'productos' },
                { path: 'codigoPersona', model: 'persona' }])
                .exec(function (err, Transferencias) {
                    
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Transferencias) {
                        res.status(200).send(Transferencias);
                    }
                })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },  
    listE: async (req, res, next) => {
        try {

            let codigoFarmacia = req.query.codigoFarmaciaE;
            Transferencias.find({ $and: [{ 'codigoFarmaciaE':codigoFarmacia}] })
            .populate([
                { path: 'codigoFarmaciaE', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoFarmaciaR', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoUsuario', model: 'usuarios' },
                { path: 'detalles._id', model: 'productos' },
                { path: 'codigoPersona', model: 'persona' }])
                .exec(function (err, Transferencias) {
                    
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Transferencias) {
                        res.status(200).send(Transferencias);
                    }
                })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    activate: async (req, res, next) => {
        try {
            const reg = await models.Transferencias.findByIdAndUpdate({ _id: req.body._id }, { estado: 1 });
         
          
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.Transferencias.findByIdAndDelete({_id:req.query._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar eliminar el Rol.'
            });
            next(e);
        }
    },
    deactivate: async (req, res, next) => {
        try {
            const reg = await models.Transferencias.findByIdAndUpdate({ _id: req.body._id }, { estado: 0 });
          
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    Existencias: async (req, res, next) => {
        try {

            let codigoFarmacia = req.query.codigoFarmaciaR;
            Transferencias.find({ $and: [{ 'codigoFarmaciaR':codigoFarmacia},{'estado':0}] })
            .populate([
                { path: 'codigoFarmaciaE', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoFarmaciaR', model: 'detallefarmacias', select: 'descripcion' },
                { path: 'codigoUsuario', model: 'usuarios' },
                { path: 'detalles._id', model: 'productos' },
                { path: 'codigoPersona', model: 'persona' }])
                .exec(function (err, Transferencias) {
                    if (err) throw res.status(500).send({
                        message: 'Ocurrió un error: ' + err
                    });
                    if (Transferencias) {
                      
                        let count = 0
                        Transferencias.forEach(x => {
                            count+=1
                        });
                   
                        res.status(200).send(count.toString());
                    }
                })
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },



}

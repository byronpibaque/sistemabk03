
import factoryData from '../db/factoryData';
import factoryModel from '../db/factoryModel';
import esquema from '../schemas/infoErrorSchema';

export default {
    add: async (req,res,next) =>{
        try {
            let conn =await factoryData.obtenerConexion('general');
            let modelo = await factoryModel.obtenerModelo('infoError',esquema,conn);
            const reg = await modelo.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar infoError.'
            });
            next(e);
        }
    },
    query: async (req,res,next) => {
        try {

            let conn =await factoryData.obtenerConexion('general');
            let modelo = await factoryModel.obtenerModelo('infoError',esquema,conn);
            const reg=await modelo.findOne({_id:req.query._id});
            if (!reg){
                res.status(404).send({
                    message: 'El registro no existe.'
                });
            } else{
                res.status(200).json(reg);
            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de Rol.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let conn =await factoryData.obtenerConexion('general');
            let modelo = await factoryModel.obtenerModelo('infoError',esquema,conn);
            let valor=req.query.valor;

            const reg= await modelo.find({$or:[{'descripcion':new RegExp(valor,'i')}]},{createdAt:0})
            .sort({'createdAt':-1});
          
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar listar los Roles.'
            });
            next(e);
        }
    },
    insertError: async (parametros)=>{
        try {
            let conn =await factoryData.obtenerConexion('general');
            let modelo = await factoryModel.obtenerModelo('infoError',esquema,conn);
            if(parametros){
                const reg = await modelo.create(parametros);
                console.log('Se inserto un error en DB General, '+reg.descripcion);
            }
           
        } catch (e){
            console.log(e.message);
        } 
    }
}

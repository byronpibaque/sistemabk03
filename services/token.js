import jwt from 'jsonwebtoken';
import Login from '../models/login'
import Farmacia from '../models/farmacia'

async function checkToken(token){
    let __id = null;
    try{
        const {_id}= await jwt.decode(token);
        __id = _id;
    } catch (e){
        return false;
    }
    const user = await Login.findOne({_id:__id,estado:1});
    if (user){
        const empresa = await Farmacia.findOne({_id:user.codigoFarmacia});
        const token = jwt.sign({_id:__id},'clavesecretaparagenerartoken',{expiresIn:'1d'});
        if(empresa){
            return {token,rol:user.rol,codigoFarmacia:user.codigoFarmacia,codigoUsuario:user.codigoUsuario,codigoEmpresa:empresa.codigoFarmacias};
        }else{
            return {token,rol:user.rol,codigoFarmacia:user.codigoFarmacia,codigoUsuario:user.codigoUsuario,codigoEmpresa:null};
        }
        
    } else {
        return false;
    }
}

export default {
    encode: async (_id,rol,email,codigoFarmacia,codigoUsuario,codigoFarmacias) => {
        const token = jwt.sign({_id:_id,codigoFarmacia:codigoFarmacia,codigoUsuario:codigoUsuario,rol:rol,email:email,codigoEmpresa:codigoFarmacias},'clavesecretaparagenerartoken',{expiresIn: '1d'});
        return token;
    },
    decode: async (token) => {
        try {
            const {_id} = await jwt.verify(token,'clavesecretaparagenerartoken');
            const user = await Login.findOne({_id,estado:1});
            if (user){
                return user;
            } else{
                return false;
            }
        } catch (e){
            const newToken = await checkToken(token);
            return newToken;
        }
    }
}
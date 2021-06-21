import mongoose,{Schema} from 'mongoose';
const promocion = new Schema({
    producto: [{
        _id:{
            type:String,
            required:true
        },
        codigoInventario:{type: Schema.ObjectId, ref: 'inventarios',required:true},
        producto:{
            type:String,
            required:true
        },
        codigoB:{
            type:String,
            
        },

    }],
    fechainicio: { type: String},
    fechafin: { type: String},
    tipopromocion:{type:String},
    promocion: {type:String},
    codigoUsuario:{type: Schema.ObjectId, ref: 'usuarios',required:true },
    estado: { type:Number, default:1},
   
});
const promociones = mongoose.model('promocion',promocion);
export default promociones;
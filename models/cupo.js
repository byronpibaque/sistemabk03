import mongoose,{Schema} from 'mongoose';
const cupos = new Schema({
    descripcion:{ type:String,maxlength:50},
    topemax: {type:Number, required:true},
    topemin: {type:Number, required:true},
    codigoUsuario:{type: Schema.ObjectId, ref: 'usuarios',required:true },
    codigoPersona:{ type: Schema.ObjectId, ref: 'personas',required:true }, 
    estado: { type:Number, default:1},
    createdAt: { type: Date, default: Date.now }
});
const cupo = mongoose.model('cupos',cupos);
export default cupo;
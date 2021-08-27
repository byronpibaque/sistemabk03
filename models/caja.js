import mongoose,{Schema} from 'mongoose';

const CajaSchema = new Schema({
    detalles: [{
        efectivo:{type:Number},
        credito:{type:Number},
        tc:{type:Number},
        td:{type:Number}
    }],
    codigoUsuario:{type: Schema.ObjectId, ref: 'usuarios'},
    codigoFarmacia:{ type: Schema.ObjectId, ref: 'detallefarmacias'}, 
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const caja = mongoose.model('caja',CajaSchema);

export default caja;
 
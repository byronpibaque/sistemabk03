import mongoose,{Schema} from 'mongoose';
const vademecumSchema = new Schema({
    codigoProducto:{type: Schema.ObjectId, ref: 'productos' },
    indicacion:{type:String},
    dosificacion:{type:String},
    contraindicacion:{type:String},
    efectosSecundarios:{type:String},
    estado: { type:Number, default:1},
    createdAt: { type: Date, default: Date.now }
});
const Vademecum = mongoose.model('vademecum',vademecumSchema);
export default Vademecum;
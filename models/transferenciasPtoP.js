import mongoose,{Schema} from 'mongoose';

const transferenciasSchema = new Schema({
    numComprobante: { type:String,maxlength:25,required:true},
   detalles: [{
        _id:{
            type:String,
            required:true
        },
        codigoInventario:{
            type: Schema.ObjectId, 
            ref: 'inventarios',required:true
        },
        producto:{
            type:String,
            required:true
        },
       
        cantidad:{
            type:Number,
            required:true
        },
        bonificacion:{
            type:Number,
            required:true
        },
        fracciones:{
            type:Number,
            required:true 
        },
        precioVenta:{
            type:Number,
            required:true
        },
        precioUni:{
            type:Number,
            required:true
        },
        iva:{
            type:Number,
            required:true
        },
        descuento:{
            type:Number,
            required:true
        }
   }],
   codigoUsuario:{type: Schema.ObjectId, ref: 'usuarios',required:true },
    codigoPersona:{ type: Schema.ObjectId, ref: 'personas',required:true },
    codigoFarmaciaE:{ type: Schema.ObjectId, ref: 'detallefarmacias'}, 
    codigoFarmaciaR:{ type: Schema.ObjectId, ref: 'detallefarmacias'}, 
    estado: { type:Number, default:0},
    createdAt: { type: Date, default: Date.now }
});
const Transferencias = mongoose.model('transferencias',transferenciasSchema);
export default Transferencias;
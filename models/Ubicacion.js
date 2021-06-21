import mongoose,{Schema} from 'mongoose';

const ubicacionSquema = new Schema({
    nombreRegion:{type:String},
    provincias:[{
     _id:{type:mongoose.Schema.Types.ObjectId,auto:true},
     nombreProvincia:{type:String},
     capital:{type:String},
     ciudades:[{
        _id:{type:mongoose.Schema.Types.ObjectId,auto:true},
         nombreCiudad:{type:String}
     }]
    }],
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
});

const Ubicacion = mongoose.model('ubicacion',ubicacionSquema);

export default Ubicacion;
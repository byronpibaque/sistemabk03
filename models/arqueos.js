import mongoose,{Schema} from 'mongoose';

const arqueosSquema = new Schema({
    codigoUsuario:{type: Schema.ObjectId, ref: 'usuarios',required:true },
    codigoFarmacia:{type: Schema.ObjectId, ref:'detallefarmacias'},
    seccion:{type:String,maxlength:15},
    totalCaja:{type:Number,required:true},
    totalBK03:{type:Number,required:true},
    positivos:{type:Number,required:true},
    negativos:{type:Number,required:true},  
    desgloce:[{
        tc:{type:Number,required:true}, 
        td:{type:Number,required:true}, 
        cr:{type:Number,required:true}, 
        ef:{type:Number,required:true},
    }]     ,
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
    
});

const Arqueos = mongoose.model('arqueos',arqueosSquema);

export default Arqueos; 
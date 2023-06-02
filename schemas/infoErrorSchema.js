
import {Schema} from 'mongoose';

const infoError =  Schema({
    app:{type:String, maxlength:50,unique:true,required:true},
    descripcion:{type:String,unique:true,required:true},
    createdAt:{type:Date,default:Date.now}
});
 export default infoError;
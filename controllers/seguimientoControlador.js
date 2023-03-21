// import models from '../models';
// import Producto from '../models/productos';
// import Inventario from '../models/inventario';

export default {
    historial: async(req, res, next)=>{
      try {
        res.status(200).send({message:"Respondiendo desde el server ok"})
      } catch (error) {
          res.status(500).send({
              message:error
          });
      }
    }
}

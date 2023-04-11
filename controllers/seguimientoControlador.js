import Venta from '../models/ventas';
// import Inventario from '../models/inventario';

export default {
    historial: async(req, res, next)=>{
      try {
        const ventas = await Venta.find({
          "detalles.producto": 'COCA COLA ORIGINAL 300ML', 
          "detalles.codigoInventario": '5ff8b9182971240017f3c4b0'
        })
        res.send({message: ventas })
      } catch (error) {
        console.log( error );
          res.status(500).send({
              message:error
          });
      }
    }
}

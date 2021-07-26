import routerx from 'express-promise-router';

import TransferenciasControl from '../controllers/transferenciasControlador';


const router=routerx();


   
router.post('/add',TransferenciasControl.add);
router.get('/query',TransferenciasControl.query);
router.get('/list',TransferenciasControl.list);
router.get('/listE',TransferenciasControl.listE);
router.get('/filtrofechas',TransferenciasControl.listFechasFiltro);
router.put('/activate',TransferenciasControl.activate);
router.put('/deactivate',TransferenciasControl.deactivate);
router.get('/existencias',TransferenciasControl.Existencias);
router.delete('/remove',TransferenciasControl.remove);


export default router;
import routerx from 'express-promise-router';

import Ubicacion from '../controllers/UbicacionControlador';


const router=routerx();



router.post('/add',Ubicacion.add);
router.get('/query',Ubicacion.query);
router.get('/list',Ubicacion.list);
router.put('/update',Ubicacion.update);
router.delete('/remove',Ubicacion.remove);
router.put('/activate',Ubicacion.activate);
router.put('/deactivate',Ubicacion.deactivate);

export default router;
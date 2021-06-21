import routerx from 'express-promise-router';

import control from '../controllers/estadisticas';


const router=routerx();



router.get('/ventas',control.ventas);
router.get('/productos',control.productos);

export default router;
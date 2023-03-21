import routerx from 'express-promise-router';

import seguimientoControlador from '../controllers/seguimientoControlador';

const router=routerx();

router.post('/', seguimientoControlador.historial);


export default router; 
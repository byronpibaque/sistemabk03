import routerx from 'express-promise-router';

import arqueoControl from '../controllers/ArqueosController';


const router=routerx();


 

router.post('/add',arqueoControl.add);
router.get('/query',arqueoControl.query);
router.get('/list',arqueoControl.list); 
router.get('/listporfechas',arqueoControl.listporFechas);
router.get('/suma',arqueoControl.SumarTotales);
router.get('/existe',arqueoControl.existeRegistro);
router.put('/activate',arqueoControl.activate);
router.put('/deactivate',arqueoControl.deactivate);
router.delete('/remove',arqueoControl.remove);

export default router;
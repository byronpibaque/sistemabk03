import routerx from 'express-promise-router';

import promocionControl from '../controllers/promocion';


const router=routerx();



router.post('/add',promocionControl.add);
router.get('/query',promocionControl.query);
router.get('/list',promocionControl.list);
router.get('/listporfechasad',promocionControl.list);

router.get('/existe',promocionControl.existeRegistro); 
router.put('/update',promocionControl.update);
//router.put('/updatecupo',promocionControl.updateCupo);
router.delete('/remove',promocionControl.remove);
router.put('/activate',promocionControl.activate);
router.put('/deactivate',promocionControl.deactivate);

export default router;
import routerx from 'express-promise-router';

import cupoControl from '../controllers/cupos';


const router=routerx();



router.post('/add',cupoControl.add);
router.get('/query',cupoControl.query);
router.get('/list',cupoControl.list);
router.get('/existe',cupoControl.existeRegistro); 
router.put('/update',cupoControl.update);
router.put('/updatecupo',cupoControl.updateCupo);
router.delete('/remove',cupoControl.remove);
router.put('/activate',cupoControl.activate);
router.put('/deactivate',cupoControl.deactivate);

export default router;
import routerx from 'express-promise-router';

import control from '../controllers/vademecumControl';


const router=routerx();



router.post('/add',control.add);

router.get('/queryA',control.queryA);

router.get('/list',control.list);

router.put('/update',control.update);
router.delete('/remove',control.remove);
router.put('/activate',control.activate);
router.put('/deactivate',control.deactivate);

export default router;
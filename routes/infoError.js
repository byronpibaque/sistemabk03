import routerx from 'express-promise-router';

import rolControl from '../controllers/infoError';


const router=routerx();



router.post('/add',rolControl.add);
router.get('/query',rolControl.query);
router.get('/list',rolControl.list);

export default router;
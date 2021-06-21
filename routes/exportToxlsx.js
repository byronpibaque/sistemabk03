import routerx from 'express-promise-router';

import xlsxControl from '../controllers/exportToxlsx';


const router=routerx();




router.get('/list',xlsxControl.list);



export default router;

import routerx from 'express-promise-router';

import xmlControl from '../controllers/generar_xml';


const router=routerx();




router.post('/xml',xmlControl.xml);


export default router;
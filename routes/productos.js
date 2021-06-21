import routerx from 'express-promise-router';

import productosControl from '../controllers/productosControl';


const router=routerx();



router.post('/add',productosControl.add);
router.get('/query',productosControl.query);
router.get('/queryhistorial',productosControl.queryhistorial);
router.get('/queryA',productosControl.queryA);
router.get('/queryB',productosControl.queryB);
router.get('/list',productosControl.list);
router.get('/listHistorial',productosControl.listHistorial);
router.get('/busquedaAvanzada',productosControl.busquedaAvanzada);
router.get('/busquedaAvanzadaHistorial',productosControl.busquedaAvanzadaHistorial);
router.get('/busquedaAvanzadaT',productosControl.busquedaAvanzadaTodas);
router.get('/busquedaAvanzadaL',productosControl.busquedaAvanzadaTodasL);

router.get('/verificar',productosControl.verificarExisteCodigoBarra);
router.get('/duplicados',productosControl.duplicados);
router.get('/listcero',productosControl.listtotalcero);
router.get('/listfracciones',productosControl.listtotalfracciones);
router.get('/listxcategoria',productosControl.listxcategoria)
router.get('/listxlaboratorio',productosControl.listxlaboratorio)
router.get('/listaalfabetica',productosControl.listaAlfabetica);
router.get('/caracter',productosControl.listporCaracteres);
router.get('/listA',productosControl.listA);
router.get('/listB',productosControl.listB);
router.get('/listtotal',productosControl.listtotalProductos); 
router.put('/update',productosControl.update);
router.delete('/remove',productosControl.remove);
router.put('/activate',productosControl.activate);
router.put('/deactivate',productosControl.deactivate);
router.get('/clonar',productosControl.clonado);
router.delete('/eliminar',productosControl.eliminado);
router.put('/descuentos',productosControl.descuentos);
router.put('/descuentosA',productosControl.descuentosAdmin);

export default router; 
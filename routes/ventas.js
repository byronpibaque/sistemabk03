import routerx from 'express-promise-router';

import ventasControl from '../controllers/ventasControlador';


const router=routerx();


   
router.post('/add',ventasControl.add);
router.get('/query',ventasControl.query);
router.get('/queryHistorial',ventasControl.queryHistorial);
router.get('/list',ventasControl.list);
router.get('/filtrofechas',ventasControl.listFechasFiltro);
router.get('/filtrofechass',ventasControl.listFechasFiltros);
router.get('/listLaboratorios',ventasControl.listLaboratorio); 
router.get('/listF',ventasControl.listFecha);
router.get('/listFarmacia',ventasControl.listFarm);
router.get('/listone',ventasControl.listOne);
router.get('/listoneF',ventasControl.listOneF);
router.get('/facturasdup',ventasControl.list_facturasdups);
router.put('/update',ventasControl.update);
//router.delete('/remove',ventasControl.remove);
router.put('/activate',ventasControl.activate);
router.put('/deactivate',ventasControl.deactivate);
router.put('/deactivated',ventasControl.deactivateDup);
router.put('/activated',ventasControl.activateDup);
router.get('/grafico12Meses',ventasControl.grafico12Meses);
router.get('/graficomasvendido',ventasControl.graficoMasVendido);
router.get('/graficomasvende',ventasControl.graficoMasVende);
router.get('/consultaFechas',ventasControl.consultaFechas);
router.get('/reporteV',ventasControl.ReporteVentas);
router.get('/contarventas',ventasControl.contarVentas); 
router.get('/reporteVDT',ventasControl.ReporteVentaDetalle);
router.get('/reporteVD',ventasControl.ReporteVentaDetalles);
router.get('/reporteVDA',ventasControl.ReporteVentaDetallesAdministrativo);
router.get('/reporte',ventasControl.reportes)
export default router;    
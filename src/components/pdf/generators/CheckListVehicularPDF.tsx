// Generator PDF para CHECK LIST VEHICULAR
'use client';

import { useLoggedUserStore } from '@/store/loggedUser';
import dynamic from 'next/dynamic';
import { CheckListVehicularLayout } from '../layouts/CheckListVehicularLayout';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { pdf } from '@react-pdf/renderer';
import { useState } from 'react';

const PDFViewerDynamic = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFViewer), { ssr: false });

interface CheckListVehicularPDFProps {
  data?: any;
  preview?: boolean;
  companyLogo?: string;
  singurl?: string | null;
  title?: string;
  description?: string;
}

export const CheckListVehicularPDF = ({ data, preview = true, companyLogo, singurl, title, description }: CheckListVehicularPDFProps) => {
  const [client, setClient] = useState(false);
  const company = useLoggedUserStore((state) => state.actualCompany)?.company_logo;

  // Obtener la configuración del checklist
  const vehicleChecklistConfig = {
    title: 'CHECK LIST VEHICULAR',
    subtitle: 'WFS - CHK - VEH - 01',
    items: [
      // --- GENERALES ---
      { id: 'fecha', label: 'Fecha', group: 'general' },
      { id: 'obra', label: 'Obra', group: 'general' },
      { id: 'movil', label: 'Vehículo', group: 'general' },
      { id: 'interno', label: 'Número interno', group: 'general' },
      { id: 'dominio', label: 'Dominio/patente', group: 'general' },
      { id: 'modelo', label: 'Modelo', group: 'general' },
      { id: 'marca', label: 'Marca', group: 'general' },
      { id: 'kilometraje', label: 'Kilometraje', group: 'general' },
      { id: 'chofer', label: 'Conductor', group: 'general' },
      // --- SALIDA ---
      { id: 'fechaSalida', label: 'Fecha Salida', group: 'salida' },
      { id: 'horaSalida', label: 'Hora Salida', group: 'salida' },
      { id: 'combustibleSalida', label: 'Combustible', group: 'salida' },
      // --- CHEQUEO SALIDA ---
      { id: 'motorPrincipalSalida', label: 'Motor Principal', group: 'chequeoSalida' },
      { id: 'documentacionVehicularSalida', label: 'Documentación vehicular vigente', group: 'chequeoSalida' },
      { id: 'lucesYBalizasSalida', label: 'Luces y balizas funcionando', group: 'chequeoSalida' },
      { id: 'instalacionElectricaSalida', label: 'Instalación eléctrica y batería en buen estado', group: 'chequeoSalida' },
      { id: 'butacasConCinturesSalida', label: 'Butacas con cinturones de seguridad operativos', group: 'chequeoSalida' },
      { id: 'extintorYKitSalida', label: 'Extintor y kit de emergencia a disposición', group: 'chequeoSalida' },
      { id: 'sistemaFrenosSalida', label: 'Sistema de frenos funcionando correctamente', group: 'chequeoSalida' },
      { id: 'parabrisasYEspejosSalida', label: 'Parabrisas y espejos limpios y en buen estado', group: 'chequeoSalida' },
      { id: 'estadoCarroceriaSalida', label: 'Estado de la carrocería', group: 'chequeoSalida' },
      { id: 'estadoRuedasSalida', label: 'Estado de ruedas (ajuste y presión)', group: 'chequeoSalida' },
      { id: 'nivelLiquidosSalida', label: 'Nivel de líquidos (aceite, agua, hidráulico)', group: 'chequeoSalida' },
      { id: 'ruidoMotorSalida', label: 'Ruido de motor, gases, combustión', group: 'chequeoSalida' },
      // --- ENTRADA ---
      { id: 'fechaEntrada', label: 'Fecha Entrada', group: 'entrada' },
      { id: 'horaIngreso', label: 'Hora Ingreso', group: 'entrada' },
      { id: 'combustibleEntrada', label: 'Combustible', group: 'entrada' },
      // --- CHEQUEO ENTRADA ---
      { id: 'motorPrincipalEntrada', label: 'Motor Principal', group: 'chequeoEntrada' },
      { id: 'documentacionVehicularEntrada', label: 'Documentación vehicular vigente', group: 'chequeoEntrada' },
      { id: 'lucesYBalizasEntrada', label: 'Luces y balizas funcionando', group: 'chequeoEntrada' },
      { id: 'instalacionElectricaEntrada', label: 'Instalación eléctrica y batería en buen estado', group: 'chequeoEntrada' },
      { id: 'butacasConCinturesEntrada', label: 'Butacas con cinturones de seguridad operativos', group: 'chequeoEntrada' },
      { id: 'extintorYKitEntrada', label: 'Extintor y kit de emergencia a disposición', group: 'chequeoEntrada' },
      { id: 'sistemaFrenosEntrada', label: 'Sistema de frenos funcionando correctamente', group: 'chequeoEntrada' },
      { id: 'parabrisasYEspejosEntrada', label: 'Parabrisas y espejos limpios y en buen estado', group: 'chequeoEntrada' },
      { id: 'estadoCarroceriaEntrada', label: 'Estado de la carrocería', group: 'chequeoEntrada' },
      { id: 'estadoRuedasEntrada', label: 'Estado de ruedas (ajuste y presión)', group: 'chequeoEntrada' },
      { id: 'nivelLiquidosEntrada', label: 'Nivel de líquidos (aceite, agua, hidráulico)', group: 'chequeoEntrada' },
      { id: 'ruidoMotorEntrada', label: 'Ruido de motor, gases, combustión', group: 'chequeoEntrada' },
      // --- ADICIONALES ---
      { id: 'observacionesEntrada', label: 'Observación Entrada', group: 'adicionales' },
      { id: 'observacionesSalida', label: 'Observación Salida', group: 'adicionales' },
      { id: 'inspeccionadoPor', label: 'INSPECCIONADO POR', group: 'adicionales' },
      { id: 'recibidoPor', label: 'RECIBIDO POR', group: 'adicionales' },
      { id: 'horaInspeccion', label: 'HORA INSPECCIÓN', group: 'adicionales' },
      { id: 'fechaInspeccion', label: 'FECHA INSPECCIÓN', group: 'adicionales' },
      { id: 'horaRecepcion', label: 'HORA RECEPCIÓN', group: 'adicionales' },
      { id: 'fechaRecepcion', label: 'FECHA RECEPCIÓN', group: 'adicionales' },
    ],
  };

  // Agrupar campos por sector
  const generales = vehicleChecklistConfig.items.filter(i => i.group === 'general');
  const adicionales = vehicleChecklistConfig.items.filter(i => i.group === 'adicionales');
  const salida = vehicleChecklistConfig.items.filter(i => i.group === 'salida' || i.group === 'chequeoSalida');
  const entrada = vehicleChecklistConfig.items.filter(i => i.group === 'entrada' || i.group === 'chequeoEntrada');

  // Mapeo de datos vacíos
  const salidaData = salida.map(item => ({ label: item.label, value: data?.[item.id] || '' }));
  const entradaData = entrada.map(item => ({ label: item.label, value: data?.[item.id] || '' }));
  const generalesData = generales.map(item => ({ label: item.label, value: data?.[item.id] || '' }));
  const adicionalesData = adicionales.map(item => ({ label: item.label, value: data?.[item.id] || '' }));

  const pdfContent = (
    <CheckListVehicularLayout
      title={title || vehicleChecklistConfig.title}
      subtitle={vehicleChecklistConfig.subtitle}
      logoUrl={company || companyLogo}
      singurl={singurl}
      generales={generalesData}
      adicionales={adicionalesData}
      salida={salidaData}
      entrada={entradaData}
    />
  );

  // Descargar
  const handleDownload = async () => {
    const blob = await pdf(pdfContent).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${title || 'CHECK_LIST_VEHICULAR'}_${data?.dominio || ''}-(${moment(data?.fecha).format('DD-MM-YYYY') || ''}).pdf`.replace(/\s+/g, '_');
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render
  if (!preview) return pdfContent;

  return (
    <div className="w-full h-full flex flex-col">
      <div className=" pr-8 flex items-center justify-between">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle>{title || 'CHECK LIST VEHICULAR'}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Button onClick={handleDownload} variant="outline" className="gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Descargar PDF
        </Button>
      </div>
      <PDFViewerDynamic style={{ width: '100%', height: '100%', border: 'none' }}>{pdfContent}</PDFViewerDynamic>
    </div>
  );
};

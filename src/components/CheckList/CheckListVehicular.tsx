'use client';

import { CreateNewFormAnswer, UpdateFormAnswer, UpdateVehicle } from '@/app/server/UPDATE/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useLoggedUserStore } from '@/store/loggedUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Check, ChevronsUpDown } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import BackButton from '../BackButton';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { EquipmentForm } from './DynamicFormWrapper';

// Configuración del checklist vehicular
export const vehicleChecklistConfig = {
  title: 'CHECK LIST VEHICULAR',
  subtitle: 'WFS - CHK - VEH - 01',
  items: [
    // Datos generales
    { id: 'fecha', label: 'Fecha', type: 'date', group: 'general', required: true },
    { id: 'obra', label: 'Obra', type: 'text', group: 'general', required: true },
    { id: 'movil', label: 'Vehículo', type: 'combobox', group: 'general', required: true },
    { id: 'interno', label: 'Número interno', type: 'text', group: 'general', required: true, disabled: true },
    { id: 'dominio', label: 'Dominio/patente', type: 'text', group: 'general', required: true, disabled: true },
    { id: 'modelo', label: 'Modelo', type: 'text', group: 'general', required: true, disabled: true },
    { id: 'marca', label: 'Marca', type: 'text', group: 'general', required: true, disabled: true },
    { id: 'chofer', label: 'Conductor', type: 'text', group: 'general', required: true },

    // Datos de Salida
    { id: 'fechaSalida', label: 'Fecha Salida', type: 'date', group: 'salida', required: true },
    { id: 'horaSalida', label: 'Hora Salida', type: 'text', group: 'salida', required: true },
    {
      id: 'combustibleSalida',
      label: 'Combustible',
      type: 'select',
      options: ['VACÍO', '1/4', '1/2', '3/4', 'FULL'],
      group: 'salida',
      required: true,
    },

    // Datos de Entrada
    { id: 'fechaEntrada', label: 'Fecha', type: 'date', group: 'entrada', required: true },
    { id: 'horaIngreso', label: 'Hora Ingreso', type: 'text', group: 'entrada', required: true },
    {
      id: 'combustibleEntrada',
      label: 'Combustible',
      type: 'select',
      options: ['VACÍO', '1/4', '1/2', '3/4', 'FULL'],
      group: 'entrada',
      required: true,
    },

    // Checklist items - Salida
    {
      id: 'motorPrincipalSalida',
      label: 'Motor Principal',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoSalida',
      required: true,
    },
    {
      id: 'documentacionVehicularSalida',
      label: 'Documentación vehicular vigente',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoSalida',
      required: true,
    },
    {
      id: 'lucesYBalizasSalida',
      label: 'Luces y balizas funcionando',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoSalida',
      required: true,
    },
    {
      id: 'instalacionElectricaSalida',
      label: 'Instalación eléctrica y batería en buen estado',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoSalida',
      required: true,
    },
    {
      id: 'butacasConCinturesSalida',
      label: 'Butacas con cinturones de seguridad operativos',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoSalida',
      required: true,
    },
    {
      id: 'extintorYKitSalida',
      label: 'Extintor y kit de emergencia a disposición',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoSalida',
      required: true,
    },
    {
      id: 'sistemaFrenosSalida',
      label: 'Sistema de frenos funcionando correctamente',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoSalida',
      required: true,
    },
    {
      id: 'parabrisasYEspejosSalida',
      label: 'Parabrisas y espejos limpios y en buen estado',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoSalida',
      required: true,
    },
    {
      id: 'estadoCarroceriaSalida',
      label: 'Estado de la carrocería',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoSalida',
      required: true,
    },
    {
      id: 'estadoRuedasSalida',
      label: 'Estado de ruedas (ajuste y presión)',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoSalida',
      required: true,
    },
    {
      id: 'nivelLiquidosSalida',
      label: 'Nivel de líquidos (aceite, agua, hidráulico)',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoSalida',
      required: true,
    },
    {
      id: 'ruidoMotorSalida',
      label: 'Ruido de motor, gases, combustión',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoSalida',
      required: true,
    },

    // Checklist items - Entrada
    {
      id: 'motorPrincipalEntrada',
      label: 'Motor Principal',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoEntrada',
      required: true,
    },
    {
      id: 'documentacionVehicularEntrada',
      label: 'Documentación vehicular vigente',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoEntrada',
      required: true,
    },
    {
      id: 'lucesYBalizasEntrada',
      label: 'Luces y balizas funcionando',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoEntrada',
      required: true,
    },
    {
      id: 'instalacionElectricaEntrada',
      label: 'Instalación eléctrica y batería en buen estado',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoEntrada',
      required: true,
    },
    {
      id: 'butacasConCinturesEntrada',
      label: 'Butacas con cinturones de seguridad operativos',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoEntrada',
      required: true,
    },
    {
      id: 'extintorYKitEntrada',
      label: 'Extintor y kit de emergencia a disposición',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoEntrada',
      required: true,
    },
    {
      id: 'sistemaFrenosEntrada',
      label: 'Sistema de frenos funcionando correctamente',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoEntrada',
      required: true,
    },
    {
      id: 'parabrisasYEspejosEntrada',
      label: 'Parabrisas y espejos limpios y en buen estado',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoEntrada',
      required: true,
    },
    {
      id: 'estadoCarroceriaEntrada',
      label: 'Estado de la carrocería',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoEntrada',
      required: true,
    },
    {
      id: 'estadoRuedasEntrada',
      label: 'Estado de ruedas (ajuste y presión)',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoEntrada',
      required: true,
    },
    {
      id: 'nivelLiquidosEntrada',
      label: 'Nivel de líquidos (aceite, agua, hidráulico)',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoEntrada',
      required: true,
    },
    {
      id: 'ruidoMotorEntrada',
      label: 'Ruido de motor, gases, combustión',
      type: 'radio',
      options: ['BUENO', 'MALO'],
      group: 'chequeoEntrada',
      required: true,
    },

    // Datos adicionales
    { id: 'observaciones', label: 'OBSERVACIONES', type: 'textarea', group: 'adicionales', required: false },
    { id: 'inspeccionadoPor', label: 'INSPECCIONADO POR', type: 'text', group: 'adicionales', required: true },
    { id: 'recibidoPor', label: 'RECIBIDO POR', type: 'text', group: 'adicionales', required: true },
    { id: 'horaInspeccion', label: 'HORA INSPECCIÓN', type: 'text', group: 'adicionales', required: true },
    { id: 'fechaInspeccion', label: 'FECHA INSPECCIÓN', type: 'date', group: 'adicionales', required: true },
    { id: 'horaRecepcion', label: 'HORA RECEPCIÓN', type: 'text', group: 'adicionales', required: true },
    { id: 'fechaRecepcion', label: 'FECHA RECEPCIÓN', type: 'date', group: 'adicionales', required: true },
  ],
};

// Función para generar el schema de validación basado en la configuración
function generateSchema(config: typeof vehicleChecklistConfig, requiredGroups: string[]) {
  const schema: Record<string, any> = {};

  config.items.forEach((item) => {
    const isRequired = requiredGroups.includes(item.group);
    if (item.type === 'radio') {
      schema[item.id] = isRequired
        ? z.enum(item.options as [string, ...string[]], { required_error: `${item.label} es requerido` })
        : z.enum(item.options as [string, ...string[]]).optional();
    } else if (item.type === 'select') {
      schema[item.id] = isRequired
        ? z.string({ required_error: `${item.label} es requerido` }).min(1, { message: 'Este campo es requerido' })
        : z.string().optional();
    } else {
      schema[item.id] = isRequired
        ? z.string({ required_error: `${item.label} es requerido` }).min(1, { message: 'Este campo es requerido' })
        : z.string().optional();
    }
  });

  return z.object(schema);
}

// Componente principal del checklist vehicular
export default function CheckListVehicular({
  defaultAnswer,
  equipments,
  currentUser,
  resetQrSelection,
  default_equipment_id,
  empleado_name,
  singurl,
  form_Info,
  employees,
  title,
  description,
  preview,
}: {
  title?: string;
  description?: string;
  preview?: boolean;
  defaultAnswer?: CheckListAnswerWithForm[];
  equipments?: EquipmentForm['equipments'];
  currentUser?: Profile[];
  resetQrSelection?: (s: string) => void;
  default_equipment_id?: string;
  empleado_name?: string;
  singurl?: string;
  form_Info?: CustomForm[];
  employees?: {
    label: string;
    value: string;
  }[];
}) {
  const params = useParams();
  const router = useRouter();
  console.log(employees, 'employees');
  const actualCompany = useLoggedUserStore((s) => s.actualCompany);

  // Primero obtener el answer y flags
  const answer = defaultAnswer?.[0]?.answer || ({} as any);
  const inspeccionadoPorFilled = !!answer?.inspeccionadoPor;
  const recibidoPorFilled = !!answer?.recibidoPor;
  const isEmpty = !inspeccionadoPorFilled && !recibidoPorFilled;
  const isOnlySalida = inspeccionadoPorFilled && !recibidoPorFilled;
  const isCompleto = inspeccionadoPorFilled && recibidoPorFilled;

  // Determinar los grupos requeridos según el estado
  let requiredGroups: string[] = [];
  if (isEmpty) requiredGroups = ['general', 'salida', 'chequeoSalida'];
  else if (isOnlySalida) requiredGroups = ['entrada', 'chequeoEntrada', 'adicionales', 'recepcion'];
  else if (isCompleto) requiredGroups = []; // Todo opcional/readonly

  // Crear el schema y el formulario
  // Agregar campos de observaciones a mano al schema
  const [formSchema] = useState(() => {
    let schema = generateSchema(vehicleChecklistConfig, requiredGroups);
    schema = schema.extend({
      observaciones: z.string().optional(),
      observacionesSalida: z.string().optional(),
      observacionesEntrada: z.string().optional(),
    });
    return schema;
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultAnswer?.length
      ? (defaultAnswer[0].answer as z.infer<typeof formSchema>)
      : {
          fecha: moment().format('YYYY-MM-DD'),
          hora: moment().format('HH:mm'),
          movil: default_equipment_id || '',
          interno: equipments?.find((e) => e.value === default_equipment_id)?.intern_number || '',
          dominio:
            equipments?.find((e) => e.value === default_equipment_id)?.domain ||
            equipments?.find((e) => e.value === default_equipment_id)?.serie ||
            '',
          kilometraje: equipments?.find((e) => e.value === default_equipment_id)?.kilometer || '',
          modelo: equipments?.find((e) => e.value === default_equipment_id)?.model || '',
          marca: equipments?.find((e) => e.value === default_equipment_id)?.brand || '',
          inspeccionadoPor: empleado_name?.toUpperCase() || currentUser?.[0]?.fullname?.toUpperCase() || '',
          observacionesSalida: '',
          observacionesEntrada: '',
          observaciones: '',
          fecha_recepcion: moment().format('YYYY-MM-DD'),
          hora_recepcion: moment().format('HH:mm'),
          movil_recepcion: default_equipment_id || '',
          interno_recepcion: equipments?.find((e) => e.value === default_equipment_id)?.intern_number || '',
          dominio_recepcion:
            equipments?.find((e) => e.value === default_equipment_id)?.domain ||
            equipments?.find((e) => e.value === default_equipment_id)?.serie ||
            '',
          kilometraje_recepcion: equipments?.find((e) => e.value === default_equipment_id)?.kilometer || '',
          modelo_recepcion: equipments?.find((e) => e.value === default_equipment_id)?.model || '',
          marca_recepcion: equipments?.find((e) => e.value === default_equipment_id)?.brand || '',
          conductor_recepcion: empleado_name?.toUpperCase() || currentUser?.[0]?.fullname?.toUpperCase() || '',
          observaciones_recepcion: '',
        },
  });

  console.log(form.formState.errors, 'errors');

  // Función para enviar el formulario
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.promise(
      async () => {
        try {
          const equipment = equipments?.find((equipment) => equipment.value === data.movil);

          if (equipment && Number(data.kilometraje) < Number(equipment.kilometer)) {
            form.setError('kilometraje', { message: `El kilometraje no puede ser menor a ${equipment.kilometer}` });
            return;
          }

          console.log(data, 'data');

          // Si ya existe una respuesta previa (defaultAnswer[0]), hacemos update, si no, creamos
          if (defaultAnswer && defaultAnswer.length > 0) {
            // Update solo con los nuevos datos, merge en el backend
            await UpdateFormAnswer(defaultAnswer[0].id, data);
          } else {
            await CreateNewFormAnswer(resetQrSelection ? form_Info?.[0].id || '' : (params.id as string), data);
          }

          if (equipment && Number(data.kilometraje) > Number(equipment.kilometer)) {
            await UpdateVehicle(equipment.value, { kilometer: data.kilometraje });
          }
        } catch (error) {
          console.error('Error al guardar el checklist:', error);
        }
      },
      {
        loading: 'Guardando checklist...',
        success: 'Checklist guardado exitosamente',
        error: 'Error al guardar el checklist',
      }
    );
    router.refresh();
    if (resetQrSelection) {
      resetQrSelection('');
    } else {
      router.push(`/dashboard/forms/${params.id}`);
    }
  };

  // Agrupar items por categoría
  const general = vehicleChecklistConfig.items.filter((item) => item.group === 'general');
  const datosSalida = vehicleChecklistConfig.items.filter((item) => item.group === 'salida');
  const datosEntrada = vehicleChecklistConfig.items.filter((item) => item.group === 'entrada');
  const chequeoSalida = vehicleChecklistConfig.items.filter((item) => item.group === 'chequeoSalida');
  const chequeoEntrada = vehicleChecklistConfig.items.filter((item) => item.group === 'chequeoEntrada');
  const adicionales = vehicleChecklistConfig.items.filter((item) => item.group === 'adicionales');
  const [tab, setTab] = useState<'salida' | 'entrada'>('salida');

  return (
    <Card className="w-full mx-auto mb-6">
      {resetQrSelection && (
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Image src="/logoLetrasNegras.png" alt="Logo WFS" width={240} height={60} className="h-15" />
          </div>
          <CardDescription className="text-center text-gray-600">
            Sistema de Checklist y Mantenimiento de Equipos
          </CardDescription>
        </CardHeader>
      )}

      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
          <div>
            <CardTitle className="text-2xl">{vehicleChecklistConfig.title}</CardTitle>
            <CardDescription className="mt-2">{vehicleChecklistConfig.subtitle}</CardDescription>
          </div>
          <div className="flex gap-4">
            {resetQrSelection ? (
              <Button onClick={() => resetQrSelection('')} variant="ghost">
                Volver
              </Button>
            ) : (
              <BackButton />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Sección de datos generales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información General</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="movil"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Vehículo</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            disabled={defaultAnswer?.length || default_equipment_id ? true : false}
                            variant="outline"
                            role="combobox"
                            className={cn('justify-between', !field.value && 'text-muted-foreground')}
                          >
                            {field.value
                              ? equipments?.find((equipment) => equipment.value === field.value)?.label
                              : 'Seleccionar vehículo'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-full">
                          <Command>
                            <CommandInput placeholder="Buscar vehículo" />
                            <CommandList>
                              <CommandEmpty>Sin resultados</CommandEmpty>
                              <CommandGroup>
                                {equipments?.map((equipment) => (
                                  <CommandItem
                                    key={equipment.value}
                                    value={equipment.label}
                                    onSelect={() => {
                                      form.setValue('movil', equipment.value);
                                      form.setValue('interno', equipment.intern_number);
                                      form.setValue('kilometraje', equipment.kilometer);
                                      form.setValue('modelo', equipment.model || '');
                                      form.setValue('marca', equipment.brand || '');
                                      form.setValue('dominio', equipment.domain || equipment.serie || '');
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        equipment.value === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {equipment.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="chofer"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel>Conductor</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            disabled={defaultAnswer?.length || default_equipment_id ? true : false}
                            variant="outline"
                            role="combobox"
                            className={cn('justify-between', !field.value && 'text-muted-foreground')}
                          >
                            {field.value
                              ? employees?.find((employee) => employee.value === field.value)?.label
                              : 'Seleccionar conductor'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-full">
                          <Command>
                            <CommandInput placeholder="Buscar conductor" />
                            <CommandList>
                              <CommandEmpty>Sin resultados</CommandEmpty>
                              <CommandGroup>
                                {employees?.map((employee) => (
                                  <CommandItem
                                    key={employee.value}
                                    value={employee.label}
                                    onSelect={() => {
                                      form.setValue('chofer', employee.value);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        employee.value === field.value ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    {employee.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {general
                  .filter((item) => item.id !== 'movil' && item.id !== 'chofer')
                  .map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={item.id}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{item.label}</FormLabel>
                          <FormControl>
                            {item.type === 'date' ? (
                              <Input type="date" disabled={item.disabled || !isEmpty} {...field} />
                            ) : item.type === 'text' && item.id.toLowerCase().includes('hora') ? (
                              <Input type="time" disabled={item.disabled || !isEmpty} {...field} />
                            ) : item.type === 'text' ? (
                              <Input disabled={item.disabled || !isEmpty} {...field} />
                            ) : item.type === 'select' ? (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={item.disabled || !isEmpty}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                  {item.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : null}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
              </div>
            </div>

            {/* Tabs para salida/entrada */}

            <Tabs value={tab} onValueChange={(value) => setTab(value as 'salida' | 'entrada')} defaultValue="salida">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="salida">Chequeo de Salida</TabsTrigger>
                <TabsTrigger value="entrada">Chequeo de Entrada</TabsTrigger>
              </TabsList>

              {/* Tab de Salida */}
              <TabsContent value="salida" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {datosSalida.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={item.id}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{item.label}</FormLabel>
                          <FormControl>
                            {item.type === 'date' ? (
                              <Input type="date" disabled={item.disabled || !isEmpty} {...field} />
                            ) : item.type === 'text' && item.id.toLowerCase().includes('hora') ? (
                              <Input type="time" disabled={item.disabled || !isEmpty} {...field} />
                            ) : item.type === 'text' ? (
                              <Input disabled={item.disabled || !isEmpty} {...field} />
                            ) : item.type === 'select' ? (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={item.disabled || !isEmpty}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                  {item.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : null}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <h4 className="font-medium mt-4">Items de Verificación</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {chequeoSalida.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={item.id}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{item.label}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              disabled={item.disabled || !isEmpty}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              {item.options?.map((option) => (
                                <FormItem key={option} className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option} />
                                  </FormControl>
                                  <FormLabel className="font-normal">{option}</FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Tab de Entrada */}
              <TabsContent value="entrada" className="space-y-4 mt-4">
                {!isOnlySalida && !isCompleto && (
                  <CardDescription className="flex items-center mb-4 text-blue-600">
                    <InfoCircledIcon className="text-blue-600 mr-2 size-4" />
                    Estos campos estan deshabilitados hasta relizar el chequeo de salida
                  </CardDescription>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {datosEntrada.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={item.id}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{item.label}</FormLabel>
                          <FormControl>
                            {item.type === 'date' ? (
                              <Input type="date" disabled={item.disabled || !isOnlySalida} {...field} />
                            ) : item.type === 'text' && item.id.toLowerCase().includes('hora') ? (
                              <Input type="time" disabled={item.disabled || !isOnlySalida} {...field} />
                            ) : item.type === 'text' ? (
                              <Input disabled={item.disabled || !isOnlySalida} {...field} />
                            ) : item.type === 'select' ? (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={item.disabled || !isOnlySalida}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                  {item.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : null}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                <h4 className="font-medium mt-4">Items de Verificación</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {chequeoEntrada.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={item.id}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{item.label}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              disabled={item.disabled || !isOnlySalida}
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              {item.options?.map((option) => (
                                <FormItem key={option} className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option} />
                                  </FormControl>
                                  <FormLabel className="font-normal">{option}</FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Sección de datos adicionales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Adicional</h3>

              {/* Observaciones Salida */}
              {tab === 'salida' && (
                <FormField
                  control={form.control}
                  name="observacionesSalida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones de Salida</FormLabel>
                      <FormControl>
                        <Textarea disabled={!isEmpty} className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {/* Observaciones Entrada */}
              {tab === 'entrada' && (
                <FormField
                  control={form.control}
                  name="observacionesEntrada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones de Entrada</FormLabel>
                      <FormControl>
                        <Textarea disabled={isEmpty || isCompleto} className="min-h-[100px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Columna izquierda - Inspección solo en Salida */}
                {tab === 'salida' && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Inspección</h4>
                    <FormField
                      control={form.control}
                      name="inspeccionadoPor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inspeccionado por</FormLabel>
                          <FormControl>
                            <Input disabled={(defaultAnswer?.length ?? 0) > 0} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fechaInspeccion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha</FormLabel>
                            <FormControl>
                              <Input type="date" disabled={(defaultAnswer?.length ?? 0) > 0} {...field} />
                            </FormControl>{' '}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="horaInspeccion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hora</FormLabel>
                            <FormControl>
                              <Input type="time" disabled={(defaultAnswer?.length ?? 0) > 0} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Columna derecha - Recepción solo en Entrada */}
                {tab === 'entrada' && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Recepción</h4>
                    <FormField
                      control={form.control}
                      name="recibidoPor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recibido por</FormLabel>
                          <FormControl>
                            <Input disabled={isEmpty || isCompleto} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fechaRecepcion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha</FormLabel>
                            <FormControl>
                              <Input type="date" disabled={isEmpty || isCompleto} {...field} />
                            </FormControl>{' '}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="horaRecepcion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hora</FormLabel>
                            <FormControl>
                              <Input type="time" disabled={isEmpty || isCompleto} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botón de guardar (mostrar solo si no es una vista de checklist existente) */}
            {!isCompleto && (
              <div className="flex justify-end">
                <Button type="submit">Guardar Checklist</Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

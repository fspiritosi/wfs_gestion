'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { fetchAllEmployeesWithRelations } from '@/app/server/GET/actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useCountriesStore } from '@/store/countries';
import { useLoggedUserStore } from '@/store/loggedUser';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { PlusCircle, Users, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { MultiSelect } from './ui/multi-select-combobox-condition';
import { ScrollArea } from './ui/scroll-area';

// Configuración base de propiedades disponibles para filtrar
const baseEmployeePropertiesConfig = [
  // Propiedades simples
  { label: 'Sexo', accessor_key: 'gender' },
  { label: 'Estado Civil', accessor_key: 'marital_status' },
  { label: 'Nacionalidad', accessor_key: 'nationality' },
  { label: 'Tipo de DNI', accessor_key: 'document_type' },
  { label: 'Nivel de Educación', accessor_key: 'level_of_education' },
  { label: 'Estado', accessor_key: 'status' },
  { label: 'Tipo de Contrato', accessor_key: 'type_of_contract' },
  { label: 'Posición en la Compañía', accessor_key: 'company_position' },

  // Propiedades de objetos anidados - Se manejarán especialmente en getUniqueValues
  { label: 'País de Nacimiento', accessor_key: 'birthplace' }, // Es un objeto con propiedad name
  { label: 'Provincia', accessor_key: 'province' }, // Es un objeto con propiedad name
  { label: 'Ciudad', accessor_key: 'city' }, // Es un objeto con propiedad name
  { label: 'Posición Jerárquica', accessor_key: 'hierarchical_position' }, // Es un objeto con propiedad name
  { label: 'Diagrama de Flujo de Trabajo', accessor_key: 'workflow_diagram' }, // Es un objeto con propiedad name
  { label: 'Gremio', accessor_key: 'guild' }, // Puede ser null o un objeto con propiedad name
  { label: 'Convenio', accessor_key: 'covenant' }, // Puede ser null o un objeto con propiedad name
  { label: 'Categoría', accessor_key: 'category' }, // Puede ser null o un objeto con propiedad name

  // Array de objetos anidados
  { label: 'Clientes', accessor_key: 'contractor_employee' }, // Array de objetos donde cada uno tiene customers.name
];

const defaultValues = [
  {
    id: 'multiresource',
    label: 'Es multirecurso?',
    tooltip: 'Si el documento aplica a mas de una persona o equipo',
  },
  {
    id: 'mandatory',
    label: 'Es mandatorio?',
    tooltip: 'Si el documento es obligatorio, se crearan alertas para su cumplimiento',
  },
  { id: 'explired', label: 'Expira?', tooltip: 'Si el documento expira' },
  {
    id: 'special',
    label: 'Es especial?',
    tooltip: 'Si el documento requiere documentacion especial',
  },
  {
    id: 'is_it_montlhy',
    label: 'Es mensual?',
    tooltip: 'Si el documento vence mensualmente',
  },
  {
    id: 'private',
    label: 'Es privado?',
    tooltip: 'Si el documento es privado no sera visible para los usuarios con el rol invitado',
  },
  {
    id: 'down_document',
    label: 'Es un documento de baja?',
    tooltip: 'Si el documento es de baja solo se pedira cuando el empleado este dado de baja',
  },
];
type Condition = {
  property: string;
  values: string[];
  id: string;
};
export default function NewDocumentType({
  codeControlClient,
  optionChildrenProp,
}: {
  codeControlClient?: boolean;
  optionChildrenProp: string;
}) {
  const [special, setSpecial] = useState(false);
  const router = useRouter();
  const fetchDocumentTypes = useCountriesStore((state) => state.documentTypes);
  const documentTypes = useCountriesStore((state) => state.companyDocumentTypes);
  const fetchDocuments = useLoggedUserStore((state) => state.documetsFetch);
  const [items, setItems] = useState(defaultValues);
  const [employees, setEmployees] = useState<EmployeeDetailed[]>([]);

  // Estado para mantener las propiedades con sus valores dinámicos
  const [employeePropertiesConfig, setEmployeePropertiesConfig] = useState(
    baseEmployeePropertiesConfig.map((prop) => ({ ...prop, values: [] as string[] }))
  );

  // Para normalizar strings en comparaciones (minúsculas, sin acentos, sin espacios extra)
  function normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita acentos
      .trim();
  }

  // Devuelve el valor de la propiedad del empleado (ya normalizado para comparar)
  function getEmployeePropertyValue(employee: any, accessor_key: string): string {
    let value = employee[accessor_key as keyof typeof employee];
    let result = '';

    // Caso especial: contractor_employee (array de objetos cliente)
    if (accessor_key === 'contractor_employee' && Array.isArray(value)) {
      // Extraer nombres de clientes del array contractor_employee
      const clientNames = value
        .filter((item) => item && item.customers && item.customers.name)
        .map((item) => item.customers.name);

      // Si hay clientes, unirlos en un string; si no, valor vacío
      result = clientNames.length > 0 ? clientNames.join(',') : '';
    }
    // Maneja diferentes tipos de valores de propiedades
    else if (value && typeof value === 'object' && 'name' in value) {
      // Objetos con propiedad name (provincia, ciudad, etc.)
      result = value.name ? String(value.name).trim() : '';
    } else if (typeof value === 'boolean') {
      // Valores booleanos
      result = value ? 'Sí' : 'No';
    } else if (value === null && ['guild', 'covenant', 'category'].includes(accessor_key)) {
      // Propiedades especiales que pueden ser null
      result = 'No asignado';
    } else {
      // Otros tipos de valores
      result = value !== undefined && value !== null ? String(value).trim() : '';
    }

    console.log('[getEmployeePropertyValue]', { accessor_key, value, result });
    return result;
  }

  // Este useEffect se ha fusionado con el principal para reducir la cantidad total

  const [conditions, setConditions] = useState<Condition[]>([]);

  // ======== BLOQUE PRINCIPAL DE GESTIÓN DE EMPLEADOS Y FILTROS ========
  // Función principal que inicializa y maneja todo lo relacionado con empleados
  useEffect(() => {
    let isMounted = true;

    // 1. Cargar empleados (solo una vez al montar el componente)
    const fetchAndSetupEmployees = async () => {
      try {
        // Obtener empleados de la API
        const empleadosCargados = await fetchAllEmployeesWithRelations();
        if (!isMounted) return;

        // Establecer empleados
        setEmployees(empleadosCargados);

        // Extraer valores únicos para cada propiedad
        const updatedConfig = baseEmployeePropertiesConfig.map((prop) => {
          let values = empleadosCargados
            .map((employee) => getEmployeePropertyValue(employee, prop.accessor_key))
            .filter((v) => v !== undefined && v !== null && v !== '');
          values = Array.from(new Set(values));
          return { ...prop, values };
        });

        // Actualizar configuración de propiedades
        setEmployeePropertiesConfig(updatedConfig);

        // Inicialmente, todos los empleados coinciden (no hay filtros)
        setMatchingEmployees(empleadosCargados);
      } catch (error) {
        console.error('Error al cargar empleados:', error);
      }
    };

    fetchAndSetupEmployees();

    // Limpieza al desmontar
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Función que filtra empleados según las condiciones
  function filterEmployeesByConditions(empleados: any[], condiciones: any[], propConfig: any[]) {
    // Si no hay condiciones, mostrar todos los empleados
    if (!condiciones.length) return empleados;

    console.log('[Filtro] condiciones:', condiciones);

    return empleados.filter((employee) => {
      // El empleado debe cumplir TODAS las condiciones (AND entre condiciones)
      const cumple = condiciones.every((condition) => {
        // Si la condición no tiene propiedad o valores, se omite
        if (!condition.property || !condition.values.length) return true;

        // Buscar la configuración de la propiedad
        const propertyConfig = propConfig.find((config) => config.label === condition.property);
        if (!propertyConfig) return true;

        // Caso especial para clientes (contractor_employee)
        if (propertyConfig.accessor_key === 'contractor_employee') {
          const contractorEmployees = employee.contractor_employee || [];

          // Verificar si el empleado tiene al menos uno de los clientes seleccionados
          const tieneAlgunClienteSeleccionado = condition.values.some((clienteSeleccionado: string) => {
            return contractorEmployees.some(
              (contrato: any) =>
                contrato &&
                contrato.customers &&
                normalizeString(contrato.customers.name) === normalizeString(clienteSeleccionado)
            );
          });

          if (tieneAlgunClienteSeleccionado) {
            console.log('[Filtro] MATCH CLIENTE', {
              employee: employee.firstname,
              clientes: contractorEmployees.map((c: any) => c.customers?.name),
              buscados: condition.values,
            });
          }

          return tieneAlgunClienteSeleccionado;
        }

        // Para el resto de propiedades, comportamiento normal
        const employeeValue = getEmployeePropertyValue(employee, propertyConfig.accessor_key);

        // El empleado cumple si coincide con AL MENOS UNO de los valores (OR entre valores)
        const resultado = condition.values.some((v: string) => {
          // Usar normalizeString para una comparación más robusta
          const match = normalizeString(employeeValue) === normalizeString(v);
          if (match) {
            console.log('[Filtro] MATCH', { employee, property: condition.property, employeeValue, comparado: v });
          }
          return match;
        });

        if (!resultado) {
          console.log('[Filtro] NO MATCH', {
            employee,
            property: condition.property,
            employeeValue,
            valores: condition.values,
          });
        }

        return resultado;
      });

      if (cumple) {
        console.log('[Filtro] EMPLEADO INCLUÍDO', employee);
      }

      return cumple;
    });
  }

  // 3. Aplicar filtros cuando cambien las condiciones
  useEffect(() => {
    // Solo aplicar filtros si ya se han cargado empleados
    if (employees.length > 0) {
      const filtered = filterEmployeesByConditions(employees, conditions, employeePropertiesConfig);
      console.log('[Filtro] empleados filtrados:', filtered);
      setMatchingEmployees(filtered);
    }
  }, [conditions, employees, employeePropertiesConfig]);

  const selectOptions = optionChildrenProp === 'all' ? 'Personas, Equipos o Empresa' : optionChildrenProp;

  const isOptional = items.length < 5;
  const FormSchema = z.object({
    name: z
      .string({ required_error: 'Este campo es requerido' })
      .min(3, { message: 'El nombre debe contener mas de 3 caracteres' })
      .max(50, { message: 'El nombre debe contener menos de 50 caracteres' }),
    applies: z.enum(['Persona', 'Equipos', 'Empresa'], {
      required_error: 'Este campo es requerido',
    }),
    multiresource: isOptional
      ? z.boolean().optional()
      : z.boolean({
          required_error: 'Se debe seleccionar una opcion',
        }),
    mandatory: isOptional ? z.boolean().optional() : z.boolean({ required_error: 'Se debe seleccionar una opcion' }),
    explired: z.boolean({ required_error: 'Se debe seleccionar una opcion' }),
    special: isOptional ? z.boolean().optional() : z.boolean({ required_error: 'Este campo es requerido' }),
    description: isOptional
      ? z.string().optional()
      : special
        ? z.string({ required_error: 'Este campo es requerido' })
        : z.string().optional(),
    is_it_montlhy: z.boolean({ required_error: 'Este campo es requerido' }),
    private: z.boolean({ required_error: 'Este campo es requerido' }),
    down_document: z.boolean({ required_error: 'Este campo es requerido' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      multiresource: undefined,
      mandatory: undefined,
      explired: undefined,
      special: undefined,
      applies: selectOptions === 'all' ? undefined : (selectOptions as 'Empresa' | 'Persona' | 'Equipos' | undefined),
    },
  });

  useEffect(() => {
    if (selectOptions === 'Empresa') {
      setItems(defaultValues.filter((e) => e.id === 'explired' || e.id === 'is_it_montlhy' || e.id === 'private'));
    }
  }, [selectOptions]);

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const formattedValues = {
      ...values,
      name: formatName(values.name),
      description: formatDescription(values.description),
      company_id: codeControlClient ? useLoggedUserStore.getState().actualCompany?.id : null,
      multiresource: isOptional ? false : values.multiresource,
      mandatory: isOptional ? true : values.mandatory,
      special: isOptional ? false : values.special,
      down_document: isOptional ? false : values.down_document,
      private: values.private,
    };

    console.log('formattedValues', formattedValues);

    // toast.promise(
    //   async () => {
    //     const { data, error } = await supabase.from('document_types').insert(formattedValues).select();

    //     if (error) {
    //       throw new Error(handleSupabaseError(error.message));
    //     }
    //   },
    //   {
    //     loading: 'Creando documento...',
    //     success: (data) => {
    //       fetchDocumentTypes(useLoggedUserStore.getState().actualCompany?.id || '');
    //       fetchDocuments();
    //       router.refresh();
    //       if (codeControlClient) {
    //         document.getElementById('close_document_modal')?.click();
    //         return 'El documento se ha creado correctamente';
    //       } else {
    //         router.push('/auditor');
    //         return 'El documento se ha creado correctamente';
    //       }
    //     },
    //     error: (error) => {
    //       return error;
    //     },
    //   }
    // );
  }

  function formatName(name: string): string {
    // Capitalize first letter and convert the rest to lowercase
    return name.charAt(0)?.toUpperCase() + name.slice(1).toLowerCase();
  }

  function formatDescription(description: string | undefined): string | undefined {
    if (description) {
      // Capitalize first letter and convert the rest to lowercase
      return description.charAt(0)?.toUpperCase() + description.slice(1).toLowerCase();
    }
    return description;
  }

  const [down, setDown] = useState(false);

  const [matchingEmployees, setMatchingEmployees] = useState<EmployeeDetailed[]>([]);

  // Actualiza los valores de una condición existente
  const updateConditionValues = (id: string, values: string[]) => {
    setConditions((prev) => prev.map((condition) => (condition.id === id ? { ...condition, values } : condition)));
  };

  const [showEmployeePreview, setShowEmployeePreview] = useState(false);

  // Elimina una condición por su ID
  const removeCondition = (id: string) => {
    setConditions(conditions.filter((condition) => condition.id !== id));
  };

  const updateCondition = (id: string, field: 'property' | 'value', value: string) => {
    setConditions(
      conditions.map((condition) => {
        if (condition.id === id) {
          return { ...condition, [field]: value };
        }
        return condition;
      })
    );
  };

  const addCondition = () => {
    setConditions((prev) => [...prev, { property: '', values: [], id: Date.now().toString() }]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} className="w-full rounded-md border p-4 shadow" placeholder="Nombre del documento" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applies"
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Aplica a</FormLabel>
                <Select
                  onValueChange={(value) => {
                    if (value === 'Empresa') {
                      setItems(
                        defaultValues.filter(
                          (e) => e.id === 'explired' || e.id === 'is_it_montlhy' || e.id === 'private'
                        )
                      );
                      if (down) {
                        setDown(false);
                        const name = form.getValues('name');
                        form.reset({ name });
                        form.setValue('applies', 'Empresa');
                      } else {
                        form.setValue('down_document', false);
                      }
                    } else {
                      setItems(defaultValues);
                    }

                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectOptions} />
                    </SelectTrigger>
                  </FormControl>
                  {optionChildrenProp === 'all' ? (
                    <SelectContent>
                      <SelectItem value="Persona">Persona</SelectItem>
                      <SelectItem value="Equipos">Equipos</SelectItem>
                      <SelectItem value="Empresa">Empresa</SelectItem>
                    </SelectContent>
                  ) : (
                    <SelectContent>
                      <SelectItem value={optionChildrenProp || 'All'}>{optionChildrenProp}</SelectItem>
                    </SelectContent>
                  )}
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid md:grid-cols-2 grid-cols-1 gap-2 items-stretch justify-between">
          <TooltipProvider delayDuration={150}>
            {items?.map((item) => {
              if (!form.getValues('applies')) return;
              return (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={item.id as 'name' | 'applies' | 'multiresource' | 'mandatory' | 'explired' | 'special'}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex  space-x-2">
                        <FormControl>
                          <div className="flex flex-col space-x-2">
                            <div className="flex gap-3">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={field.value === true}
                                  disabled={
                                    down &&
                                    (item.id === 'is_it_montlhy' ||
                                      item.id === 'mandatory' ||
                                      item.id === 'explired' ||
                                      item.id === 'special' ||
                                      item.id === 'multiresource')
                                  }
                                  onCheckedChange={(value) => {
                                    if (value === false) {
                                      if (item.id === 'special') {
                                        setSpecial(false);
                                      }
                                      if (item.id === 'is_it_montlhy') {
                                        form.setValue('explired', false);
                                      }
                                      if (item.id === 'explired') {
                                        form.setValue('is_it_montlhy', false);
                                      }
                                      if (item.id === 'down_document') {
                                        setDown(false);
                                      }
                                    } else {
                                      if (item.id === 'special') {
                                        setSpecial(true);
                                      }
                                      if (item.id === 'is_it_montlhy') {
                                        form.setValue('explired', value ? false : true);
                                      }
                                      if (item.id === 'explired') {
                                        form.setValue('is_it_montlhy', value ? false : true);
                                      }
                                      if (item.id === 'down_document') {
                                        form.setValue('is_it_montlhy', false);
                                        form.setValue('mandatory', true);
                                        form.setValue('explired', false);
                                        form.setValue('special', false);
                                        form.setValue('multiresource', false);
                                        setDown(true);
                                      }
                                    }

                                    field.onChange(value ? true : false);
                                  }}
                                />
                                {/* <span>Sí</span> */}
                              </div>
                              {/* <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={field.value === false}
                                  disabled={
                                    down &&
                                    (item.id === 'is_it_montlhy' ||
                                      item.id === 'mandatory' ||
                                      item.id === 'explired' ||
                                      item.id === 'special' ||
                                      item.id === 'multiresource')
                                  }
                                  onCheckedChange={(value) => {
                                    field.onChange(value ? false : true);
                                    if (item.id === 'special') {
                                      setSpecial(false);
                                    }
                                    if (item.id === 'is_it_montlhy') {
                                      form.setValue('explired', false);
                                    }
                                    if (item.id === 'explired') {
                                      form.setValue('is_it_montlhy', false);
                                    }
                                    if (item.id === 'down_document') {
                                      setDown(false);
                                    }
                                  }}
                                />
                                <span>No</span>
                              </div> */}
                            </div>
                            <FormMessage />
                          </div>
                        </FormControl>
                        <FormLabel className="flex gap-1 items-center mb-2">
                          {item.label}
                          <Tooltip>
                            <TooltipTrigger className="hover:cursor-help" type="button">
                              <InfoCircledIcon className="text-blue-500 size-5" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <div className="space-y-1 leading-none"></div>
                      </div>
                    </FormItem>
                  )}
                />
              );
            })}
          </TooltipProvider>
        </div>
        {special && (
          <></>
          // <FormField
          //   control={form.control}
          //   name="description"
          //   render={({ field }) => (
          //     <FormItem>
          //       <div>
          //         <FormLabel>Documentacion Especial</FormLabel>
          //         <Select onValueChange={field.onChange} defaultValue={field.value}>
          //           <FormControl>
          //             <SelectTrigger>
          //               <SelectValue placeholder="Seleccionar documento especial" />
          //             </SelectTrigger>
          //           </FormControl>
          //           <SelectContent>
          //             <SelectItem value="Maneja">Maneja</SelectItem>
          //             <SelectItem value="Habilitacion especial">Habilitacion especial</SelectItem>

          //           </SelectContent>
          //         </Select>
          //       </div>
          //       <FormMessage />
          //     </FormItem>
          //   )}
          // />
        )}

        {special && (
          <div className="mt-4 border rounded-lg p-4 bg-slate-50">
            <div className="flex justify-between flex-col items-center mb-4">
              <h3 className="font-semibold text-lg mb-2">Condiciones Especiales</h3>
              <div className="flex justify-around w-full">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setShowEmployeePreview(!showEmployeePreview)}
                >
                  <Users className="h-4 w-4 mr-1" />
                  {showEmployeePreview ? 'Ocultar' : 'Ver'} Empleados ({matchingEmployees.length})
                </Button>
                <Button variant="outline" size="sm" type="button" onClick={addCondition}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Añadir Condición
                </Button>
              </div>
            </div>

            {conditions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>Añade condiciones para especificar a qué empleados aplica este documento.</p>
                <Button variant="outline" className="mt-2" type="button" onClick={addCondition}>
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Añadir Primera Condición
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {conditions.map((condition) => (
                  <Card key={condition.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Select
                          value={condition.property}
                          onValueChange={(value) => updateCondition(condition.id, 'property', value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Seleccionar propiedad" />
                          </SelectTrigger>
                          <SelectContent>
                            {employeePropertiesConfig.map((prop) => (
                              <SelectItem key={prop.accessor_key} value={prop.label}>
                                {prop.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {condition.property && (
                          <MultiSelect
                            options={
                              employeePropertiesConfig
                                .find((prop) => prop.label === condition.property)
                                ?.values.map((value: string) => ({
                                  label: value,
                                  value: value,
                                })) || []
                            }
                            selectedValues={condition.values}
                            setSelectedValues={(values: string[]) => updateConditionValues(condition.id, values)}
                            emptyMessage="No hay valores disponibles"
                            placeholder="Seleccionar valores"
                          />
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => removeCondition(condition.id)}
                          className="ml-auto"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {conditions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-sm font-medium">Resumen:</span>
                    {conditions.map((condition, index) => {
                      const propertyLabel = condition.property;

                      return condition.property && condition.values.length ? (
                        <Badge key={condition.id} variant="outline" className="text-xs">
                          {propertyLabel}: {condition.values.join(', ')}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}

            {showEmployeePreview && (
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="employees">
                  <AccordionTrigger>
                    Empleados que cumplen las condiciones ({matchingEmployees.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[200px] rounded-md border p-2">
                      {matchingEmployees.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No hay empleados que cumplan todas las condiciones seleccionadas
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Renderizado de empleados que cumplen con las condiciones */}
                          {matchingEmployees.map((employee) => {
                            console.log('[RENDER] matchingEmployees:', matchingEmployees);
                            return (
                              <div
                                key={employee.id}
                                className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md"
                              >
                                <Avatar>
                                  <AvatarImage src={employee.picture || '/placeholder.svg'} alt={employee.firstname} />
                                  <AvatarFallback>{employee.firstname.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {employee.firstname} {employee.lastname}
                                  </p>
                                  <div className="flex gap-1 flex-wrap">
                                    {conditions
                                      .filter((condition) => condition.property && condition.values.length)
                                      .flatMap((condition) => {
                                        const propertyConfig = employeePropertiesConfig.find(
                                          (config) => config.label === condition.property
                                        );
                                        if (!propertyConfig) return [];
                                        const employeeValue = getEmployeePropertyValue(
                                          employee,
                                          propertyConfig.accessor_key
                                        );
                                        const badges = condition.values
                                          .filter((v) => employeeValue.toLowerCase() === v.toLowerCase())
                                          .map((v) => (
                                            <Badge key={condition.property + v} variant="outline" className="text-xs">
                                              {condition.property}: {v}
                                            </Badge>
                                          ));
                                        if (badges.length > 0) {
                                          console.log('[BADGES]', {
                                            employee,
                                            property: condition.property,
                                            employeeValue,
                                            conditionValues: condition.values,
                                            badgesMostrados: badges.map((b) => b.key),
                                          });
                                        }
                                        return badges;
                                      })}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        )}
        <Button type="submit" id="create_new_document" className={cn(codeControlClient ? 'hidden' : '')}>
          Crear tipo de documento
        </Button>
      </form>
    </Form>
  );
}

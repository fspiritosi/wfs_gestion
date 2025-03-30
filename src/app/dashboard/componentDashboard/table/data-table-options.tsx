'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { saveAs } from 'file-saver';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { useEdgeFunctions } from '@/hooks/useEdgeFunctions';
import { handleSupabaseError } from '@/lib/errorHandler';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, DotsVerticalIcon } from '@radix-ui/react-icons';
import { addMonths, format, formatRelative } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';


const formSchema = z.object({
  reason_for_termination: z.string({
    required_error: 'La razón de la baja es requerida.',
  }),
  termination_date: z.date({
    required_error: 'La fecha de baja es requerida.',
  }),
});

type DocumentHistory = {
  documents_employees_id: string;
  modified_by: string;
  updated_at: string;
};

export function DataTableOptions({ row }: any) {
  const [showModal, setShowModal] = useState(false);
  const [integerModal, setIntegerModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [domain, setDomain] = useState('');
  const [documentHistory, setDocumentHistory] = useState<DocumentHistory[]>([]);
  //const user = row.original
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [showDeletedEquipment, setShowDeletedEquipment] = useState(false);

  const equipment = row.original;
  const document = row.original;

  const handleOpenModal = (id: string) => {
    setDomain(id);
    setShowModal(!showModal);
  };
  // const { fetchDocumentEquipmentByCompany } = useDocument()

  // useEffect(() => {
  //   fetchDocumentEquipmentByCompany
  // }, [])
  const handleOpenIntegerModal = (id: string) => {
    setDomain(id);
    setIntegerModal(!integerModal);
  };

  const handleOpenViewModal = (id: string) => {
    setDomain(id);

    setViewModal(!viewModal);
    viewDocumentEmployees();
  };

  const { errorTranslate } = useEdgeFunctions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason_for_termination: undefined,
    },
  });

  async function reintegerDocumentEmployees() {
    toast.promise(
      async () => {
        const supabase = supabaseBrowser();
        const { data, error } = await supabase
          .from('documents_employees')
          .update({
            is_active: true,
            // termination_date: null,
            // reason_for_termination: null,
          })
          .eq('id', document.id)
          .select();

        setIntegerModal(!integerModal);
        //setInactive(data as any)
        setShowDeletedEquipment(false);
        if (error) {
          throw new Error(error.message);
        }
      },
      {
        loading: 'Reintegrando...',
        success: 'Documento reintegrado!',
        error: (error) => {
          return error;
        },
      }
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.promise(
      async () => {
        const data = {
          ...values,
          termination_date: format(values.termination_date, 'yyyy-MM-dd'),
        };

        const supabase = supabaseBrowser();

        const { error } = await supabase
          .from('documents_employees')
          .update({
            is_active: false,
            //termination_date: data.termination_date,
            //reason_for_termination: data.reason_for_termination,
          })
          .eq('id', document.id)
          .select();

        setShowModal(!showModal);

        if (error) {
          throw new Error(error.message);
        }
      },
      {
        loading: 'Eliminando...',
        success: 'Documento eliminado!',
        error: (error) => {
          return error;
        },
      }
    );
  }
  const handleToggleInactive = () => {
    setShowInactive(!showInactive);
  };

  async function viewDocumentEmployees() {
    const supabase = supabaseBrowser();
    const { data, error } = await supabase
      .from('documents_employees_logs')
      .select('*, documents_employees(user_id(email))')
      .eq('documents_employees_id', document.id);

    if (error) {
      toast.error(`${handleSupabaseError(error.message)}`);
    }
    if (data) {
      setDocumentHistory(data);
    }
  }
  // useEffect(() => {
  // }, []);

  const today = new Date();
  const nextMonth = addMonths(new Date(), 1);
  const [month, setMonth] = useState<Date>(nextMonth);

  const yearsAhead = Array.from({ length: 20 }, (_, index) => {
    const year = today.getFullYear() - index - 1;
    return year;
  });
  const [years, setYear] = useState(today.getFullYear().toString());
  const supabase = supabaseBrowser();
  const handleDownload = async (path: string, fileName: string, resourceName: string) => {
    toast.promise(
      async () => {
        const { data, error } = await supabase.storage.from('document_files').download(path);

        if (error) {
          throw new Error(handleSupabaseError(error.message));
        }

        // Extrae la extensión del archivo del path
        const extension = path.split('.').pop();

        const blob = new Blob([data], { type: 'application/octet-stream' });
        // Usa la extensión del archivo al guardar el archivo
        saveAs(blob, `${resourceName} ${fileName}.${extension}`);
      },
      {
        loading: 'Descargando documento...',
        success: 'Documento descargado',
        error: (error) => {
          return error;
        },
      }
    );
  };

  return (
    <DropdownMenu>
      {integerModal && (
        <AlertDialog defaultOpen onOpenChange={() => setIntegerModal(!integerModal)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                {`Estás a punto de reintegrar el documento ${document.id_document_types}, que fue dado de baja por ${equipment.reason_for_termination} el día ${equipment.termination_date}. Al reintegrar el documento, se borrarán estas razones. Si estás seguro de que deseas reintegrarlo, haz clic en 'Continuar'. De lo contrario, haz clic en 'Cancelar'.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => reintegerDocumentEmployees()}>Continuar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {showModal && (
        <Dialog defaultOpen onOpenChange={() => setShowModal(!showModal)}>
          <DialogContent className="dark:bg-slate-950">
            <DialogTitle>Dar de baja Documento</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas dar de baja este documento?, completa los campos para continuar.
            </DialogDescription>
            <DialogFooter>
              <div className="w-full">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="reason_for_termination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motivo de Baja</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona la razón" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Despido de empleado">Despido de empleado</SelectItem>
                              <SelectItem value="Renuncia de empleado">Renuncia de empleado</SelectItem>
                              <SelectItem value="Cambio de Funciones de empleado">
                                Cambio de Funciones de empleado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>Elige la razón por la que deseas dar de baja el documento</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="termination_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha de Baja</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(' pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP', {
                                      locale: es,
                                    })
                                  ) : (
                                    <span>Elegir fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              {/* <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={date =>
                                    date > new Date() ||
                                    date < new Date('1900-01-01')
                                  }
                                  initialFocus
                                  locale={es}
                                /> */}
                              <Select
                                onValueChange={(e) => {
                                  setMonth(new Date(e));
                                  setYear(e);
                                  const newYear = parseInt(e, 10);
                                  const dateWithNewYear = new Date(field.value);
                                  dateWithNewYear.setFullYear(newYear);
                                  field.onChange(dateWithNewYear);
                                  setMonth(dateWithNewYear);
                                }}
                                value={years || today.getFullYear().toString()}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Elegir año" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                  <SelectItem
                                    value={today.getFullYear().toString()}
                                    disabled={years === today.getFullYear().toString()}
                                  >
                                    {today.getFullYear().toString()}
                                  </SelectItem>
                                  {yearsAhead?.map((year) => (
                                    <SelectItem key={year} value={`${year}`}>
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Calendar
                                month={month}
                                onMonthChange={setMonth}
                                toDate={today}
                                locale={es}
                                mode="single"
                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                selected={new Date(field.value) || today}
                                onSelect={(e) => {
                                  field.onChange(e);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>Fecha en la que se dio de baja</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4 justify-end">
                      <Button variant="destructive" type="submit">
                        Dar de Baja
                      </Button>
                      <DialogClose>Cancelar</DialogClose>
                    </div>
                  </form>
                </Form>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {viewModal && (
        <Dialog defaultOpen onOpenChange={() => setViewModal(!viewModal)}>
          <DialogContent>
            <DialogTitle>Historial de Modificaciones</DialogTitle>
            <DialogDescription>Aquí se muestra quién modificó el documento y cuándo</DialogDescription>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell className="text-center">Usuario</TableCell>
                  <TableCell className="text-center">Fecha de modificación</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documentHistory?.map((entry: any, index: number) => (
                  <TableRow key={crypto.randomUUID()}>
                    <TableCell className="text-center">{entry.documents_employees.user_id.email}</TableCell>

                    <TableCell className="text-center">
                      {formatRelative(new Date(entry.updated_at), new Date(), { locale: es })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DialogFooter>
              <Button onClick={() => setViewModal(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            navigator.clipboard.writeText(
              row.original.allocated_to === 'Vehículos' ? row.original.resource : row.original.document_number
            )
          }
        >
          {row.original.allocated_to === 'Vehículos' ? 'Copiar Patente' : 'Copiar Documento'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOpenViewModal(domain)}>Historial de Modificaciones</DropdownMenuItem>
        <DropdownMenuItem
          disabled={row.original.state === 'pendiente'}
          onClick={() =>
            // console.log('Andamo ruleta en una camioneta',row)
            handleDownload(row.original.document_url, row.original.documentName, row.original.resource)
          }
        >
          Descargar documento
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


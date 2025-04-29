'use client';

import { Badge } from '@/components/ui/badge';
import { InfoCircledIcon, PersonIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { AlertCircle } from 'lucide-react';
import moment from 'moment';
import { DataTableColumnHeader } from './data-table-column-header';

export const checkListAnswerColumns: ColumnDef<{
  id: string;
  domain: string;
  chofer: string;
  kilometer: string;
  created_at: string;
}>[] = [
  {
    accessorKey: 'domain',
    id: 'Dominio',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dominio" />,
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{row.original.domain}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'id',
    header: ({ column }) => null,
    cell: ({ row }) => {
      return null;
    },
  },
  {
    accessorKey: 'chofer',
    id: 'Chofer',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Chofer" />,
    cell: ({ row }) => {
      return (
        <div className="flex  items-center">
          <PersonIcon className="mr-1 text-gray-600" />
          {row.getValue('Chofer')}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'kilometer',
    id: 'Kilometraje',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Kilometraje" />,
    cell: ({ row }) => {
      const kilometraje = row.getValue('Kilometraje') as string;
      if (kilometraje) {

        return <div className="flex w-[150px] items-center">{kilometraje}</div>;
      }else{
        return <Badge className="w-[150px]"><InfoCircledIcon className="mr-1 text-white size-4" />No registrado</Badge>

      }
    },
  },
  {
    accessorKey: 'created_at',
    id: 'Fecha',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Creación" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{moment(row.getValue('Fecha')).format('DD/MM/YYYY')}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'inspeccionadoPor',
    id: 'Inspeccionado por',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Inspeccionado por" />,
    cell: ({ row }) => {
      return (
        <div className="flex  items-center">
          <PersonIcon className="mr-1 text-gray-600" />
          {row.getValue('Inspeccionado por')}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'recibidoPor',
    id: 'Recibido por',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Recibido por" />,
    cell: ({ row }) => {

      const recibidoPor =row.getValue('Recibido por')

      if(!recibidoPor){
        return(
          <div className="flex">
            <Badge className=""> <AlertCircle className="mr-1 text-white size-4" />Pendiente</Badge>
          </div>
        )
      }

      return (
        <div className="flex  items-center">
          <PersonIcon className="mr-1 text-gray-600" />
          {row.getValue('Recibido por')}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  
];

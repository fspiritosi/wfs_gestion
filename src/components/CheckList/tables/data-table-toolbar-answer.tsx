'use client';

import { Button } from '@/components/ui/button';
import { Cross2Icon, PersonIcon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Truck } from 'lucide-react';
import { DataTableAnswersFacetedFilter } from './data-table-answers-filters';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbarAnswer<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const uniqueChofer = table.getColumn('Chofer')?.getFacetedUniqueValues()
    ? Array.from(
        new Set(
          Array?.from((table.getColumn('Chofer')?.getFacetedUniqueValues() as any)?.keys()).map((item: any) => item)
        )
      )
    : [];

  const uniqueDomain = table.getColumn('Dominio')?.getFacetedUniqueValues()
    ? Array.from(
        new Set(
          Array?.from((table.getColumn('Dominio')?.getFacetedUniqueValues() as any)?.keys()).map((item: any) => item)
        )
      )
    : [];

  const domainOptions = uniqueDomain.map((domain) => {
    return {
      label: domain,
      value: domain,
      icon: Truck,
    };
  });

  const choferOptions = uniqueChofer.map((frecuencia) => {
    return {
      label: frecuencia,
      value: frecuencia,
      icon: PersonIcon,
    };
  });

  const uniqueRecibidoPor = table.getColumn('Recibido por')?.getFacetedUniqueValues()
    ? Array.from(
        new Set(
          Array?.from((table.getColumn('Recibido por')?.getFacetedUniqueValues() as any)?.keys()).map((item: any) => item)
        )
      )
    : [];

  const recibidoPorOptions = uniqueRecibidoPor.map((recibidoPor) => {
    return {
      label: recibidoPor,
      value: recibidoPor,
      icon: PersonIcon,
    };
  });

  const uniqueInspeccionadoPor = table.getColumn('Inspeccionado por')?.getFacetedUniqueValues()
    ? Array.from(
        new Set(
          Array?.from((table.getColumn('Inspeccionado por')?.getFacetedUniqueValues() as any)?.keys()).map((item: any) => item)
        )
      )
    : [];

  const inspeccionadoPorOptions = uniqueInspeccionadoPor.map((inspeccionadoPor) => {
    return {
      label: inspeccionadoPor,
      value: inspeccionadoPor,
      icon: PersonIcon,
    };
  });

  // console.log('uniqueChofer', uniqueChofer);
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn('Chofer') && (
          <DataTableAnswersFacetedFilter column={table.getColumn('Chofer')} title="Choferes" options={choferOptions} />
        )}
        {table.getColumn('Dominio') && (
          <DataTableAnswersFacetedFilter column={table.getColumn('Dominio')} title="Dominios" options={domainOptions} />
        )}
        {table.getColumn('Recibido por') && (
          <DataTableAnswersFacetedFilter column={table.getColumn('Recibido por')} title="Recibido por" options={recibidoPorOptions} />
        )}
        {table.getColumn('Inspeccionado por') && (
          <DataTableAnswersFacetedFilter column={table.getColumn('Inspeccionado por')} title="Inspeccionado por" options={inspeccionadoPorOptions} />
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Limpiar filtros
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}

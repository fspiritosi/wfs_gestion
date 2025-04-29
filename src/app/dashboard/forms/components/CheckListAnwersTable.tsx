import { checkListAnswerColumns } from '@/components/CheckList/tables/checkListAnswerColumns';
import { CheckListAnswerTable } from '@/components/CheckList/tables/data-table-answer';

async function CheckListAnwersTable({ answers, employees }: { answers: CheckListAnswerWithForm[]; employees: Employee[] }) {
  console.log(answers,'answers')
  return (
    <CheckListAnswerTable
      columns={checkListAnswerColumns}
      data={answers.map((e) => {
        // Nombre dinámico para chofer
        const choferId = (e.answer as { chofer?: string })?.chofer;
        const chofer = employees.find((emp) => emp.id === choferId);
        const choferName = chofer?.firstname ? `${chofer.firstname} ${chofer.lastname}` : choferId || '';

        // Nombre dinámico para inspeccionadoPor
        const inspeccionadoPorId = (e.answer as { inspeccionadoPor?: string })?.inspeccionadoPor;
        const inspeccionadoPor = employees.find((emp) => emp.id === inspeccionadoPorId);
        const inspeccionadoPorName = inspeccionadoPor?.firstname ? `${inspeccionadoPor.firstname} ${inspeccionadoPor.lastname}` : inspeccionadoPorId || '';

        // Nombre dinámico para recibidoPor
        const recibidoPorId = (e.answer as { recibidoPor?: string })?.recibidoPor;
        const recibidoPor = employees.find((emp) => emp.id === recibidoPorId);
        const recibidoPorName = recibidoPor?.firstname ? `${recibidoPor.firstname} ${recibidoPor.lastname}` : recibidoPorId || '';

        return {
          chofer: choferName,
          id: e.id,
          name: (e.answer as { dominio: string })?.dominio,
          kilometer: (e.answer as { kilometraje: string })?.kilometraje,
          created_at: e.created_at,
          domain: (e.answer as { dominio: string })?.dominio,
          inspeccionadoPor: inspeccionadoPorName,
          recibidoPor: recibidoPorName,
        };
      })}
    />
  );
}
export default CheckListAnwersTable;

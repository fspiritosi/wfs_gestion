import { getEmployeePropertyValue, getVehiclePropertyValue, normalizeString } from '@/components/NewDocumentType';

export function employeeMatchesConditions(employee: any, conditions: any[] | null): boolean {
  if (!conditions) return false;
  return conditions.every((cond) => {
    const raw = getEmployeePropertyValue(employee, cond.property_key);
    // si es array (p.ej. contractor_employee → "A,B,C")
    if (cond.is_array_relation) {
      const arr = raw.split(',').map((v) => normalizeString(v));
      return cond.values.map(normalizeString).some((wanted: any) => arr.includes(wanted));
    }
    // comparación simple
    return cond.values.map(normalizeString).some((wanted: any) => normalizeString(raw) === wanted);
  });
}

export function equipmentMatchesConditions(equipment: any, conditions: any[] | null): boolean {
  if (!conditions) return false;

  return conditions.every((cond) => {
    const raw = getVehiclePropertyValue(equipment, cond.property_key);

    // Si es relación múltiple (p.ej. contractor_equipment → "A,B,C")
    if (cond.is_array_relation) {
      const arr = raw.split(',').map((v) => normalizeString(v));
      // OR entre valores: basta que uno de los valores buscados exista en arr
      return cond.values.map(normalizeString).some((wanted: string) => arr.includes(wanted));
    }

    // Comparación simple: OR entre valores de la condición
    return cond.values.map(normalizeString).some((wanted: string) => normalizeString(raw) === wanted);
  });
}


export interface IncidentsStatusCounts {
  Abierto: number;
  Aprobado: number;
  Cancelado: number;
  Finalizado: number;
  Total: number;
}

export interface IncidentsByMonth {
  mes_anio: string;
  idStatusIncident: number;
  status: string;
  total: number;
}


export interface ShovelsStatusCounts {
  Online: number;
  Mantenimiento: number;
  Offline: number;
  Total: number;
}

export interface ShovelsByBrand {
  brand: string;
  status: number;
  statusName: string;
  total: number;
}


export interface DashboardJsonResponseItem {
  incidents_status_counts: IncidentsStatusCounts;
  incidents_by_month: IncidentsByMonth[];
  shovels_status_counts: ShovelsStatusCounts;
  shovels_by_brand: ShovelsByBrand[];
}

export interface DashboardResponse {
  JsonResponse: DashboardJsonResponseItem[];
}

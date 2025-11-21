export interface IncidentDetail {
  idINCIDNT: number;
  datetime: string;
  description: string;
  observation: string | null;
  idUser: number | null;
  shovel: Shovel;
  image: IncidentImage;
  statusIncident: StatusIncident;
}

export interface Shovel {
  idShovel: number;
  serialNumber: string;
  model: string;
  brand: string;
  status: ShovelStatus;
  dateTime: string;
}

export interface ShovelStatus {
  idStatus: number;
  name: string;
  description: string;
  operation: number;
}

export interface IncidentImage {
  idImage: number;
  path: string;
  rawName: string;
  dateTimePic: string;
}

export interface StatusIncident {
  idStatus: number;
  name: string;
  description: string;
}

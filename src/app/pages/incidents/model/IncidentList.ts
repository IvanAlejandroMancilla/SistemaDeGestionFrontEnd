export interface Incident {
  idINCIDNT: number;
  datetime: string;
  description: string | null;
  observation: string | null;
  idUser: number | null;
  shovel: {
    idShovel: number;
    serialNumber: string;
    model: string;
    brand: string;
    status: {
      idStatus: number;
      name: string;
      description: string;
      operation: number;
    };
    dateTime: string;
  };
  image: {
    idImage: number;
    path: string;
    rawName: string;
    dateTimePic: string;
  };
  statusIncident: {
    idStatus: number;
    name: string;
    description: string;
  };
}

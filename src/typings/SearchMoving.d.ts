export interface ISearchMovingState {
  formPlace: string;
  formDateStart: string;
  formDateEnd: string;
  listResults: IMovingEvent[]
}

export interface IMovingEvent {
  dateStart: Date;
  idUserMoving: number;
  localization: IVille;
  moversNeeded: number; 
}

export interface IVille {
  nom: string,
  code: string;
  codeDepartement: string;
  codeRegion: string;
  codePostaux: string[],
}
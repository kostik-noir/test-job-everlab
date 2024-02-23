export interface Observation {
  name: string;
  value: number;
  unit: string;
  gender: string,
  minAge: number,
  maxAge: number,
  standardLower: number;
  standardHigher: number;
  everlabLower: number;
  everlabHigher: number;
  diagnostics: string[];
  conditions: string[];
}

export interface Results {
  observations: Observation[];
}

export interface ViewWithUploadNewFileBtn {
  onUploadNewFileButtonPressed: () => void;
}

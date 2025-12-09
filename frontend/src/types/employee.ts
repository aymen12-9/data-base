// Fichier : frontend/src/types/employee.ts
// Version mise à jour

export interface Employee {
  _id: string;
  nom: string;
  prenom: string;
  anciennete?: number;
  prime?: number;
  adresse?: {
    numero?: number;
    rue?: string;
    codepostal?: number;
    ville?: string;
  };
}

export interface VilleStats {
  _id: string;
  value: {
    count: number;
    sum: number;
    avg: number;
    min: number;
    max: number;
    variance: number;
    std_dev: number;
    senior_ratio: number;
    junior_ratio: number;
  };
}

export interface Doublon {
  _id: string;
  value: {
    ids: string[];
    noms: string[];
    prenoms: string[];
    adresses: any[];
    count: number;
    adresses_differentes: boolean;
  };
}

// Force refresh
export interface Resident {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  phone: string;
  email: string;
  address: string;
  housing: "owned" | "rented";
  residents: number;
  cid?: string;
  disabilityDescription?: string;
  elderly: boolean;
  elderlyAge?: number;
  hasDisability: boolean;
  isForeigner: boolean;
  foreignDocNumber?: string;
  hasGovernmentAssistance: boolean;
  governmentAssistance: Array<{
    type: string;
    value: string;
  }>;
  dependents: Array<{
    ageRange: string;
    hasDisability: boolean;
    cid?: string;
    disabilityDescription?: string;
  }>;
  createdAt: string;
  updatedAt?: string;
}

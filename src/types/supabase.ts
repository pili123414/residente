export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      residents: {
        Row: {
          id: string;
          name: string;
          cpf: string;
          rg: string;
          phone: string;
          email: string;
          address: string;
          housing: string;
          residents: number;
          cid: string | null;
          disabilityDescription: string | null;
          elderly: boolean;
          elderlyAge: number | null;
          hasDisability: boolean;
          isForeigner: boolean;
          foreignDocNumber: string | null;
          hasGovernmentAssistance: boolean;
          governmentAssistance: Json | null;
          dependents: Json | null;
          createdAt: string;
          updatedAt: string | null;
        };
        Insert: {
          id: string;
          name: string;
          cpf: string;
          rg: string;
          phone: string;
          email: string;
          address: string;
          housing: string;
          residents: number;
          cid?: string | null;
          disabilityDescription?: string | null;
          elderly: boolean;
          elderlyAge?: number | null;
          hasDisability: boolean;
          isForeigner: boolean;
          foreignDocNumber?: string | null;
          hasGovernmentAssistance: boolean;
          governmentAssistance?: Json | null;
          dependents?: Json | null;
          createdAt: string;
          updatedAt?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          cpf?: string;
          rg?: string;
          phone?: string;
          email?: string;
          address?: string;
          housing?: string;
          residents?: number;
          cid?: string | null;
          disabilityDescription?: string | null;
          elderly?: boolean;
          elderlyAge?: number | null;
          hasDisability?: boolean;
          isForeigner?: boolean;
          foreignDocNumber?: string | null;
          hasGovernmentAssistance?: boolean;
          governmentAssistance?: Json | null;
          dependents?: Json | null;
          createdAt?: string;
          updatedAt?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

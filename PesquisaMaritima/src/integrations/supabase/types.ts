export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      coletas: {
        Row: {
          comprimento: number | null
          created_at: string | null
          data: string
          embarcacao_id: string | null
          foto_1: string | null
          foto_2: string | null
          foto_3: string | null
          id: string
          local: string | null
          nome_cientifico: string | null
          nome_comum: string | null
          peso: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comprimento?: number | null
          created_at?: string | null
          data: string
          embarcacao_id?: string | null
          foto_1?: string | null
          foto_2?: string | null
          foto_3?: string | null
          id?: string
          local?: string | null
          nome_cientifico?: string | null
          nome_comum?: string | null
          peso?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comprimento?: number | null
          created_at?: string | null
          data?: string
          embarcacao_id?: string | null
          foto_1?: string | null
          foto_2?: string | null
          foto_3?: string | null
          id?: string
          local?: string | null
          nome_cientifico?: string | null
          nome_comum?: string | null
          peso?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coletas_embarcacao_id_fkey"
            columns: ["embarcacao_id"]
            isOneToOne: false
            referencedRelation: "embarcacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      embarcacoes: {
        Row: {
          created_at: string | null
          id: string
          laboratorio_id: string | null
          tipo: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          laboratorio_id?: string | null
          tipo: string
        }
        Update: {
          created_at?: string | null
          id?: string
          laboratorio_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "embarcacoes_laboratorio_id_fkey"
            columns: ["laboratorio_id"]
            isOneToOne: false
            referencedRelation: "laboratorios"
            referencedColumns: ["id"]
          },
        ]
      }
      favoritos: {
        Row: {
          coleta_id: string
          created_at: string | null
          user_id: string
        }
        Insert: {
          coleta_id: string
          created_at?: string | null
          user_id: string
        }
        Update: {
          coleta_id?: string
          created_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_coleta_id_fkey"
            columns: ["coleta_id"]
            isOneToOne: false
            referencedRelation: "coletas"
            referencedColumns: ["id"]
          },
        ]
      }
      laboratorios: {
        Row: {
          created_at: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cargo: string | null
          created_at: string | null
          descricao: string | null
          email: string
          foto_perfil: string | null
          id: string
          laboratorio_id: string | null
          nome: string
          status: boolean | null
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          created_at?: string | null
          descricao?: string | null
          email: string
          foto_perfil?: string | null
          id: string
          laboratorio_id?: string | null
          nome: string
          status?: boolean | null
          updated_at?: string | null
        }
        Update: {
          cargo?: string | null
          created_at?: string | null
          descricao?: string | null
          email?: string
          foto_perfil?: string | null
          id?: string
          laboratorio_id?: string | null
          nome?: string
          status?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_laboratorio_id_fkey"
            columns: ["laboratorio_id"]
            isOneToOne: false
            referencedRelation: "laboratorios"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_coletas_with_details: {
        Args: Record<PropertyKey, never>
        Returns: {
          comprimento: number
          created_at: string
          data: string
          embarcacao_tipo: string
          foto_1: string
          foto_2: string
          foto_3: string
          id: string
          laboratorio_nome: string
          local: string
          nome_cientifico: string
          nome_comum: string
          peso: number
          user_id: string
          user_nome: string
        }[]
      }
      get_user_collection_stats: {
        Args: { p_user_id: string }
        Returns: {
          especies_unicas: number
          total_coletas: number
          total_favoritos: number
          ultima_coleta: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "researcher"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "researcher"],
    },
  },
} as const

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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      advanced_visualizations: {
        Row: {
          access_permissions: string[] | null
          configuration: Json
          created_at: string | null
          created_by: string
          data_sources: Json
          id: string
          interactivity_settings: Json | null
          last_modified_by: string | null
          layout_specification: Json
          performance_metrics: Json | null
          refresh_schedule:
            | Database["public"]["Enums"]["refresh_schedule_enum"]
            | null
          status: Database["public"]["Enums"]["visualization_status_enum"]
          styling_configuration: Json | null
          updated_at: string | null
          usage_analytics: Json | null
          user_feedback: Json | null
          version: string
          visualization_name: string
          visualization_type: Database["public"]["Enums"]["visualization_type_enum"]
        }
        Insert: {
          access_permissions?: string[] | null
          configuration?: Json
          created_at?: string | null
          created_by: string
          data_sources?: Json
          id?: string
          interactivity_settings?: Json | null
          last_modified_by?: string | null
          layout_specification?: Json
          performance_metrics?: Json | null
          refresh_schedule?:
            | Database["public"]["Enums"]["refresh_schedule_enum"]
            | null
          status?: Database["public"]["Enums"]["visualization_status_enum"]
          styling_configuration?: Json | null
          updated_at?: string | null
          usage_analytics?: Json | null
          user_feedback?: Json | null
          version?: string
          visualization_name: string
          visualization_type: Database["public"]["Enums"]["visualization_type_enum"]
        }
        Update: {
          access_permissions?: string[] | null
          configuration?: Json
          created_at?: string | null
          created_by?: string
          data_sources?: Json
          id?: string
          interactivity_settings?: Json | null
          last_modified_by?: string | null
          layout_specification?: Json
          performance_metrics?: Json | null
          refresh_schedule?:
            | Database["public"]["Enums"]["refresh_schedule_enum"]
            | null
          status?: Database["public"]["Enums"]["visualization_status_enum"]
          styling_configuration?: Json | null
          updated_at?: string | null
          usage_analytics?: Json | null
          user_feedback?: Json | null
          version?: string
          visualization_name?: string
          visualization_type?: Database["public"]["Enums"]["visualization_type_enum"]
        }
        Relationships: []
      }
      ai_tool_categories: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          team_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_tool_categories_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_tools: {
        Row: {
          added_by: string
          category: string
          created_at: string | null
          id: string
          is_favorite: boolean | null
          link: string
          name: string
          note: string | null
          rating: number | null
          tags: string[] | null
          team_id: string | null
        }
        Insert: {
          added_by: string
          category: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          link: string
          name: string
          note?: string | null
          rating?: number | null
          tags?: string[] | null
          team_id?: string | null
        }
        Update: {
          added_by?: string
          category?: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          link?: string
          name?: string
          note?: string | null
          rating?: number | null
          tags?: string[] | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_tools_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      airlines: {
        Row: {
          country: string | null
          created_at: string | null
          iata_code: string
          icao_code: string
          id: string
          name: string
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          iata_code: string
          icao_code: string
          id?: string
          name: string
        }
        Update: {
          country?: string | null
          created_at?: string | null
          iata_code?: string
          icao_code?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      anomaly_detections: {
        Row: {
          affected_metrics: Json
          anomaly_score: number
          anomaly_type: Database["public"]["Enums"]["anomaly_type_enum"]
          assigned_to: string | null
          business_impact: Json | null
          created_at: string | null
          data_source: string
          description: string
          detection_timestamp: string
          entity_id: string | null
          false_positive: boolean | null
          feedback_incorporated: boolean | null
          id: string
          investigation_status: Database["public"]["Enums"]["investigation_status_enum"]
          model_id: string | null
          recommended_actions: Json | null
          resolution_notes: string | null
          resolved_at: string | null
          root_cause_analysis: Json | null
          severity: Database["public"]["Enums"]["anomaly_severity_enum"]
        }
        Insert: {
          affected_metrics?: Json
          anomaly_score: number
          anomaly_type: Database["public"]["Enums"]["anomaly_type_enum"]
          assigned_to?: string | null
          business_impact?: Json | null
          created_at?: string | null
          data_source: string
          description: string
          detection_timestamp?: string
          entity_id?: string | null
          false_positive?: boolean | null
          feedback_incorporated?: boolean | null
          id?: string
          investigation_status?: Database["public"]["Enums"]["investigation_status_enum"]
          model_id?: string | null
          recommended_actions?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          root_cause_analysis?: Json | null
          severity: Database["public"]["Enums"]["anomaly_severity_enum"]
        }
        Update: {
          affected_metrics?: Json
          anomaly_score?: number
          anomaly_type?: Database["public"]["Enums"]["anomaly_type_enum"]
          assigned_to?: string | null
          business_impact?: Json | null
          created_at?: string | null
          data_source?: string
          description?: string
          detection_timestamp?: string
          entity_id?: string | null
          false_positive?: boolean | null
          feedback_incorporated?: boolean | null
          id?: string
          investigation_status?: Database["public"]["Enums"]["investigation_status_enum"]
          model_id?: string | null
          recommended_actions?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          root_cause_analysis?: Json | null
          severity?: Database["public"]["Enums"]["anomaly_severity_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "anomaly_detections_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ml_models"
            referencedColumns: ["id"]
          },
        ]
      }
      availability: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_available: boolean | null
          notes: string | null
          preferred_end_time: string | null
          preferred_start_time: string | null
          team_id: string | null
          team_member_email: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          preferred_end_time?: string | null
          preferred_start_time?: string | null
          team_id?: string | null
          team_member_email: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_available?: boolean | null
          notes?: string | null
          preferred_end_time?: string | null
          preferred_start_time?: string | null
          team_id?: string | null
          team_member_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      available_shifts: {
        Row: {
          claimed_by: string | null
          competence_required: string | null
          created_at: string | null
          created_by: string
          date: string
          description: string | null
          end_time: string
          id: string
          shift_type: string | null
          start_time: string
          team_id: string | null
        }
        Insert: {
          claimed_by?: string | null
          competence_required?: string | null
          created_at?: string | null
          created_by: string
          date: string
          description?: string | null
          end_time: string
          id?: string
          shift_type?: string | null
          start_time: string
          team_id?: string | null
        }
        Update: {
          claimed_by?: string | null
          competence_required?: string | null
          created_at?: string | null
          created_by?: string
          date?: string
          description?: string | null
          end_time?: string
          id?: string
          shift_type?: string | null
          start_time?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "available_shifts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          actual_amount: number | null
          allocated_amount: number | null
          approval_status: Database["public"]["Enums"]["approval_status_enum"]
          approved_at: string | null
          budget_items: Json
          budget_type: Database["public"]["Enums"]["budget_type_enum"]
          committed_amount: number | null
          cost_center_id: string | null
          created_at: string | null
          currency: string
          description: string | null
          fiscal_year: number
          id: string
          name: string
          period_end: string
          period_start: string
          remaining_amount: number | null
          total_budget: number
          updated_at: string | null
        }
        Insert: {
          actual_amount?: number | null
          allocated_amount?: number | null
          approval_status?: Database["public"]["Enums"]["approval_status_enum"]
          approved_at?: string | null
          budget_items?: Json
          budget_type: Database["public"]["Enums"]["budget_type_enum"]
          committed_amount?: number | null
          cost_center_id?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          fiscal_year: number
          id?: string
          name: string
          period_end: string
          period_start: string
          remaining_amount?: number | null
          total_budget: number
          updated_at?: string | null
        }
        Update: {
          actual_amount?: number | null
          allocated_amount?: number | null
          approval_status?: Database["public"]["Enums"]["approval_status_enum"]
          approved_at?: string | null
          budget_items?: Json
          budget_type?: Database["public"]["Enums"]["budget_type_enum"]
          committed_amount?: number | null
          cost_center_id?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          fiscal_year?: number
          id?: string
          name?: string
          period_end?: string
          period_start?: string
          remaining_amount?: number | null
          total_budget?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      business_impact_analysis: {
        Row: {
          alternative_processes: Json | null
          business_function: string
          created_at: string | null
          criticality_level: Database["public"]["Enums"]["criticality_level_enum"]
          department: string | null
          dependencies: Json | null
          function_type: Database["public"]["Enums"]["function_type_enum"]
          id: string
          impact_financial: number | null
          impact_operational: string | null
          impact_regulatory: string | null
          impact_reputational: string | null
          last_updated: string
          maximum_tolerable_downtime: number | null
          minimum_resources: Json
          next_review_date: string
          recovery_point_objective: number | null
          recovery_time_objective: number | null
          responsible_manager: string | null
          seasonal_variations: Json | null
        }
        Insert: {
          alternative_processes?: Json | null
          business_function: string
          created_at?: string | null
          criticality_level: Database["public"]["Enums"]["criticality_level_enum"]
          department?: string | null
          dependencies?: Json | null
          function_type: Database["public"]["Enums"]["function_type_enum"]
          id?: string
          impact_financial?: number | null
          impact_operational?: string | null
          impact_regulatory?: string | null
          impact_reputational?: string | null
          last_updated?: string
          maximum_tolerable_downtime?: number | null
          minimum_resources?: Json
          next_review_date: string
          recovery_point_objective?: number | null
          recovery_time_objective?: number | null
          responsible_manager?: string | null
          seasonal_variations?: Json | null
        }
        Update: {
          alternative_processes?: Json | null
          business_function?: string
          created_at?: string | null
          criticality_level?: Database["public"]["Enums"]["criticality_level_enum"]
          department?: string | null
          dependencies?: Json | null
          function_type?: Database["public"]["Enums"]["function_type_enum"]
          id?: string
          impact_financial?: number | null
          impact_operational?: string | null
          impact_regulatory?: string | null
          impact_reputational?: string | null
          last_updated?: string
          maximum_tolerable_downtime?: number | null
          minimum_resources?: Json
          next_review_date?: string
          recovery_point_objective?: number | null
          recovery_time_objective?: number | null
          responsible_manager?: string | null
          seasonal_variations?: Json | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          action_items: string[] | null
          agenda: string[] | null
          agreements: string[] | null
          assigned_members: string[] | null
          attendees: string[] | null
          brainstorm_items: string[] | null
          created_at: string | null
          created_by: string
          date: string
          description: string | null
          end_time: string | null
          id: string
          location: string | null
          meeting_notes: string | null
          meeting_status: string | null
          meeting_summary: string | null
          team_id: string
          time: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          action_items?: string[] | null
          agenda?: string[] | null
          agreements?: string[] | null
          assigned_members?: string[] | null
          attendees?: string[] | null
          brainstorm_items?: string[] | null
          created_at?: string | null
          created_by: string
          date: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          meeting_notes?: string | null
          meeting_status?: string | null
          meeting_summary?: string | null
          team_id: string
          time?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          action_items?: string[] | null
          agenda?: string[] | null
          agreements?: string[] | null
          assigned_members?: string[] | null
          attendees?: string[] | null
          brainstorm_items?: string[] | null
          created_at?: string | null
          created_by?: string
          date?: string
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          meeting_notes?: string | null
          meeting_status?: string | null
          meeting_summary?: string | null
          team_id?: string
          time?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      competitive_intelligence: {
        Row: {
          actionable_insights: string | null
          collection_date: string
          competitor_name: string
          confidentiality_level: Database["public"]["Enums"]["confidentiality_level_enum"]
          created_at: string | null
          created_by: string
          data_source: string
          id: string
          impact_assessment: Json | null
          intelligence_data: Json
          intelligence_type: Database["public"]["Enums"]["intelligence_type_enum"]
          recommended_response: string | null
          relevance_score: number | null
          reliability_score: number | null
          retention_period: number | null
          strategic_importance: Database["public"]["Enums"]["strategic_importance_enum"]
          verified: boolean | null
          verified_by: string | null
        }
        Insert: {
          actionable_insights?: string | null
          collection_date: string
          competitor_name: string
          confidentiality_level?: Database["public"]["Enums"]["confidentiality_level_enum"]
          created_at?: string | null
          created_by: string
          data_source: string
          id?: string
          impact_assessment?: Json | null
          intelligence_data?: Json
          intelligence_type: Database["public"]["Enums"]["intelligence_type_enum"]
          recommended_response?: string | null
          relevance_score?: number | null
          reliability_score?: number | null
          retention_period?: number | null
          strategic_importance?: Database["public"]["Enums"]["strategic_importance_enum"]
          verified?: boolean | null
          verified_by?: string | null
        }
        Update: {
          actionable_insights?: string | null
          collection_date?: string
          competitor_name?: string
          confidentiality_level?: Database["public"]["Enums"]["confidentiality_level_enum"]
          created_at?: string | null
          created_by?: string
          data_source?: string
          id?: string
          impact_assessment?: Json | null
          intelligence_data?: Json
          intelligence_type?: Database["public"]["Enums"]["intelligence_type_enum"]
          recommended_response?: string | null
          relevance_score?: number | null
          reliability_score?: number | null
          retention_period?: number | null
          strategic_importance?: Database["public"]["Enums"]["strategic_importance_enum"]
          verified?: boolean | null
          verified_by?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          airline_id: string | null
          auto_renewal: boolean | null
          contract_file_url: string | null
          contract_number: string
          contract_status: Database["public"]["Enums"]["contract_status_enum"]
          contract_type: Database["public"]["Enums"]["contract_type_enum"]
          created_at: string | null
          currency: string
          description: string | null
          end_date: string
          escalation_procedures: Json | null
          id: string
          payment_terms: Json
          penalties_and_incentives: Json | null
          renewal_notice_days: number | null
          service_level_agreements: Json | null
          signed_by_airline: string | null
          signed_by_company: string | null
          signed_date: string | null
          start_date: string
          termination_clauses: Json | null
          title: string
          total_contract_value: number | null
          updated_at: string | null
        }
        Insert: {
          airline_id?: string | null
          auto_renewal?: boolean | null
          contract_file_url?: string | null
          contract_number: string
          contract_status?: Database["public"]["Enums"]["contract_status_enum"]
          contract_type: Database["public"]["Enums"]["contract_type_enum"]
          created_at?: string | null
          currency?: string
          description?: string | null
          end_date: string
          escalation_procedures?: Json | null
          id?: string
          payment_terms?: Json
          penalties_and_incentives?: Json | null
          renewal_notice_days?: number | null
          service_level_agreements?: Json | null
          signed_by_airline?: string | null
          signed_by_company?: string | null
          signed_date?: string | null
          start_date: string
          termination_clauses?: Json | null
          title: string
          total_contract_value?: number | null
          updated_at?: string | null
        }
        Update: {
          airline_id?: string | null
          auto_renewal?: boolean | null
          contract_file_url?: string | null
          contract_number?: string
          contract_status?: Database["public"]["Enums"]["contract_status_enum"]
          contract_type?: Database["public"]["Enums"]["contract_type_enum"]
          created_at?: string | null
          currency?: string
          description?: string | null
          end_date?: string
          escalation_procedures?: Json | null
          id?: string
          payment_terms?: Json
          penalties_and_incentives?: Json | null
          renewal_notice_days?: number | null
          service_level_agreements?: Json | null
          signed_by_airline?: string | null
          signed_by_company?: string | null
          signed_date?: string | null
          start_date?: string
          termination_clauses?: Json | null
          title?: string
          total_contract_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_airline_id_fkey"
            columns: ["airline_id"]
            isOneToOne: false
            referencedRelation: "airlines"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_centers: {
        Row: {
          active: boolean | null
          actual_costs: number | null
          approval_limits: Json | null
          budget_allocated: number | null
          budget_remaining: number | null
          code: string
          cost_allocation_rules: Json | null
          created_at: string | null
          description: string | null
          forecasted_costs: number | null
          id: string
          name: string
          parent_cost_center_id: string | null
          type: Database["public"]["Enums"]["cost_center_type_enum"]
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          actual_costs?: number | null
          approval_limits?: Json | null
          budget_allocated?: number | null
          budget_remaining?: number | null
          code: string
          cost_allocation_rules?: Json | null
          created_at?: string | null
          description?: string | null
          forecasted_costs?: number | null
          id?: string
          name: string
          parent_cost_center_id?: string | null
          type: Database["public"]["Enums"]["cost_center_type_enum"]
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          actual_costs?: number | null
          approval_limits?: Json | null
          budget_allocated?: number | null
          budget_remaining?: number | null
          code?: string
          cost_allocation_rules?: Json | null
          created_at?: string | null
          description?: string | null
          forecasted_costs?: number | null
          id?: string
          name?: string
          parent_cost_center_id?: string | null
          type?: Database["public"]["Enums"]["cost_center_type_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cost_centers_parent_cost_center_id_fkey"
            columns: ["parent_cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_transactions: {
        Row: {
          allocation_rules: Json | null
          amount: number
          category: string
          cost_center_id: string | null
          created_at: string | null
          currency: string
          description: string
          gl_account: string | null
          id: string
          reference_number: string | null
          tax_amount: number | null
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["cost_transaction_type_enum"]
          vendor: string | null
        }
        Insert: {
          allocation_rules?: Json | null
          amount: number
          category: string
          cost_center_id?: string | null
          created_at?: string | null
          currency?: string
          description: string
          gl_account?: string | null
          id?: string
          reference_number?: string | null
          tax_amount?: number | null
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["cost_transaction_type_enum"]
          vendor?: string | null
        }
        Update: {
          allocation_rules?: Json | null
          amount?: number
          category?: string
          cost_center_id?: string | null
          created_at?: string | null
          currency?: string
          description?: string
          gl_account?: string | null
          id?: string
          reference_number?: string | null
          tax_amount?: number | null
          transaction_date?: string
          transaction_type?: Database["public"]["Enums"]["cost_transaction_type_enum"]
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cost_transactions_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      crisis_management_plans: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          business_continuity_plan: Json
          communication_plan: Json
          created_at: string | null
          description: string | null
          effective_date: string
          evacuation_procedures: Json | null
          id: string
          last_updated: string | null
          legal_considerations: Json | null
          media_management: Json | null
          plan_name: string
          plan_type: Database["public"]["Enums"]["crisis_type_enum"]
          recovery_procedures: Json | null
          resource_requirements: Json | null
          response_structure: Json
          review_date: string
          stakeholder_notifications: Json | null
          status: Database["public"]["Enums"]["plan_status_enum"]
          trigger_conditions: Json
          version: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          business_continuity_plan?: Json
          communication_plan?: Json
          created_at?: string | null
          description?: string | null
          effective_date: string
          evacuation_procedures?: Json | null
          id?: string
          last_updated?: string | null
          legal_considerations?: Json | null
          media_management?: Json | null
          plan_name: string
          plan_type: Database["public"]["Enums"]["crisis_type_enum"]
          recovery_procedures?: Json | null
          resource_requirements?: Json | null
          response_structure?: Json
          review_date: string
          stakeholder_notifications?: Json | null
          status?: Database["public"]["Enums"]["plan_status_enum"]
          trigger_conditions?: Json
          version?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          business_continuity_plan?: Json
          communication_plan?: Json
          created_at?: string | null
          description?: string | null
          effective_date?: string
          evacuation_procedures?: Json | null
          id?: string
          last_updated?: string | null
          legal_considerations?: Json | null
          media_management?: Json | null
          plan_name?: string
          plan_type?: Database["public"]["Enums"]["crisis_type_enum"]
          recovery_procedures?: Json | null
          resource_requirements?: Json | null
          response_structure?: Json
          review_date?: string
          stakeholder_notifications?: Json | null
          status?: Database["public"]["Enums"]["plan_status_enum"]
          trigger_conditions?: Json
          version?: string
        }
        Relationships: []
      }
      data_science_experiments: {
        Row: {
          approved_for_production: boolean | null
          business_impact_estimate: number | null
          conclusions: string | null
          created_at: string | null
          dataset_description: string | null
          effect_size: number | null
          end_date: string | null
          evaluation_metrics: Json
          experiment_name: string
          experiment_parameters: Json | null
          experiment_status: Database["public"]["Enums"]["experiment_status_enum"]
          experiment_type: Database["public"]["Enums"]["experiment_type_enum"]
          feature_selection_method: string | null
          hypothesis: string
          id: string
          methodology: string
          model_selection_criteria: string | null
          recommendations: string | null
          results: Json | null
          reviewed_by: string | null
          start_date: string
          started_by: string
          statistical_significance: number | null
          updated_at: string | null
        }
        Insert: {
          approved_for_production?: boolean | null
          business_impact_estimate?: number | null
          conclusions?: string | null
          created_at?: string | null
          dataset_description?: string | null
          effect_size?: number | null
          end_date?: string | null
          evaluation_metrics?: Json
          experiment_name: string
          experiment_parameters?: Json | null
          experiment_status?: Database["public"]["Enums"]["experiment_status_enum"]
          experiment_type: Database["public"]["Enums"]["experiment_type_enum"]
          feature_selection_method?: string | null
          hypothesis: string
          id?: string
          methodology: string
          model_selection_criteria?: string | null
          recommendations?: string | null
          results?: Json | null
          reviewed_by?: string | null
          start_date: string
          started_by: string
          statistical_significance?: number | null
          updated_at?: string | null
        }
        Update: {
          approved_for_production?: boolean | null
          business_impact_estimate?: number | null
          conclusions?: string | null
          created_at?: string | null
          dataset_description?: string | null
          effect_size?: number | null
          end_date?: string | null
          evaluation_metrics?: Json
          experiment_name?: string
          experiment_parameters?: Json | null
          experiment_status?: Database["public"]["Enums"]["experiment_status_enum"]
          experiment_type?: Database["public"]["Enums"]["experiment_type_enum"]
          feature_selection_method?: string | null
          hypothesis?: string
          id?: string
          methodology?: string
          model_selection_criteria?: string | null
          recommendations?: string | null
          results?: Json | null
          reviewed_by?: string | null
          start_date?: string
          started_by?: string
          statistical_significance?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      emergency_actions: {
        Row: {
          action_type: Database["public"]["Enums"]["action_type_enum"]
          actual_duration: number | null
          assigned_at: string | null
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          completion_criteria: string | null
          created_at: string | null
          description: string
          estimated_duration: number | null
          id: string
          incident_id: string | null
          instructions: string | null
          priority: Database["public"]["Enums"]["action_priority_enum"]
          required_resources: Json | null
          safety_considerations: string | null
          status: Database["public"]["Enums"]["action_status_enum"]
          verification_required: boolean | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          action_type: Database["public"]["Enums"]["action_type_enum"]
          actual_duration?: number | null
          assigned_at?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_criteria?: string | null
          created_at?: string | null
          description: string
          estimated_duration?: number | null
          id?: string
          incident_id?: string | null
          instructions?: string | null
          priority?: Database["public"]["Enums"]["action_priority_enum"]
          required_resources?: Json | null
          safety_considerations?: string | null
          status?: Database["public"]["Enums"]["action_status_enum"]
          verification_required?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["action_type_enum"]
          actual_duration?: number | null
          assigned_at?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completion_criteria?: string | null
          created_at?: string | null
          description?: string
          estimated_duration?: number | null
          id?: string
          incident_id?: string | null
          instructions?: string | null
          priority?: Database["public"]["Enums"]["action_priority_enum"]
          required_resources?: Json | null
          safety_considerations?: string | null
          status?: Database["public"]["Enums"]["action_status_enum"]
          verification_required?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_actions_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "emergency_incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_communications: {
        Row: {
          acknowledgment_required: boolean | null
          acknowledgments: Json | null
          communication_type: Database["public"]["Enums"]["communication_type_enum"]
          confidentiality_level: Database["public"]["Enums"]["confidentiality_enum"]
          created_at: string | null
          delivery_method: Database["public"]["Enums"]["delivery_method_enum"][]
          delivery_status: Json | null
          expiration_time: string | null
          external_agencies: Json | null
          id: string
          incident_id: string | null
          media_release: boolean | null
          message: string
          priority: Database["public"]["Enums"]["message_priority_enum"]
          recipients: Json
          sender: string
          sent_at: string
          subject: string | null
        }
        Insert: {
          acknowledgment_required?: boolean | null
          acknowledgments?: Json | null
          communication_type: Database["public"]["Enums"]["communication_type_enum"]
          confidentiality_level?: Database["public"]["Enums"]["confidentiality_enum"]
          created_at?: string | null
          delivery_method: Database["public"]["Enums"]["delivery_method_enum"][]
          delivery_status?: Json | null
          expiration_time?: string | null
          external_agencies?: Json | null
          id?: string
          incident_id?: string | null
          media_release?: boolean | null
          message: string
          priority?: Database["public"]["Enums"]["message_priority_enum"]
          recipients?: Json
          sender: string
          sent_at?: string
          subject?: string | null
        }
        Update: {
          acknowledgment_required?: boolean | null
          acknowledgments?: Json | null
          communication_type?: Database["public"]["Enums"]["communication_type_enum"]
          confidentiality_level?: Database["public"]["Enums"]["confidentiality_enum"]
          created_at?: string | null
          delivery_method?: Database["public"]["Enums"]["delivery_method_enum"][]
          delivery_status?: Json | null
          expiration_time?: string | null
          external_agencies?: Json | null
          id?: string
          incident_id?: string | null
          media_release?: boolean | null
          message?: string
          priority?: Database["public"]["Enums"]["message_priority_enum"]
          recipients?: Json
          sender?: string
          sent_at?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_communications_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "emergency_incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_incidents: {
        Row: {
          affected_areas: string[] | null
          affected_flights: string[] | null
          affected_passengers: number | null
          affected_personnel: number | null
          created_at: string | null
          description: string
          escalation_level: Database["public"]["Enums"]["escalation_level_enum"]
          id: string
          incident_commander: string | null
          incident_number: string
          incident_type: Database["public"]["Enums"]["incident_type_enum"]
          initial_response_time: string | null
          location_description: string | null
          location_lat: number | null
          location_lng: number | null
          reported_at: string
          reported_by: string
          resolved_at: string | null
          severity: Database["public"]["Enums"]["emergency_severity_enum"]
          status: Database["public"]["Enums"]["incident_status_enum"]
          unified_command: boolean | null
          updated_at: string | null
        }
        Insert: {
          affected_areas?: string[] | null
          affected_flights?: string[] | null
          affected_passengers?: number | null
          affected_personnel?: number | null
          created_at?: string | null
          description: string
          escalation_level?: Database["public"]["Enums"]["escalation_level_enum"]
          id?: string
          incident_commander?: string | null
          incident_number: string
          incident_type: Database["public"]["Enums"]["incident_type_enum"]
          initial_response_time?: string | null
          location_description?: string | null
          location_lat?: number | null
          location_lng?: number | null
          reported_at?: string
          reported_by: string
          resolved_at?: string | null
          severity: Database["public"]["Enums"]["emergency_severity_enum"]
          status?: Database["public"]["Enums"]["incident_status_enum"]
          unified_command?: boolean | null
          updated_at?: string | null
        }
        Update: {
          affected_areas?: string[] | null
          affected_flights?: string[] | null
          affected_passengers?: number | null
          affected_personnel?: number | null
          created_at?: string | null
          description?: string
          escalation_level?: Database["public"]["Enums"]["escalation_level_enum"]
          id?: string
          incident_commander?: string | null
          incident_number?: string
          incident_type?: Database["public"]["Enums"]["incident_type_enum"]
          initial_response_time?: string | null
          location_description?: string | null
          location_lat?: number | null
          location_lng?: number | null
          reported_at?: string
          reported_by?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["emergency_severity_enum"]
          status?: Database["public"]["Enums"]["incident_status_enum"]
          unified_command?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      emergency_resources: {
        Row: {
          available_quantity: number
          capabilities: string[] | null
          certifications: Json | null
          contact_information: Json
          cost_per_hour: number | null
          created_at: string | null
          deployment_time_minutes: number | null
          description: string | null
          expiration_date: string | null
          id: string
          last_inspection: string | null
          limitations: string[] | null
          location: string
          maintenance_schedule: Json | null
          next_inspection: string | null
          quantity: number
          resource_name: string
          resource_type: Database["public"]["Enums"]["resource_type_enum"]
          responsible_person: string | null
          status: Database["public"]["Enums"]["resource_status_enum"]
          storage_conditions: string | null
          updated_at: string | null
        }
        Insert: {
          available_quantity?: number
          capabilities?: string[] | null
          certifications?: Json | null
          contact_information?: Json
          cost_per_hour?: number | null
          created_at?: string | null
          deployment_time_minutes?: number | null
          description?: string | null
          expiration_date?: string | null
          id?: string
          last_inspection?: string | null
          limitations?: string[] | null
          location: string
          maintenance_schedule?: Json | null
          next_inspection?: string | null
          quantity?: number
          resource_name: string
          resource_type: Database["public"]["Enums"]["resource_type_enum"]
          responsible_person?: string | null
          status?: Database["public"]["Enums"]["resource_status_enum"]
          storage_conditions?: string | null
          updated_at?: string | null
        }
        Update: {
          available_quantity?: number
          capabilities?: string[] | null
          certifications?: Json | null
          contact_information?: Json
          cost_per_hour?: number | null
          created_at?: string | null
          deployment_time_minutes?: number | null
          description?: string | null
          expiration_date?: string | null
          id?: string
          last_inspection?: string | null
          limitations?: string[] | null
          location?: string
          maintenance_schedule?: Json | null
          next_inspection?: string | null
          quantity?: number
          resource_name?: string
          resource_type?: Database["public"]["Enums"]["resource_type_enum"]
          responsible_person?: string | null
          status?: Database["public"]["Enums"]["resource_status_enum"]
          storage_conditions?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      emergency_response_teams: {
        Row: {
          activation_time: string
          communications_officer: string | null
          created_at: string | null
          deactivation_time: string | null
          deputy_commander: string | null
          external_agencies: Json | null
          field_personnel: string[] | null
          fire_officer: string | null
          id: string
          incident_commander: string | null
          incident_id: string | null
          logistics_officer: string | null
          medical_officer: string | null
          operations_coordinator: string | null
          response_time_minutes: number | null
          security_officer: string | null
          team_size: number | null
        }
        Insert: {
          activation_time?: string
          communications_officer?: string | null
          created_at?: string | null
          deactivation_time?: string | null
          deputy_commander?: string | null
          external_agencies?: Json | null
          field_personnel?: string[] | null
          fire_officer?: string | null
          id?: string
          incident_commander?: string | null
          incident_id?: string | null
          logistics_officer?: string | null
          medical_officer?: string | null
          operations_coordinator?: string | null
          response_time_minutes?: number | null
          security_officer?: string | null
          team_size?: number | null
        }
        Update: {
          activation_time?: string
          communications_officer?: string | null
          created_at?: string | null
          deactivation_time?: string | null
          deputy_commander?: string | null
          external_agencies?: Json | null
          field_personnel?: string[] | null
          fire_officer?: string | null
          id?: string
          incident_commander?: string | null
          incident_id?: string | null
          logistics_officer?: string | null
          medical_officer?: string | null
          operations_coordinator?: string | null
          response_time_minutes?: number | null
          security_officer?: string | null
          team_size?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_response_teams_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "emergency_incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_training_records: {
        Row: {
          assessment_score: number | null
          certification_number: string | null
          competency_level: Database["public"]["Enums"]["competency_level_enum"]
          created_at: string | null
          employee_email: string
          employee_name: string
          expiration_date: string | null
          id: string
          instructor: string | null
          next_training_date: string | null
          notes: string | null
          practical_assessment: boolean | null
          refresher_required: boolean | null
          status: Database["public"]["Enums"]["training_status_enum"]
          training_date: string
          training_duration_hours: number | null
          training_location: string | null
          training_provider: string | null
          training_title: string
          training_type: Database["public"]["Enums"]["emergency_training_type_enum"]
        }
        Insert: {
          assessment_score?: number | null
          certification_number?: string | null
          competency_level?: Database["public"]["Enums"]["competency_level_enum"]
          created_at?: string | null
          employee_email: string
          employee_name: string
          expiration_date?: string | null
          id?: string
          instructor?: string | null
          next_training_date?: string | null
          notes?: string | null
          practical_assessment?: boolean | null
          refresher_required?: boolean | null
          status?: Database["public"]["Enums"]["training_status_enum"]
          training_date: string
          training_duration_hours?: number | null
          training_location?: string | null
          training_provider?: string | null
          training_title: string
          training_type: Database["public"]["Enums"]["emergency_training_type_enum"]
        }
        Update: {
          assessment_score?: number | null
          certification_number?: string | null
          competency_level?: Database["public"]["Enums"]["competency_level_enum"]
          created_at?: string | null
          employee_email?: string
          employee_name?: string
          expiration_date?: string | null
          id?: string
          instructor?: string | null
          next_training_date?: string | null
          notes?: string | null
          practical_assessment?: boolean | null
          refresher_required?: boolean | null
          status?: Database["public"]["Enums"]["training_status_enum"]
          training_date?: string
          training_duration_hours?: number | null
          training_location?: string | null
          training_provider?: string | null
          training_title?: string
          training_type?: Database["public"]["Enums"]["emergency_training_type_enum"]
        }
        Relationships: []
      }
      evacuation_procedures: {
        Row: {
          accessibility_provisions: Json | null
          assembly_points: Json
          capacity: number
          communication_systems: Json | null
          created_at: string | null
          current_occupancy: number | null
          drill_results: Json | null
          emergency_equipment: Json | null
          evacuation_routes: Json
          evacuation_time_estimate: number | null
          id: string
          last_drill_date: string | null
          next_drill_date: string | null
          responsible_wardens: string[] | null
          special_considerations: string | null
          status: Database["public"]["Enums"]["evacuation_status_enum"]
          updated_at: string | null
          zone_id: string
          zone_name: string
          zone_type: Database["public"]["Enums"]["zone_type_enum"]
        }
        Insert: {
          accessibility_provisions?: Json | null
          assembly_points?: Json
          capacity: number
          communication_systems?: Json | null
          created_at?: string | null
          current_occupancy?: number | null
          drill_results?: Json | null
          emergency_equipment?: Json | null
          evacuation_routes?: Json
          evacuation_time_estimate?: number | null
          id?: string
          last_drill_date?: string | null
          next_drill_date?: string | null
          responsible_wardens?: string[] | null
          special_considerations?: string | null
          status?: Database["public"]["Enums"]["evacuation_status_enum"]
          updated_at?: string | null
          zone_id: string
          zone_name: string
          zone_type: Database["public"]["Enums"]["zone_type_enum"]
        }
        Update: {
          accessibility_provisions?: Json | null
          assembly_points?: Json
          capacity?: number
          communication_systems?: Json | null
          created_at?: string | null
          current_occupancy?: number | null
          drill_results?: Json | null
          emergency_equipment?: Json | null
          evacuation_routes?: Json
          evacuation_time_estimate?: number | null
          id?: string
          last_drill_date?: string | null
          next_drill_date?: string | null
          responsible_wardens?: string[] | null
          special_considerations?: string | null
          status?: Database["public"]["Enums"]["evacuation_status_enum"]
          updated_at?: string | null
          zone_id?: string
          zone_name?: string
          zone_type?: Database["public"]["Enums"]["zone_type_enum"]
        }
        Relationships: []
      }
      financial_kpis: {
        Row: {
          airline_id: string | null
          benchmark_comparison: number | null
          calculation_method: string | null
          cost_center_id: string | null
          created_at: string | null
          data_source: string | null
          department: string | null
          id: string
          kpi_category: Database["public"]["Enums"]["kpi_category_enum"]
          kpi_name: string
          measurement_date: string
          notes: string | null
          target_value: number | null
          trend_direction:
            | Database["public"]["Enums"]["trend_direction_enum"]
            | null
          unit: string | null
          value: number
          variance_percentage: number | null
        }
        Insert: {
          airline_id?: string | null
          benchmark_comparison?: number | null
          calculation_method?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          data_source?: string | null
          department?: string | null
          id?: string
          kpi_category: Database["public"]["Enums"]["kpi_category_enum"]
          kpi_name: string
          measurement_date: string
          notes?: string | null
          target_value?: number | null
          trend_direction?:
            | Database["public"]["Enums"]["trend_direction_enum"]
            | null
          unit?: string | null
          value: number
          variance_percentage?: number | null
        }
        Update: {
          airline_id?: string | null
          benchmark_comparison?: number | null
          calculation_method?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          data_source?: string | null
          department?: string | null
          id?: string
          kpi_category?: Database["public"]["Enums"]["kpi_category_enum"]
          kpi_name?: string
          measurement_date?: string
          notes?: string | null
          target_value?: number | null
          trend_direction?:
            | Database["public"]["Enums"]["trend_direction_enum"]
            | null
          unit?: string | null
          value?: number
          variance_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_kpis_airline_id_fkey"
            columns: ["airline_id"]
            isOneToOne: false
            referencedRelation: "airlines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_kpis_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      intelligent_insights: {
        Row: {
          acted_upon: boolean | null
          actionable_steps: Json | null
          anomalies: Json | null
          business_impact: Database["public"]["Enums"]["impact_level_enum"]
          category: Database["public"]["Enums"]["insight_category_enum"]
          confidence: number
          correlations: Json | null
          cost_benefit_analysis: Json | null
          created_at: string | null
          description: string
          expires_at: string | null
          generated_at: string
          id: string
          insight_type: Database["public"]["Enums"]["insight_type_enum"]
          outcome_tracked: boolean | null
          predicted_outcome: Json | null
          recommendations: Json | null
          risk_assessment: Json | null
          supporting_data: Json
          time_to_impact: number | null
          title: string
          trends: Json | null
          urgency: Database["public"]["Enums"]["urgency_level_enum"]
          viewed_by: string[] | null
        }
        Insert: {
          acted_upon?: boolean | null
          actionable_steps?: Json | null
          anomalies?: Json | null
          business_impact: Database["public"]["Enums"]["impact_level_enum"]
          category: Database["public"]["Enums"]["insight_category_enum"]
          confidence: number
          correlations?: Json | null
          cost_benefit_analysis?: Json | null
          created_at?: string | null
          description: string
          expires_at?: string | null
          generated_at?: string
          id?: string
          insight_type: Database["public"]["Enums"]["insight_type_enum"]
          outcome_tracked?: boolean | null
          predicted_outcome?: Json | null
          recommendations?: Json | null
          risk_assessment?: Json | null
          supporting_data?: Json
          time_to_impact?: number | null
          title: string
          trends?: Json | null
          urgency: Database["public"]["Enums"]["urgency_level_enum"]
          viewed_by?: string[] | null
        }
        Update: {
          acted_upon?: boolean | null
          actionable_steps?: Json | null
          anomalies?: Json | null
          business_impact?: Database["public"]["Enums"]["impact_level_enum"]
          category?: Database["public"]["Enums"]["insight_category_enum"]
          confidence?: number
          correlations?: Json | null
          cost_benefit_analysis?: Json | null
          created_at?: string | null
          description?: string
          expires_at?: string | null
          generated_at?: string
          id?: string
          insight_type?: Database["public"]["Enums"]["insight_type_enum"]
          outcome_tracked?: boolean | null
          predicted_outcome?: Json | null
          recommendations?: Json | null
          risk_assessment?: Json | null
          supporting_data?: Json
          time_to_impact?: number | null
          title?: string
          trends?: Json | null
          urgency?: Database["public"]["Enums"]["urgency_level_enum"]
          viewed_by?: string[] | null
        }
        Relationships: []
      }
      invoice_line_items: {
        Row: {
          billing_date: string
          cost_center: string | null
          created_at: string | null
          description: string
          discount_rate: number | null
          gl_account: string | null
          id: string
          invoice_id: string | null
          line_total: number
          quantity: number
          reference_data: Json | null
          service_date: string
          service_type: Database["public"]["Enums"]["service_type_enum"]
          tax_rate: number | null
          unit: Database["public"]["Enums"]["rate_unit_enum"]
          unit_rate: number
        }
        Insert: {
          billing_date: string
          cost_center?: string | null
          created_at?: string | null
          description: string
          discount_rate?: number | null
          gl_account?: string | null
          id?: string
          invoice_id?: string | null
          line_total: number
          quantity: number
          reference_data?: Json | null
          service_date: string
          service_type: Database["public"]["Enums"]["service_type_enum"]
          tax_rate?: number | null
          unit: Database["public"]["Enums"]["rate_unit_enum"]
          unit_rate: number
        }
        Update: {
          billing_date?: string
          cost_center?: string | null
          created_at?: string | null
          description?: string
          discount_rate?: number | null
          gl_account?: string | null
          id?: string
          invoice_id?: string | null
          line_total?: number
          quantity?: number
          reference_data?: Json | null
          service_date?: string
          service_type?: Database["public"]["Enums"]["service_type_enum"]
          tax_rate?: number | null
          unit?: Database["public"]["Enums"]["rate_unit_enum"]
          unit_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          airline_id: string | null
          billing_period_end: string
          billing_period_start: string
          created_at: string | null
          currency: string
          discount_amount: number | null
          dispute_reason: string | null
          dispute_status:
            | Database["public"]["Enums"]["dispute_status_enum"]
            | null
          due_date: string
          exchange_rate: number | null
          id: string
          invoice_number: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_terms: string | null
          status: Database["public"]["Enums"]["invoice_status_enum"]
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          airline_id?: string | null
          billing_period_end: string
          billing_period_start: string
          created_at?: string | null
          currency?: string
          discount_amount?: number | null
          dispute_reason?: string | null
          dispute_status?:
            | Database["public"]["Enums"]["dispute_status_enum"]
            | null
          due_date: string
          exchange_rate?: number | null
          id?: string
          invoice_number: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_terms?: string | null
          status?: Database["public"]["Enums"]["invoice_status_enum"]
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          airline_id?: string | null
          billing_period_end?: string
          billing_period_start?: string
          created_at?: string | null
          currency?: string
          discount_amount?: number | null
          dispute_reason?: string | null
          dispute_status?:
            | Database["public"]["Enums"]["dispute_status_enum"]
            | null
          due_date?: string
          exchange_rate?: number | null
          id?: string
          invoice_number?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_terms?: string | null
          status?: Database["public"]["Enums"]["invoice_status_enum"]
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_airline_id_fkey"
            columns: ["airline_id"]
            isOneToOne: false
            referencedRelation: "airlines"
            referencedColumns: ["id"]
          },
        ]
      }
      market_intelligence: {
        Row: {
          analysis_confidence: number | null
          competitive_positioning: Json | null
          created_at: string | null
          created_by: string
          customer_segments: Json | null
          data_sources: string[]
          geographic_scope: string | null
          growth_rate: number | null
          id: string
          intelligence_type: Database["public"]["Enums"]["market_intelligence_type_enum"]
          market_data: Json
          market_segment: string
          market_share: number | null
          market_size_estimate: number | null
          opportunities: Json | null
          pricing_analysis: Json | null
          regulatory_environment: Json | null
          strategic_recommendations: string | null
          technology_trends: Json | null
          threats: Json | null
          time_period_end: string
          time_period_start: string
          trends: Json | null
        }
        Insert: {
          analysis_confidence?: number | null
          competitive_positioning?: Json | null
          created_at?: string | null
          created_by: string
          customer_segments?: Json | null
          data_sources?: string[]
          geographic_scope?: string | null
          growth_rate?: number | null
          id?: string
          intelligence_type: Database["public"]["Enums"]["market_intelligence_type_enum"]
          market_data?: Json
          market_segment: string
          market_share?: number | null
          market_size_estimate?: number | null
          opportunities?: Json | null
          pricing_analysis?: Json | null
          regulatory_environment?: Json | null
          strategic_recommendations?: string | null
          technology_trends?: Json | null
          threats?: Json | null
          time_period_end: string
          time_period_start: string
          trends?: Json | null
        }
        Update: {
          analysis_confidence?: number | null
          competitive_positioning?: Json | null
          created_at?: string | null
          created_by?: string
          customer_segments?: Json | null
          data_sources?: string[]
          geographic_scope?: string | null
          growth_rate?: number | null
          id?: string
          intelligence_type?: Database["public"]["Enums"]["market_intelligence_type_enum"]
          market_data?: Json
          market_segment?: string
          market_share?: number | null
          market_size_estimate?: number | null
          opportunities?: Json | null
          pricing_analysis?: Json | null
          regulatory_environment?: Json | null
          strategic_recommendations?: string | null
          technology_trends?: Json | null
          threats?: Json | null
          time_period_end?: string
          time_period_start?: string
          trends?: Json | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
          team_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
          team_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_models: {
        Row: {
          algorithm: string
          business_impact: Database["public"]["Enums"]["business_impact_enum"]
          confidence_threshold: number | null
          created_at: string | null
          created_by: string
          deployment_status: Database["public"]["Enums"]["deployment_status_enum"]
          features: Json
          hyperparameters: Json | null
          id: string
          is_active: boolean | null
          last_trained: string | null
          model_artifact_path: string | null
          model_name: string
          model_performance: Json
          model_type: Database["public"]["Enums"]["ml_model_type_enum"]
          model_version: string
          next_retraining: string | null
          prediction_horizon: number | null
          target_variable: string
          test_dataset_id: string | null
          training_dataset_id: string | null
          update_frequency: Database["public"]["Enums"]["update_frequency_enum"]
          updated_at: string | null
          validation_dataset_id: string | null
        }
        Insert: {
          algorithm: string
          business_impact?: Database["public"]["Enums"]["business_impact_enum"]
          confidence_threshold?: number | null
          created_at?: string | null
          created_by: string
          deployment_status?: Database["public"]["Enums"]["deployment_status_enum"]
          features?: Json
          hyperparameters?: Json | null
          id?: string
          is_active?: boolean | null
          last_trained?: string | null
          model_artifact_path?: string | null
          model_name: string
          model_performance?: Json
          model_type: Database["public"]["Enums"]["ml_model_type_enum"]
          model_version?: string
          next_retraining?: string | null
          prediction_horizon?: number | null
          target_variable: string
          test_dataset_id?: string | null
          training_dataset_id?: string | null
          update_frequency?: Database["public"]["Enums"]["update_frequency_enum"]
          updated_at?: string | null
          validation_dataset_id?: string | null
        }
        Update: {
          algorithm?: string
          business_impact?: Database["public"]["Enums"]["business_impact_enum"]
          confidence_threshold?: number | null
          created_at?: string | null
          created_by?: string
          deployment_status?: Database["public"]["Enums"]["deployment_status_enum"]
          features?: Json
          hyperparameters?: Json | null
          id?: string
          is_active?: boolean | null
          last_trained?: string | null
          model_artifact_path?: string | null
          model_name?: string
          model_performance?: Json
          model_type?: Database["public"]["Enums"]["ml_model_type_enum"]
          model_version?: string
          next_retraining?: string | null
          prediction_horizon?: number | null
          target_variable?: string
          test_dataset_id?: string | null
          training_dataset_id?: string | null
          update_frequency?: Database["public"]["Enums"]["update_frequency_enum"]
          updated_at?: string | null
          validation_dataset_id?: string | null
        }
        Relationships: []
      }
      optimization_problems: {
        Row: {
          business_value: number | null
          constraints: Json
          created_at: string | null
          created_by: string
          data_sources: Json
          id: string
          implementation_status: Database["public"]["Enums"]["implementation_status_enum"]
          last_solved: string | null
          objective_function: string
          objective_value: number | null
          optimization_algorithm: string
          optimization_time_seconds: number | null
          problem_name: string
          problem_type: Database["public"]["Enums"]["optimization_type_enum"]
          solution: Json | null
          solution_quality: number | null
          solve_frequency: Database["public"]["Enums"]["solve_frequency_enum"]
          solver_configuration: Json | null
          updated_at: string | null
          variables: Json
        }
        Insert: {
          business_value?: number | null
          constraints?: Json
          created_at?: string | null
          created_by: string
          data_sources?: Json
          id?: string
          implementation_status?: Database["public"]["Enums"]["implementation_status_enum"]
          last_solved?: string | null
          objective_function: string
          objective_value?: number | null
          optimization_algorithm: string
          optimization_time_seconds?: number | null
          problem_name: string
          problem_type: Database["public"]["Enums"]["optimization_type_enum"]
          solution?: Json | null
          solution_quality?: number | null
          solve_frequency?: Database["public"]["Enums"]["solve_frequency_enum"]
          solver_configuration?: Json | null
          updated_at?: string | null
          variables?: Json
        }
        Update: {
          business_value?: number | null
          constraints?: Json
          created_at?: string | null
          created_by?: string
          data_sources?: Json
          id?: string
          implementation_status?: Database["public"]["Enums"]["implementation_status_enum"]
          last_solved?: string | null
          objective_function?: string
          objective_value?: number | null
          optimization_algorithm?: string
          optimization_time_seconds?: number | null
          problem_name?: string
          problem_type?: Database["public"]["Enums"]["optimization_type_enum"]
          solution?: Json | null
          solution_quality?: number | null
          solve_frequency?: Database["public"]["Enums"]["solve_frequency_enum"]
          solver_configuration?: Json | null
          updated_at?: string | null
          variables?: Json
        }
        Relationships: []
      }
      optimization_results: {
        Row: {
          actual_benefits: Json | null
          business_metrics: Json | null
          constraints_satisfied: boolean
          created_at: string | null
          execution_time_seconds: number
          execution_timestamp: string
          expected_benefits: Json | null
          gap_percentage: number | null
          id: string
          implementation_plan: Json | null
          implementation_status: Database["public"]["Enums"]["implementation_status_enum"]
          input_data: Json
          iterations: number | null
          memory_usage_mb: number | null
          objective_value: number
          optimization_problem_id: string | null
          solution_quality: number | null
          solution_variables: Json
          solver_status: string
        }
        Insert: {
          actual_benefits?: Json | null
          business_metrics?: Json | null
          constraints_satisfied?: boolean
          created_at?: string | null
          execution_time_seconds: number
          execution_timestamp?: string
          expected_benefits?: Json | null
          gap_percentage?: number | null
          id?: string
          implementation_plan?: Json | null
          implementation_status?: Database["public"]["Enums"]["implementation_status_enum"]
          input_data?: Json
          iterations?: number | null
          memory_usage_mb?: number | null
          objective_value: number
          optimization_problem_id?: string | null
          solution_quality?: number | null
          solution_variables?: Json
          solver_status: string
        }
        Update: {
          actual_benefits?: Json | null
          business_metrics?: Json | null
          constraints_satisfied?: boolean
          created_at?: string | null
          execution_time_seconds?: number
          execution_timestamp?: string
          expected_benefits?: Json | null
          gap_percentage?: number | null
          id?: string
          implementation_plan?: Json | null
          implementation_status?: Database["public"]["Enums"]["implementation_status_enum"]
          input_data?: Json
          iterations?: number | null
          memory_usage_mb?: number | null
          objective_value?: number
          optimization_problem_id?: string | null
          solution_quality?: number | null
          solution_variables?: Json
          solver_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "optimization_results_optimization_problem_id_fkey"
            columns: ["optimization_problem_id"]
            isOneToOne: false
            referencedRelation: "optimization_problems"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          bank_account: string | null
          created_at: string | null
          currency: string
          exchange_rate: number | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method_enum"]
          payment_processor: string | null
          reconciled_date: string | null
          reconciliation_status: Database["public"]["Enums"]["reconciliation_status_enum"]
          reference_number: string | null
          status: Database["public"]["Enums"]["payment_status_enum"]
          transaction_fee: number | null
        }
        Insert: {
          amount: number
          bank_account?: string | null
          created_at?: string | null
          currency?: string
          exchange_rate?: number | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method_enum"]
          payment_processor?: string | null
          reconciled_date?: string | null
          reconciliation_status?: Database["public"]["Enums"]["reconciliation_status_enum"]
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status_enum"]
          transaction_fee?: number | null
        }
        Update: {
          amount?: number
          bank_account?: string | null
          created_at?: string | null
          currency?: string
          exchange_rate?: number | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method_enum"]
          payment_processor?: string | null
          reconciled_date?: string | null
          reconciliation_status?: Database["public"]["Enums"]["reconciliation_status_enum"]
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status_enum"]
          transaction_fee?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          accuracy_score: number | null
          actual_value: number | null
          business_action_taken: boolean | null
          confidence_score: number
          created_at: string | null
          feature_values: Json
          id: string
          impact_measured: boolean | null
          model_id: string | null
          predicted_value: number
          prediction_error: number | null
          prediction_explanation: Json | null
          prediction_horizon: number
          prediction_interval_lower: number | null
          prediction_interval_upper: number | null
          prediction_timestamp: string
          target_entity: string | null
        }
        Insert: {
          accuracy_score?: number | null
          actual_value?: number | null
          business_action_taken?: boolean | null
          confidence_score: number
          created_at?: string | null
          feature_values?: Json
          id?: string
          impact_measured?: boolean | null
          model_id?: string | null
          predicted_value: number
          prediction_error?: number | null
          prediction_explanation?: Json | null
          prediction_horizon: number
          prediction_interval_lower?: number | null
          prediction_interval_upper?: number | null
          prediction_timestamp?: string
          target_entity?: string | null
        }
        Update: {
          accuracy_score?: number | null
          actual_value?: number | null
          business_action_taken?: boolean | null
          confidence_score?: number
          created_at?: string | null
          feature_values?: Json
          id?: string
          impact_measured?: boolean | null
          model_id?: string | null
          predicted_value?: number
          prediction_error?: number | null
          prediction_explanation?: Json | null
          prediction_horizon?: number
          prediction_interval_lower?: number | null
          prediction_interval_upper?: number | null
          prediction_timestamp?: string
          target_entity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ml_models"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_notes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string
          id: string
          project_id: string
          team_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by: string
          id?: string
          project_id: string
          team_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string
          id?: string
          project_id?: string
          team_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_notes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          assigned_members: string[] | null
          color: string | null
          created_at: string | null
          created_by: string
          deadline: string | null
          description: string | null
          id: string
          priority: string | null
          progress: number | null
          shared_with: string[] | null
          start_date: string | null
          status: string | null
          team_id: string | null
          team_size: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_members?: string[] | null
          color?: string | null
          created_at?: string | null
          created_by: string
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          progress?: number | null
          shared_with?: string[] | null
          start_date?: string | null
          status?: string | null
          team_id?: string | null
          team_size?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_members?: string[] | null
          color?: string | null
          created_at?: string | null
          created_by?: string
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          progress?: number | null
          shared_with?: string[] | null
          start_date?: string | null
          status?: string | null
          team_id?: string | null
          team_size?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_cards: {
        Row: {
          airline_id: string | null
          created_at: string | null
          currency: string
          effective_from: string
          effective_to: string | null
          escalation_clauses: Json | null
          id: string
          name: string
          payment_terms: Json
          penalty_rates: Json | null
          performance_incentives: Json | null
          special_conditions: Json | null
          status: Database["public"]["Enums"]["rate_card_status_enum"]
          updated_at: string | null
          volume_discounts: Json | null
        }
        Insert: {
          airline_id?: string | null
          created_at?: string | null
          currency?: string
          effective_from: string
          effective_to?: string | null
          escalation_clauses?: Json | null
          id?: string
          name: string
          payment_terms?: Json
          penalty_rates?: Json | null
          performance_incentives?: Json | null
          special_conditions?: Json | null
          status?: Database["public"]["Enums"]["rate_card_status_enum"]
          updated_at?: string | null
          volume_discounts?: Json | null
        }
        Update: {
          airline_id?: string | null
          created_at?: string | null
          currency?: string
          effective_from?: string
          effective_to?: string | null
          escalation_clauses?: Json | null
          id?: string
          name?: string
          payment_terms?: Json
          penalty_rates?: Json | null
          performance_incentives?: Json | null
          special_conditions?: Json | null
          status?: Database["public"]["Enums"]["rate_card_status_enum"]
          updated_at?: string | null
          volume_discounts?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "rate_cards_airline_id_fkey"
            columns: ["airline_id"]
            isOneToOne: false
            referencedRelation: "airlines"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_recognition: {
        Row: {
          accounting_period: string | null
          created_at: string | null
          deferred_revenue: number | null
          gl_account_deferred: string | null
          gl_account_revenue: string | null
          id: string
          invoice_line_item_id: string | null
          monthly_recognition_amount: number | null
          recognition_end_date: string | null
          recognition_method: Database["public"]["Enums"]["revenue_recognition_method_enum"]
          recognition_percentage: number | null
          recognition_start_date: string
          recognized_revenue: number | null
          total_revenue: number
          updated_at: string | null
        }
        Insert: {
          accounting_period?: string | null
          created_at?: string | null
          deferred_revenue?: number | null
          gl_account_deferred?: string | null
          gl_account_revenue?: string | null
          id?: string
          invoice_line_item_id?: string | null
          monthly_recognition_amount?: number | null
          recognition_end_date?: string | null
          recognition_method: Database["public"]["Enums"]["revenue_recognition_method_enum"]
          recognition_percentage?: number | null
          recognition_start_date: string
          recognized_revenue?: number | null
          total_revenue: number
          updated_at?: string | null
        }
        Update: {
          accounting_period?: string | null
          created_at?: string | null
          deferred_revenue?: number | null
          gl_account_deferred?: string | null
          gl_account_revenue?: string | null
          id?: string
          invoice_line_item_id?: string | null
          monthly_recognition_amount?: number | null
          recognition_end_date?: string | null
          recognition_method?: Database["public"]["Enums"]["revenue_recognition_method_enum"]
          recognition_percentage?: number | null
          recognition_start_date?: string
          recognized_revenue?: number | null
          total_revenue?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_recognition_invoice_line_item_id_fkey"
            columns: ["invoice_line_item_id"]
            isOneToOne: false
            referencedRelation: "invoice_line_items"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_assessments: {
        Row: {
          business_impact_analysis: Json | null
          contingency_plans: Json | null
          created_at: string | null
          created_by: string
          current_controls: Json | null
          id: string
          identified_date: string
          impact: Database["public"]["Enums"]["risk_impact_enum"]
          last_review_date: string | null
          likelihood: Database["public"]["Enums"]["risk_likelihood_enum"]
          mitigation_strategies: Json | null
          monitoring_requirements: Json | null
          next_review_date: string
          related_incidents: string[] | null
          responsible_party: string | null
          risk_appetite:
            | Database["public"]["Enums"]["risk_appetite_enum"]
            | null
          risk_category: Database["public"]["Enums"]["risk_category_enum"]
          risk_description: string
          risk_owner: string | null
          risk_score: number
          risk_subcategory: string | null
          status: Database["public"]["Enums"]["risk_status_enum"]
          updated_at: string | null
        }
        Insert: {
          business_impact_analysis?: Json | null
          contingency_plans?: Json | null
          created_at?: string | null
          created_by: string
          current_controls?: Json | null
          id?: string
          identified_date?: string
          impact: Database["public"]["Enums"]["risk_impact_enum"]
          last_review_date?: string | null
          likelihood: Database["public"]["Enums"]["risk_likelihood_enum"]
          mitigation_strategies?: Json | null
          monitoring_requirements?: Json | null
          next_review_date: string
          related_incidents?: string[] | null
          responsible_party?: string | null
          risk_appetite?:
            | Database["public"]["Enums"]["risk_appetite_enum"]
            | null
          risk_category: Database["public"]["Enums"]["risk_category_enum"]
          risk_description: string
          risk_owner?: string | null
          risk_score: number
          risk_subcategory?: string | null
          status?: Database["public"]["Enums"]["risk_status_enum"]
          updated_at?: string | null
        }
        Update: {
          business_impact_analysis?: Json | null
          contingency_plans?: Json | null
          created_at?: string | null
          created_by?: string
          current_controls?: Json | null
          id?: string
          identified_date?: string
          impact?: Database["public"]["Enums"]["risk_impact_enum"]
          last_review_date?: string | null
          likelihood?: Database["public"]["Enums"]["risk_likelihood_enum"]
          mitigation_strategies?: Json | null
          monitoring_requirements?: Json | null
          next_review_date?: string
          related_incidents?: string[] | null
          responsible_party?: string | null
          risk_appetite?:
            | Database["public"]["Enums"]["risk_appetite_enum"]
            | null
          risk_category?: Database["public"]["Enums"]["risk_category_enum"]
          risk_description?: string
          risk_owner?: string | null
          risk_score?: number
          risk_subcategory?: string | null
          status?: Database["public"]["Enums"]["risk_status_enum"]
          updated_at?: string | null
        }
        Relationships: []
      }
      safety_observations: {
        Row: {
          area_type: Database["public"]["Enums"]["area_type_enum"]
          assigned_to: string | null
          closed_at: string | null
          closed_by: string | null
          corrective_actions: Json | null
          created_at: string | null
          description: string
          equipment_involved: string | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          immediate_action_taken: string | null
          location: string
          observation_date: string
          observation_type: Database["public"]["Enums"]["safety_observation_type_enum"]
          observer: string
          photos: string[] | null
          potential_consequences: string | null
          risk_level: Database["public"]["Enums"]["risk_level_enum"]
          status: Database["public"]["Enums"]["observation_status_enum"]
          weather_conditions: string | null
          witnesses: string[] | null
        }
        Insert: {
          area_type: Database["public"]["Enums"]["area_type_enum"]
          assigned_to?: string | null
          closed_at?: string | null
          closed_by?: string | null
          corrective_actions?: Json | null
          created_at?: string | null
          description: string
          equipment_involved?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          immediate_action_taken?: string | null
          location: string
          observation_date?: string
          observation_type: Database["public"]["Enums"]["safety_observation_type_enum"]
          observer: string
          photos?: string[] | null
          potential_consequences?: string | null
          risk_level: Database["public"]["Enums"]["risk_level_enum"]
          status?: Database["public"]["Enums"]["observation_status_enum"]
          weather_conditions?: string | null
          witnesses?: string[] | null
        }
        Update: {
          area_type?: Database["public"]["Enums"]["area_type_enum"]
          assigned_to?: string | null
          closed_at?: string | null
          closed_by?: string | null
          corrective_actions?: Json | null
          created_at?: string | null
          description?: string
          equipment_involved?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          immediate_action_taken?: string | null
          location?: string
          observation_date?: string
          observation_type?: Database["public"]["Enums"]["safety_observation_type_enum"]
          observer?: string
          photos?: string[] | null
          potential_consequences?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level_enum"]
          status?: Database["public"]["Enums"]["observation_status_enum"]
          weather_conditions?: string | null
          witnesses?: string[] | null
        }
        Relationships: []
      }
      service_rates: {
        Row: {
          base_rate: number
          complexity_multipliers: Json | null
          created_at: string | null
          effective_from: string
          effective_to: string | null
          id: string
          maximum_charge: number | null
          minimum_charge: number | null
          rate_card_id: string | null
          rate_type: Database["public"]["Enums"]["rate_type_enum"]
          seasonal_modifiers: Json | null
          service_type: Database["public"]["Enums"]["service_type_enum"]
          tier_breakpoints: Json | null
          time_modifiers: Json | null
          unit: Database["public"]["Enums"]["rate_unit_enum"]
        }
        Insert: {
          base_rate: number
          complexity_multipliers?: Json | null
          created_at?: string | null
          effective_from: string
          effective_to?: string | null
          id?: string
          maximum_charge?: number | null
          minimum_charge?: number | null
          rate_card_id?: string | null
          rate_type: Database["public"]["Enums"]["rate_type_enum"]
          seasonal_modifiers?: Json | null
          service_type: Database["public"]["Enums"]["service_type_enum"]
          tier_breakpoints?: Json | null
          time_modifiers?: Json | null
          unit: Database["public"]["Enums"]["rate_unit_enum"]
        }
        Update: {
          base_rate?: number
          complexity_multipliers?: Json | null
          created_at?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          maximum_charge?: number | null
          minimum_charge?: number | null
          rate_card_id?: string | null
          rate_type?: Database["public"]["Enums"]["rate_type_enum"]
          seasonal_modifiers?: Json | null
          service_type?: Database["public"]["Enums"]["service_type_enum"]
          tier_breakpoints?: Json | null
          time_modifiers?: Json | null
          unit?: Database["public"]["Enums"]["rate_unit_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "service_rates_rate_card_id_fkey"
            columns: ["rate_card_id"]
            isOneToOne: false
            referencedRelation: "rate_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          date: string
          end_time: string
          id: string
          notes: string | null
          shift_type: string | null
          start_time: string
          status: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          date: string
          end_time: string
          id?: string
          notes?: string | null
          shift_type?: string | null
          start_time: string
          status?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          date?: string
          end_time?: string
          id?: string
          notes?: string | null
          shift_type?: string | null
          start_time?: string
          status?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shifts_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          duration: number | null
          id: string
          priority: string | null
          project_id: string | null
          start_date: string | null
          status: string | null
          team_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          duration?: number | null
          id?: string
          priority?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          team_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          duration?: number | null
          id?: string
          priority?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: string | null
          team_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invitation_token: string
          invited_by: string
          team_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invitation_token: string
          invited_by: string
          team_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invited_by?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          competence_level: string | null
          created_at: string | null
          email: string
          full_name: string | null
          hourly_rate: number | null
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          name: string
          role: string | null
          status: string | null
          team_id: string | null
        }
        Insert: {
          competence_level?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          name: string
          role?: string | null
          status?: string | null
          team_id?: string | null
        }
        Update: {
          competence_level?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          name?: string
          role?: string | null
          status?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          admin_email: string
          created_at: string | null
          id: string
          subscription_plan: string | null
          team_id: string
          team_logo_url: string | null
          team_name: string
          team_settings: Json | null
          updated_at: string | null
        }
        Insert: {
          admin_email: string
          created_at?: string | null
          id?: string
          subscription_plan?: string | null
          team_id: string
          team_logo_url?: string | null
          team_name: string
          team_settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          admin_email?: string
          created_at?: string | null
          id?: string
          subscription_plan?: string | null
          team_id?: string
          team_logo_url?: string | null
          team_name?: string
          team_settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_google_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          refresh_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          refresh_token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          refresh_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          age: number | null
          bank_account_number: string | null
          bank_name: string | null
          city: string | null
          competence_level: string | null
          country: string | null
          cpr_number: string | null
          created_at: string | null
          date_of_birth: string | null
          department: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string | null
          first_name: string | null
          full_name: string
          hire_date: string | null
          id: string
          job_title: string | null
          last_name: string | null
          phone_number: string | null
          postal_code: string | null
          profile_picture_url: string | null
          tax_id: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          age?: number | null
          bank_account_number?: string | null
          bank_name?: string | null
          city?: string | null
          competence_level?: string | null
          country?: string | null
          cpr_number?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          first_name?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          profile_picture_url?: string | null
          tax_id?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          age?: number | null
          bank_account_number?: string | null
          bank_name?: string | null
          city?: string | null
          competence_level?: string | null
          country?: string | null
          cpr_number?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          department?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          first_name?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          profile_picture_url?: string | null
          tax_id?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_team_id: { Args: never; Returns: string }
      user_is_team_admin: { Args: { check_team_id: string }; Returns: boolean }
      user_is_team_member: { Args: { check_team_id: string }; Returns: boolean }
    }
    Enums: {
      action_priority_enum: "low" | "medium" | "high" | "critical" | "emergency"
      action_status_enum:
        | "pending"
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "on_hold"
      action_type_enum:
        | "immediate_response"
        | "investigation"
        | "communication"
        | "evacuation"
        | "resource_deployment"
        | "medical_response"
        | "security_response"
        | "recovery"
        | "documentation"
      anomaly_severity_enum:
        | "low"
        | "medium"
        | "high"
        | "critical"
        | "emergency"
      anomaly_type_enum:
        | "point_anomaly"
        | "contextual_anomaly"
        | "collective_anomaly"
        | "trend_anomaly"
        | "seasonal_anomaly"
        | "system_anomaly"
        | "behavior_anomaly"
        | "performance_anomaly"
      approval_status_enum: "pending" | "approved" | "rejected" | "under_review"
      area_type_enum:
        | "terminal"
        | "apron"
        | "gate"
        | "baggage"
        | "cargo"
        | "maintenance"
        | "fuel"
        | "ramp"
        | "office"
        | "parking"
      budget_type_enum:
        | "operational"
        | "capital"
        | "departmental"
        | "project"
        | "revenue"
      business_impact_enum: "low" | "medium" | "high" | "critical" | "strategic"
      communication_type_enum:
        | "alert"
        | "update"
        | "instruction"
        | "request"
        | "notification"
        | "coordination"
        | "media_release"
        | "stakeholder_update"
      competency_level_enum:
        | "basic"
        | "intermediate"
        | "advanced"
        | "expert"
        | "instructor"
      confidentiality_enum:
        | "public"
        | "internal"
        | "confidential"
        | "restricted"
        | "classified"
      confidentiality_level_enum:
        | "public"
        | "internal"
        | "confidential"
        | "restricted"
        | "top_secret"
      contract_status_enum:
        | "draft"
        | "under_negotiation"
        | "pending_signature"
        | "active"
        | "expired"
        | "terminated"
      contract_type_enum:
        | "master_service_agreement"
        | "rate_card"
        | "sla"
        | "amendment"
        | "renewal"
      cost_center_type_enum:
        | "department"
        | "service_line"
        | "equipment"
        | "facility"
        | "project"
      cost_transaction_type_enum:
        | "direct_cost"
        | "indirect_cost"
        | "overhead"
        | "capital_expenditure"
        | "revenue"
      crisis_type_enum:
        | "natural_disaster"
        | "technological_failure"
        | "human_caused"
        | "security_threat"
        | "health_emergency"
        | "environmental"
        | "economic"
        | "supply_chain"
        | "cyber_attack"
        | "infrastructure"
      criticality_level_enum: "low" | "medium" | "high" | "critical" | "vital"
      delivery_method_enum:
        | "email"
        | "sms"
        | "push_notification"
        | "radio"
        | "public_address"
        | "digital_signage"
        | "phone_call"
        | "in_person"
      deployment_status_enum:
        | "development"
        | "testing"
        | "staging"
        | "production"
        | "deprecated"
        | "failed"
      dispute_status_enum:
        | "none"
        | "raised"
        | "under_review"
        | "resolved"
        | "escalated"
      emergency_severity_enum:
        | "low"
        | "medium"
        | "high"
        | "critical"
        | "catastrophic"
      emergency_training_type_enum:
        | "first_aid"
        | "cpr"
        | "fire_safety"
        | "evacuation"
        | "incident_command"
        | "hazmat"
        | "security"
        | "emergency_communication"
        | "business_continuity"
        | "crisis_management"
      escalation_level_enum:
        | "local"
        | "facility"
        | "regional"
        | "national"
        | "international"
      evacuation_status_enum:
        | "normal"
        | "alert"
        | "evacuating"
        | "evacuated"
        | "all_clear"
        | "restricted"
      experiment_status_enum:
        | "planned"
        | "running"
        | "completed"
        | "cancelled"
        | "failed"
        | "analyzing"
      experiment_type_enum:
        | "ab_test"
        | "multivariate"
        | "feature_experiment"
        | "model_comparison"
        | "parameter_tuning"
        | "architecture_test"
        | "hypothesis_test"
        | "sensitivity_analysis"
      function_type_enum:
        | "core_business"
        | "supporting"
        | "administrative"
        | "regulatory"
        | "safety_critical"
        | "customer_facing"
        | "revenue_generating"
        | "cost_center"
      impact_level_enum: "negligible" | "low" | "medium" | "high" | "critical"
      implementation_status_enum:
        | "pending"
        | "in_progress"
        | "implemented"
        | "failed"
        | "rolled_back"
        | "monitoring"
      incident_status_enum:
        | "reported"
        | "responding"
        | "contained"
        | "resolved"
        | "closed"
        | "under_investigation"
      incident_type_enum:
        | "aircraft_emergency"
        | "fire"
        | "medical_emergency"
        | "security_threat"
        | "weather_emergency"
        | "equipment_failure"
        | "hazmat_incident"
        | "power_outage"
        | "evacuation"
        | "cyber_security"
        | "infrastructure_failure"
        | "environmental"
      insight_category_enum:
        | "operational"
        | "financial"
        | "customer"
        | "safety"
        | "compliance"
        | "strategic"
        | "competitive"
        | "sustainability"
      insight_type_enum:
        | "predictive"
        | "diagnostic"
        | "prescriptive"
        | "descriptive"
        | "anomaly"
        | "optimization"
        | "trend"
        | "correlation"
      intelligence_type_enum:
        | "pricing"
        | "service_offering"
        | "market_share"
        | "financial_performance"
        | "customer_satisfaction"
        | "operational_metrics"
        | "technology_adoption"
        | "strategic_movement"
      investigation_status_enum:
        | "open"
        | "investigating"
        | "analyzed"
        | "resolved"
        | "dismissed"
        | "escalated"
      invoice_status_enum:
        | "draft"
        | "pending_approval"
        | "approved"
        | "sent"
        | "paid"
        | "overdue"
        | "disputed"
        | "cancelled"
      kpi_category_enum:
        | "profitability"
        | "liquidity"
        | "efficiency"
        | "growth"
        | "risk"
      market_intelligence_type_enum:
        | "demand_analysis"
        | "competitive_landscape"
        | "pricing_analysis"
        | "customer_segmentation"
        | "market_trends"
        | "growth_opportunities"
        | "risk_assessment"
        | "regulatory_environment"
      message_priority_enum: "low" | "normal" | "high" | "urgent" | "critical"
      ml_model_type_enum:
        | "regression"
        | "classification"
        | "clustering"
        | "time_series"
        | "deep_learning"
        | "ensemble"
        | "reinforcement_learning"
        | "anomaly_detection"
        | "optimization"
        | "nlp"
      observation_status_enum:
        | "open"
        | "assigned"
        | "in_progress"
        | "resolved"
        | "closed"
        | "rejected"
      optimization_type_enum:
        | "linear_programming"
        | "integer_programming"
        | "constraint_satisfaction"
        | "multi_objective"
        | "stochastic"
        | "dynamic"
        | "heuristic"
        | "metaheuristic"
      payment_method_enum:
        | "credit_card"
        | "bank_transfer"
        | "check"
        | "ach"
        | "wire_transfer"
        | "digital_wallet"
      payment_status_enum:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      plan_status_enum:
        | "draft"
        | "under_review"
        | "approved"
        | "active"
        | "archived"
        | "expired"
      rate_card_status_enum: "draft" | "active" | "inactive" | "expired"
      rate_type_enum: "fixed" | "variable" | "tiered" | "dynamic"
      rate_unit_enum:
        | "per_flight"
        | "per_passenger"
        | "per_bag"
        | "per_kg"
        | "per_hour"
        | "per_unit"
      reconciliation_status_enum:
        | "unreconciled"
        | "matched"
        | "partially_matched"
        | "exception"
      refresh_schedule_enum:
        | "real_time"
        | "every_minute"
        | "every_5_minutes"
        | "every_15_minutes"
        | "hourly"
        | "daily"
        | "weekly"
      resource_status_enum:
        | "available"
        | "deployed"
        | "maintenance"
        | "damaged"
        | "reserved"
        | "out_of_service"
      resource_type_enum:
        | "personnel"
        | "equipment"
        | "vehicle"
        | "medical"
        | "communication"
        | "facility"
        | "supplies"
        | "external_service"
      revenue_recognition_method_enum:
        | "immediate"
        | "deferred"
        | "percentage_completion"
        | "milestone_based"
      risk_appetite_enum:
        | "risk_averse"
        | "risk_cautious"
        | "risk_balanced"
        | "risk_seeking"
        | "risk_aggressive"
      risk_category_enum:
        | "operational"
        | "financial"
        | "strategic"
        | "compliance"
        | "reputation"
        | "environmental"
        | "technological"
        | "human_resources"
        | "supply_chain"
        | "security"
      risk_impact_enum: "negligible" | "minor" | "moderate" | "major" | "severe"
      risk_level_enum: "very_low" | "low" | "medium" | "high" | "very_high"
      risk_likelihood_enum: "very_low" | "low" | "medium" | "high" | "very_high"
      risk_status_enum:
        | "identified"
        | "assessed"
        | "mitigated"
        | "monitored"
        | "closed"
        | "escalated"
      safety_observation_type_enum:
        | "unsafe_condition"
        | "unsafe_act"
        | "near_miss"
        | "good_practice"
        | "improvement_suggestion"
        | "equipment_defect"
        | "environmental_hazard"
        | "procedural_violation"
      service_type_enum:
        | "passenger_services"
        | "ramp_services"
        | "arrival_services"
        | "baggage_handling"
        | "aircraft_cleaning"
        | "catering"
        | "fuel_services"
        | "ground_transportation"
        | "security_services"
        | "customs_clearance"
      solve_frequency_enum:
        | "real_time"
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "on_demand"
      strategic_importance_enum:
        | "low"
        | "medium"
        | "high"
        | "critical"
        | "vital"
      training_status_enum:
        | "scheduled"
        | "in_progress"
        | "completed"
        | "expired"
        | "cancelled"
        | "failed"
      trend_direction_enum: "up" | "down" | "stable" | "volatile"
      update_frequency_enum:
        | "real_time"
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "on_demand"
      urgency_level_enum: "low" | "medium" | "high" | "urgent" | "critical"
      visualization_status_enum:
        | "draft"
        | "published"
        | "archived"
        | "deprecated"
        | "shared"
        | "private"
      visualization_type_enum:
        | "dashboard"
        | "chart"
        | "map"
        | "network"
        | "tree"
        | "heatmap"
        | "scatter_plot"
        | "time_series"
        | "interactive"
        | "immersive"
      zone_type_enum:
        | "terminal"
        | "apron"
        | "maintenance"
        | "cargo"
        | "office"
        | "public"
        | "restricted"
        | "emergency"
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
      action_priority_enum: ["low", "medium", "high", "critical", "emergency"],
      action_status_enum: [
        "pending",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
        "on_hold",
      ],
      action_type_enum: [
        "immediate_response",
        "investigation",
        "communication",
        "evacuation",
        "resource_deployment",
        "medical_response",
        "security_response",
        "recovery",
        "documentation",
      ],
      anomaly_severity_enum: ["low", "medium", "high", "critical", "emergency"],
      anomaly_type_enum: [
        "point_anomaly",
        "contextual_anomaly",
        "collective_anomaly",
        "trend_anomaly",
        "seasonal_anomaly",
        "system_anomaly",
        "behavior_anomaly",
        "performance_anomaly",
      ],
      approval_status_enum: ["pending", "approved", "rejected", "under_review"],
      area_type_enum: [
        "terminal",
        "apron",
        "gate",
        "baggage",
        "cargo",
        "maintenance",
        "fuel",
        "ramp",
        "office",
        "parking",
      ],
      budget_type_enum: [
        "operational",
        "capital",
        "departmental",
        "project",
        "revenue",
      ],
      business_impact_enum: ["low", "medium", "high", "critical", "strategic"],
      communication_type_enum: [
        "alert",
        "update",
        "instruction",
        "request",
        "notification",
        "coordination",
        "media_release",
        "stakeholder_update",
      ],
      competency_level_enum: [
        "basic",
        "intermediate",
        "advanced",
        "expert",
        "instructor",
      ],
      confidentiality_enum: [
        "public",
        "internal",
        "confidential",
        "restricted",
        "classified",
      ],
      confidentiality_level_enum: [
        "public",
        "internal",
        "confidential",
        "restricted",
        "top_secret",
      ],
      contract_status_enum: [
        "draft",
        "under_negotiation",
        "pending_signature",
        "active",
        "expired",
        "terminated",
      ],
      contract_type_enum: [
        "master_service_agreement",
        "rate_card",
        "sla",
        "amendment",
        "renewal",
      ],
      cost_center_type_enum: [
        "department",
        "service_line",
        "equipment",
        "facility",
        "project",
      ],
      cost_transaction_type_enum: [
        "direct_cost",
        "indirect_cost",
        "overhead",
        "capital_expenditure",
        "revenue",
      ],
      crisis_type_enum: [
        "natural_disaster",
        "technological_failure",
        "human_caused",
        "security_threat",
        "health_emergency",
        "environmental",
        "economic",
        "supply_chain",
        "cyber_attack",
        "infrastructure",
      ],
      criticality_level_enum: ["low", "medium", "high", "critical", "vital"],
      delivery_method_enum: [
        "email",
        "sms",
        "push_notification",
        "radio",
        "public_address",
        "digital_signage",
        "phone_call",
        "in_person",
      ],
      deployment_status_enum: [
        "development",
        "testing",
        "staging",
        "production",
        "deprecated",
        "failed",
      ],
      dispute_status_enum: [
        "none",
        "raised",
        "under_review",
        "resolved",
        "escalated",
      ],
      emergency_severity_enum: [
        "low",
        "medium",
        "high",
        "critical",
        "catastrophic",
      ],
      emergency_training_type_enum: [
        "first_aid",
        "cpr",
        "fire_safety",
        "evacuation",
        "incident_command",
        "hazmat",
        "security",
        "emergency_communication",
        "business_continuity",
        "crisis_management",
      ],
      escalation_level_enum: [
        "local",
        "facility",
        "regional",
        "national",
        "international",
      ],
      evacuation_status_enum: [
        "normal",
        "alert",
        "evacuating",
        "evacuated",
        "all_clear",
        "restricted",
      ],
      experiment_status_enum: [
        "planned",
        "running",
        "completed",
        "cancelled",
        "failed",
        "analyzing",
      ],
      experiment_type_enum: [
        "ab_test",
        "multivariate",
        "feature_experiment",
        "model_comparison",
        "parameter_tuning",
        "architecture_test",
        "hypothesis_test",
        "sensitivity_analysis",
      ],
      function_type_enum: [
        "core_business",
        "supporting",
        "administrative",
        "regulatory",
        "safety_critical",
        "customer_facing",
        "revenue_generating",
        "cost_center",
      ],
      impact_level_enum: ["negligible", "low", "medium", "high", "critical"],
      implementation_status_enum: [
        "pending",
        "in_progress",
        "implemented",
        "failed",
        "rolled_back",
        "monitoring",
      ],
      incident_status_enum: [
        "reported",
        "responding",
        "contained",
        "resolved",
        "closed",
        "under_investigation",
      ],
      incident_type_enum: [
        "aircraft_emergency",
        "fire",
        "medical_emergency",
        "security_threat",
        "weather_emergency",
        "equipment_failure",
        "hazmat_incident",
        "power_outage",
        "evacuation",
        "cyber_security",
        "infrastructure_failure",
        "environmental",
      ],
      insight_category_enum: [
        "operational",
        "financial",
        "customer",
        "safety",
        "compliance",
        "strategic",
        "competitive",
        "sustainability",
      ],
      insight_type_enum: [
        "predictive",
        "diagnostic",
        "prescriptive",
        "descriptive",
        "anomaly",
        "optimization",
        "trend",
        "correlation",
      ],
      intelligence_type_enum: [
        "pricing",
        "service_offering",
        "market_share",
        "financial_performance",
        "customer_satisfaction",
        "operational_metrics",
        "technology_adoption",
        "strategic_movement",
      ],
      investigation_status_enum: [
        "open",
        "investigating",
        "analyzed",
        "resolved",
        "dismissed",
        "escalated",
      ],
      invoice_status_enum: [
        "draft",
        "pending_approval",
        "approved",
        "sent",
        "paid",
        "overdue",
        "disputed",
        "cancelled",
      ],
      kpi_category_enum: [
        "profitability",
        "liquidity",
        "efficiency",
        "growth",
        "risk",
      ],
      market_intelligence_type_enum: [
        "demand_analysis",
        "competitive_landscape",
        "pricing_analysis",
        "customer_segmentation",
        "market_trends",
        "growth_opportunities",
        "risk_assessment",
        "regulatory_environment",
      ],
      message_priority_enum: ["low", "normal", "high", "urgent", "critical"],
      ml_model_type_enum: [
        "regression",
        "classification",
        "clustering",
        "time_series",
        "deep_learning",
        "ensemble",
        "reinforcement_learning",
        "anomaly_detection",
        "optimization",
        "nlp",
      ],
      observation_status_enum: [
        "open",
        "assigned",
        "in_progress",
        "resolved",
        "closed",
        "rejected",
      ],
      optimization_type_enum: [
        "linear_programming",
        "integer_programming",
        "constraint_satisfaction",
        "multi_objective",
        "stochastic",
        "dynamic",
        "heuristic",
        "metaheuristic",
      ],
      payment_method_enum: [
        "credit_card",
        "bank_transfer",
        "check",
        "ach",
        "wire_transfer",
        "digital_wallet",
      ],
      payment_status_enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      plan_status_enum: [
        "draft",
        "under_review",
        "approved",
        "active",
        "archived",
        "expired",
      ],
      rate_card_status_enum: ["draft", "active", "inactive", "expired"],
      rate_type_enum: ["fixed", "variable", "tiered", "dynamic"],
      rate_unit_enum: [
        "per_flight",
        "per_passenger",
        "per_bag",
        "per_kg",
        "per_hour",
        "per_unit",
      ],
      reconciliation_status_enum: [
        "unreconciled",
        "matched",
        "partially_matched",
        "exception",
      ],
      refresh_schedule_enum: [
        "real_time",
        "every_minute",
        "every_5_minutes",
        "every_15_minutes",
        "hourly",
        "daily",
        "weekly",
      ],
      resource_status_enum: [
        "available",
        "deployed",
        "maintenance",
        "damaged",
        "reserved",
        "out_of_service",
      ],
      resource_type_enum: [
        "personnel",
        "equipment",
        "vehicle",
        "medical",
        "communication",
        "facility",
        "supplies",
        "external_service",
      ],
      revenue_recognition_method_enum: [
        "immediate",
        "deferred",
        "percentage_completion",
        "milestone_based",
      ],
      risk_appetite_enum: [
        "risk_averse",
        "risk_cautious",
        "risk_balanced",
        "risk_seeking",
        "risk_aggressive",
      ],
      risk_category_enum: [
        "operational",
        "financial",
        "strategic",
        "compliance",
        "reputation",
        "environmental",
        "technological",
        "human_resources",
        "supply_chain",
        "security",
      ],
      risk_impact_enum: ["negligible", "minor", "moderate", "major", "severe"],
      risk_level_enum: ["very_low", "low", "medium", "high", "very_high"],
      risk_likelihood_enum: ["very_low", "low", "medium", "high", "very_high"],
      risk_status_enum: [
        "identified",
        "assessed",
        "mitigated",
        "monitored",
        "closed",
        "escalated",
      ],
      safety_observation_type_enum: [
        "unsafe_condition",
        "unsafe_act",
        "near_miss",
        "good_practice",
        "improvement_suggestion",
        "equipment_defect",
        "environmental_hazard",
        "procedural_violation",
      ],
      service_type_enum: [
        "passenger_services",
        "ramp_services",
        "arrival_services",
        "baggage_handling",
        "aircraft_cleaning",
        "catering",
        "fuel_services",
        "ground_transportation",
        "security_services",
        "customs_clearance",
      ],
      solve_frequency_enum: [
        "real_time",
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "on_demand",
      ],
      strategic_importance_enum: ["low", "medium", "high", "critical", "vital"],
      training_status_enum: [
        "scheduled",
        "in_progress",
        "completed",
        "expired",
        "cancelled",
        "failed",
      ],
      trend_direction_enum: ["up", "down", "stable", "volatile"],
      update_frequency_enum: [
        "real_time",
        "hourly",
        "daily",
        "weekly",
        "monthly",
        "on_demand",
      ],
      urgency_level_enum: ["low", "medium", "high", "urgent", "critical"],
      visualization_status_enum: [
        "draft",
        "published",
        "archived",
        "deprecated",
        "shared",
        "private",
      ],
      visualization_type_enum: [
        "dashboard",
        "chart",
        "map",
        "network",
        "tree",
        "heatmap",
        "scatter_plot",
        "time_series",
        "interactive",
        "immersive",
      ],
      zone_type_enum: [
        "terminal",
        "apron",
        "maintenance",
        "cargo",
        "office",
        "public",
        "restricted",
        "emergency",
      ],
    },
  },
} as const

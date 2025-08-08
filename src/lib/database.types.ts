export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: 'user' | 'moderator' | 'admin';
          username?: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          role?: 'user' | 'moderator' | 'admin';
          username?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: 'user' | 'moderator' | 'admin';
          username?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      claims: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          claim_number: string;
          claim_type: 'complaint' | 'request' | 'suggestion' | 'bug_report' | 'other';
          status: 'pending' | 'under_review' | 'approved' | 'rejected';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          category: string;
          assigned_to?: string;
          resolved_at?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          claim_number?: string;
          claim_type: 'complaint' | 'request' | 'suggestion' | 'bug_report' | 'other';
          status?: 'pending' | 'under_review' | 'approved' | 'rejected';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          category: string;
          assigned_to?: string;
          resolved_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          claim_number?: string;
          claim_type?: 'complaint' | 'request' | 'suggestion' | 'bug_report' | 'other';
          status?: 'pending' | 'under_review' | 'approved' | 'rejected';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          category?: string;
          assigned_to?: string;
          resolved_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      activity_log: {
        Row: {
          id: string;
          user_id: string;
          activity_type: 'create' | 'update' | 'delete' | 'login' | 'logout';
          entity_type?: string;
          entity_id?: string;
          description?: string;
          metadata: Record<string, any>;
          ip_address?: string;
          user_agent?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: 'create' | 'update' | 'delete' | 'login' | 'logout';
          entity_type?: string;
          entity_id?: string;
          description?: string;
          metadata?: Record<string, any>;
          ip_address?: string;
          user_agent?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: 'create' | 'update' | 'delete' | 'login' | 'logout';
          entity_type?: string;
          entity_id?: string;
          description?: string;
          metadata?: Record<string, any>;
          ip_address?: string;
          user_agent?: string;
          created_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          title: string | null;
          company: string | null;
          content: string;
          rating: number;
          avatar_url: string | null;
          featured: boolean;
          active: boolean;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          title?: string | null;
          company?: string | null;
          content: string;
          rating: number;
          avatar_url?: string | null;
          featured?: boolean;
          active?: boolean;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          title?: string | null;
          company?: string | null;
          content?: string;
          rating?: number;
          avatar_url?: string | null;
          featured?: boolean;
          active?: boolean;
          metadata?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Enums: {
      user_role: 'user' | 'moderator' | 'admin';
      claim_status: 'pending' | 'under_review' | 'approved' | 'rejected';
      claim_type: 'complaint' | 'request' | 'suggestion' | 'bug_report' | 'other';
      activity_type: 'create' | 'update' | 'delete' | 'login' | 'logout';
    };
  };
}

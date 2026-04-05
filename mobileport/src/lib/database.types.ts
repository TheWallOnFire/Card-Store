export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          updated_at: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          updated_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          updated_at?: string | null
          created_at?: string | null
        }
      }
      games: {
        Row: {
          id: string
          name: string
          created_at: string | null
        }
        Insert: {
          id: string
          name: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string | null
        }
      }
      cards: {
        Row: {
          id: string
          game_id: string
          name: string
          rarity: string | null
          image_url: string | null
          description: string | null
          attributes: Json
          created_at: string | null
        }
        Insert: {
          id?: string
          game_id: string
          name: string
          rarity?: string | null
          image_url?: string | null
          description?: string | null
          attributes?: Json
          created_at?: string | null
        }
        Update: {
          id?: string
          game_id?: string
          name?: string
          rarity?: string | null
          image_url?: string | null
          description?: string | null
          attributes?: Json
          created_at?: string | null
        }
      }
      listings: {
        Row: {
          id: string
          card_id: string
          seller_id: string
          condition: string
          price: number
          quantity: number
          created_at: string | null
        }
        Insert: {
          id?: string
          card_id: string
          seller_id: string
          condition?: string
          price: number
          quantity?: number
          created_at?: string | null
        }
        Update: {
          id?: string
          card_id?: string
          seller_id?: string
          condition?: string
          price?: number
          quantity?: number
          created_at?: string | null
        }
      }
    }
  }
}

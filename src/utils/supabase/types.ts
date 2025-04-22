export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          content: string
          image: string
          createdAt: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          image: string
          createdAt?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image?: string
          createdAt?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

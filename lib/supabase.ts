import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      }
    })
  : null

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Mock data for when Supabase is not configured
export const mockEmployeeData = {
  totalEmployees: 1234,
  avgPerformance: 87.5,
  promotionReady: 156,
  competencyGap: 23.2,
  performanceTrend: [
    { name: 'Jan', performance: 85, potential: 78 },
    { name: 'Feb', performance: 88, potential: 82 },
    { name: 'Mar', performance: 92, potential: 85 },
    { name: 'Apr', performance: 89, potential: 88 },
    { name: 'May', performance: 94, potential: 90 },
    { name: 'Jun', performance: 91, potential: 87 }
  ],
  competencyData: [
    { name: 'Technical Skills', value: 85, color: '#8884d8' },
    { name: 'Leadership', value: 72, color: '#82ca9d' },
    { name: 'Communication', value: 68, color: '#ffc658' },
    { name: 'Problem Solving', value: 91, color: '#ff7300' }
  ],
  nineBoxData: [
    { performance: 85, potential: 78, name: 'John Doe', department: 'Engineering' },
    { performance: 92, potential: 88, name: 'Jane Smith', department: 'Marketing' },
    { performance: 78, potential: 85, name: 'Mike Johnson', department: 'Sales' },
    { performance: 88, potential: 82, name: 'Sarah Wilson', department: 'HR' }
  ]
}

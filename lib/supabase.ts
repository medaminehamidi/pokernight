import { Database } from '@/types/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient<Database>()

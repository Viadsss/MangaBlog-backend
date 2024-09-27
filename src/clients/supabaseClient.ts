import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl == null || supabaseServiceRoleKey == null) {
  throw new Error("supabase environment is missing");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default supabase;

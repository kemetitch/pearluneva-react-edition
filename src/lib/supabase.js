import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://udgvkwxovkokyhrpgwik.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkZ3Zrd3hvdmtva3locnBnd2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODQ0NjEsImV4cCI6MjA4ODU2MDQ2MX0.yNSse5m5wBjYN-wr1ZzoyhbFzJPk_hjzBqttIeyoEqQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

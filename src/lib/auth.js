import { supabase } from "./supabase";

/** Check current session */
export async function checkAuth() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    console.error("Auth session check error:", error);
    return null;
  }
  return session?.user || null;
}

/** Login admin */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/** Logout */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Logout error:", error);
}

import { createClient } from "@/lib/supabase/server";

export async function getServerSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function requireAuth() {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function getUserRole(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_roles")
    .select("role, org_id, permissions")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function requireRole(userId: string, allowedRoles: string[]) {
  const roleData = await getUserRole(userId);

  if (!allowedRoles.includes(roleData.role)) {
    throw new Error("Forbidden");
  }

  return roleData;
}

export async function getOrgId(userId: string): Promise<string> {
  const roleData = await getUserRole(userId);
  return roleData.org_id!;
}

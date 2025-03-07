import { supabase } from "./supabase";
import { Resident } from "./types";

export async function getResidents(): Promise<Resident[]> {
  try {
    const { data, error } = await supabase
      .from("residents")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching residents:", error);
    // Fallback to localStorage if Supabase fails
    return JSON.parse(localStorage.getItem("residents") || "[]");
  }
}

export async function createResident(
  resident: Omit<Resident, "id" | "createdAt" | "updatedAt">,
): Promise<Resident> {
  const newResident = {
    ...resident,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from("residents")
      .insert(newResident)
      .select()
      .single();

    if (error) throw error;

    // Also save to localStorage as backup
    const residents = JSON.parse(localStorage.getItem("residents") || "[]");
    localStorage.setItem(
      "residents",
      JSON.stringify([...residents, newResident]),
    );

    return data;
  } catch (error) {
    console.error("Error creating resident:", error);

    // Fallback to localStorage if Supabase fails
    const residents = JSON.parse(localStorage.getItem("residents") || "[]");
    localStorage.setItem(
      "residents",
      JSON.stringify([...residents, newResident]),
    );

    return newResident as Resident;
  }
}

export async function updateResident(
  id: string,
  resident: Partial<Resident>,
): Promise<Resident> {
  const updatedResident = {
    ...resident,
    updatedAt: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from("residents")
      .update(updatedResident)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Also update localStorage as backup
    const residents = JSON.parse(localStorage.getItem("residents") || "[]");
    const updatedResidents = residents.map((r: Resident) =>
      r.id === id ? { ...r, ...updatedResident } : r,
    );
    localStorage.setItem("residents", JSON.stringify(updatedResidents));

    return data;
  } catch (error) {
    console.error("Error updating resident:", error);

    // Fallback to localStorage if Supabase fails
    const residents = JSON.parse(localStorage.getItem("residents") || "[]");
    const updatedResidents = residents.map((r: Resident) =>
      r.id === id ? { ...r, ...updatedResident } : r,
    );
    localStorage.setItem("residents", JSON.stringify(updatedResidents));

    return { id, ...updatedResident } as Resident;
  }
}

export async function deleteResident(id: string): Promise<void> {
  try {
    const { error } = await supabase.from("residents").delete().eq("id", id);

    if (error) throw error;

    // Also delete from localStorage as backup
    const residents = JSON.parse(localStorage.getItem("residents") || "[]");
    const updatedResidents = residents.filter((r: Resident) => r.id !== id);
    localStorage.setItem("residents", JSON.stringify(updatedResidents));
  } catch (error) {
    console.error("Error deleting resident:", error);

    // Fallback to localStorage if Supabase fails
    const residents = JSON.parse(localStorage.getItem("residents") || "[]");
    const updatedResidents = residents.filter((r: Resident) => r.id !== id);
    localStorage.setItem("residents", JSON.stringify(updatedResidents));
  }
}

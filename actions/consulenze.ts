"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { aggiornaConsulenza, STATI_CONSULENZA } from "@/lib/consulenze";

export async function salvaStatoConsulenza(id: number, fd: FormData) {
  await requireAdmin();
  const stato = String(fd.get("stato") ?? "");
  if (!(STATI_CONSULENZA as readonly string[]).includes(stato)) return;
  await aggiornaConsulenza(id, stato, String(fd.get("note") ?? "").slice(0, 2000));
  revalidatePath("/console/consulenze");
}

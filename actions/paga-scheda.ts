"use server";

import { redirect } from "next/navigation";
import { urlCassa } from "@/lib/scheda-checkout";

// Crea il pagamento Stripe per una richiesta e porta il cliente alla cassa.
export async function pagaScheda(token: string) {
  redirect(await urlCassa(token));
}

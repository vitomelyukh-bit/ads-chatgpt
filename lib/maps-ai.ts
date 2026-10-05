import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

// Testi del servizio Google Maps scritti dall'AI.
// Con OPENAI_API_KEY usa OpenAI direttamente (GPT-5 mini, pochi centesimi per cliente al mese);
// senza, passa dal Vercel AI Gateway (serve una ricarica di crediti per i modelli Claude).
const modello = () => (process.env.OPENAI_API_KEY ? openai(process.env.MODELLO_OPENAI || "gpt-5-mini") : process.env.MODELLO_AI || "anthropic/claude-sonnet-5.5");

export type ProfiloCliente = { attivita: string; citta: string; tono: string; info: string; firma: string; spunti?: string };

const REGOLE = `Regole che non si violano mai:
- Scrivi in italiano naturale, come scriverebbe il titolare, non un'agenzia. Niente emoji, niente punti esclamativi a raffica, niente hashtag.
- Usa solo fatti presenti nelle informazioni sull'attività o nel testo ricevuto. Non inventare offerte, prezzi, sconti, eventi, orari, nomi di persone o servizi.
- Niente numeri di telefono, email o link nel testo.
- Non promettere risultati, non offrire sconti o regali in cambio di recensioni o della loro modifica.
- Non scrivere dati personali del cliente (cosa ha comprato, quanto ha speso, quando è venuto) anche se li conosci.
- Rispondi solo con il testo finale, senza virgolette, titoli o spiegazioni.`;

const profilo = (c: ProfiloCliente) => `Attività: ${c.attivita}${c.citta ? `, ${c.citta}` : ""}
Tono da usare: ${c.tono}
Informazioni vere sull'attività (usa solo queste): ${c.info || "nessuna informazione in più"}
${c.firma ? `Firma da mettere in fondo: ${c.firma}` : "Nessuna firma in fondo."}`;

async function scrivi(istruzioni: string, prompt: string) {
  const { text } = await generateText({
    model: modello(), instructions: istruzioni, prompt,
    providerOptions: { openai: { reasoningEffort: "low" } },
  });
  return text.trim().replace(/^["«]|["»]$/g, "").trim();
}

export function rispostaRecensione(c: ProfiloCliente, r: { autore: string; stelle: number; testo: string }) {
  const tipo = r.stelle >= 4 ? "positiva" : r.stelle === 3 ? "con qualche critica" : "negativa";
  return scrivi(
    `Scrivi la risposta del titolare a una recensione su Google Maps. ${REGOLE}
- Lunghezza: 2-4 frasi brevi (al massimo 600 caratteri). Se la recensione non ha testo, 1-2 frasi.
- Usa il nome di battesimo dell'autore solo se è chiaro (es. "Giulia M." -> "Giulia"), altrimenti saluta in modo neutro.
- Recensione positiva: ringrazia in modo specifico richiamando un dettaglio della recensione, invita a tornare. Non copiare frasi fatte.
- Recensione negativa o con critiche: ringrazia per il parere, riconosci il problema se c'è senza dare la colpa al cliente e senza dargli del bugiardo, spiega con una frase cosa si fa se le informazioni lo permettono (senza inventare), invita a ricontattare l'attività in privato. Mai polemica, mai giustificazioni lunghe.
- Se la recensione sembra di qualcuno che non è mai stato cliente, dillo con calma ("non troviamo traccia della sua visita") e invita a contattare l'attività.`,
    `${profilo(c)}

Recensione ${tipo} (${r.stelle} stelle su 5) di ${r.autore || "un cliente"}:
${r.testo || "(nessun testo, solo le stelle)"}`,
  );
}

export function novitaSettimanale(c: ProfiloCliente, precedenti: string[]) {
  return scrivi(
    `Scrivi una "novità" da pubblicare sul profilo Google Maps dell'attività, come aggiornamento della settimana. ${REGOLE}
- Lunghezza: 300-600 caratteri, 2-4 frasi. Prima frase che si capisce da sola anche se tagliata.
- Se ci sono spunti del titolare, la novità parla di quelli. Altrimenti racconta un servizio, un prodotto o un punto forte preso dalle informazioni, in modo concreto.
- Deve essere diversa per argomento e attacco dalle novità precedenti.
- Chiudi con un invito semplice (passare, prenotare, chiedere informazioni) senza scrivere recapiti.`,
    `${profilo(c)}
${c.spunti ? `\nSpunti del titolare per questa settimana: ${c.spunti}` : ""}

Novità già pubblicate (non ripeterle):
${precedenti.length ? precedenti.map((p) => `- ${p}`).join("\n") : "- nessuna"}`,
  );
}

export function commentoReport(c: ProfiloCliente, mese: string, righe: string) {
  return scrivi(
    `Scrivi un breve commento (3-5 frasi) al riepilogo mensile di un'attività su Google Maps, rivolto al titolare, dandogli del tu. ${REGOLE}
- Commenta solo i numeri forniti: cosa è salito, cosa è sceso, rispetto al mese prima se c'è. Non inventare cause.
- Linguaggio semplice: "persone che ti hanno visto", "chiamate", "richieste di indicazioni". Niente gergo.
- Chiudi con un consiglio pratico legato alle recensioni o alle novità (es. chiedere recensioni ai clienti contenti).`,
    `Attività: ${c.attivita}\nMese: ${mese}\n${righe}`,
  );
}

// Messaggio pronto che il titolare manda su WhatsApp ai clienti contenti.
export function messaggioRichiestaRecensione(c: ProfiloCliente, link: string) {
  return scrivi(
    `Scrivi un messaggio WhatsApp breve (2-3 frasi) che il titolare manda a un cliente dopo il servizio per chiedere una recensione su Google. ${REGOLE}
- Eccezione: in fondo metti esattamente questo link: ${link}
- Tono gentile, senza insistere, senza promettere nulla in cambio. Inizia con "Ciao," senza nome.`,
    profilo(c),
  );
}

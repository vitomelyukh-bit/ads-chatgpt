// Regole della prenotazione delle call. Modificabili qui.
export const booking = {
  timeZone: "Europe/Rome",
  durataMin: 20, // durata della call
  passoMin: 30, // un orario ogni 30 minuti
  preavvisoOre: 4, // non prima di 4 ore da adesso
  giorniAvanti: 14, // si prenota nei prossimi 14 giorni
  // 1 = lunedì … 5 = venerdì. Fasce in ora italiana.
  orari: {
    1: [["09:30", "13:00"], ["14:30", "18:30"]],
    2: [["09:30", "13:00"], ["14:30", "18:30"]],
    3: [["09:30", "13:00"], ["14:30", "18:30"]],
    4: [["09:30", "13:00"], ["14:30", "18:30"]],
    5: [["09:30", "13:00"], ["14:30", "18:30"]],
  } as Record<number, [string, string][]>,
};

import { z, ZodError } from 'zod';

// Array di categorie valide (Necessario per l'enum Zod)
export const SERVICE_CATEGORIES = [
  "FTL Standard",
  "LTL Standard",
  "Espresso Dedicato",
  "Carichi Pesanti",
];

/**
 * Interfaccia/Schema Zod che rispecchia l'interfaccia CompanyOffer e definisce le regole di validazione.
 */
export const CompanyOfferSchema = z.object({
  // --- Proprietà Minime ---
  title: z.string().min(5, "Il titolo deve essere lungo almeno 5 caratteri."),
  category: z.enum(SERVICE_CATEGORIES), 

  // --- Logica Finanziaria e Prestazioni ---
  basePriceKm: z.number().positive("Il prezzo base per km deve essere un valore positivo."),
  maxPayloadKg: z.number().int().min(1000, "Il carico utile minimo è 1000 kg."),
  baseTimeDays: z.number().int().min(1, "Il tempo base di consegna deve essere almeno 1 giorno."),
  vatRatePct: z.number().min(0).max(1, "L'aliquota IVA deve essere tra 0 e 1.").default(0.22),

  // Percentuali di Sovrapprezzo (tra 0 e 1, es. 0.05 per 5%)
  multiStopCostPct: z.number().min(0).max(1, "La percentuale deve essere tra 0 e 1."), 
  satCostPct: z.number().min(0).max(1, "La percentuale deve essere tra 0 e 1."),
  videoCostPct: z.number().min(0).max(1, "La percentuale deve essere tra 0 e 1."),

  // Sicurezza
  insuranceIncludedEuro: z.number().int().min(0, "L'assicurazione inclusa non può essere negativa."),
  
  // Marketing e Vantaggi Aggiuntivi
  isEcoFriendly: z.boolean(),
  fleetAvailabilityPct: z.number().min(0).max(1, "La disponibilità deve essere tra 0 e 1."),
  description: z.string().min(20, "La descrizione è troppo breve."),
});

export { ZodError };
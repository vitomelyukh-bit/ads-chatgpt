import Stripe from "stripe";

let _s: Stripe | null = null;
export const pagamentiAttivi = () => Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_SCHEDA);
export function stripe() {
  if (!_s) _s = new Stripe(process.env.STRIPE_SECRET_KEY!);
  return _s;
}

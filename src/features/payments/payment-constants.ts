export const MAX_PAYMENT = 499;
export const SOLO_FEE_1  = 99;
export const SOLO_FEE_2  = 199;
export const TEAM_FEE    = 299;

export function calculatePayAmount(
  individualCount: number,
  teamCount: number,
): number {
  const total = individualCount + teamCount;
  if (total >= 4) return MAX_PAYMENT;

  let amount = 0;
  if (individualCount === 1)     amount += SOLO_FEE_1;
  else if (individualCount >= 2) amount += SOLO_FEE_2;

  amount += teamCount * TEAM_FEE;

  return Math.min(amount, MAX_PAYMENT);
}

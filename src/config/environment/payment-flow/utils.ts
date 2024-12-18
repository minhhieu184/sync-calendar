import BN from 'bn.js'

export function planckFromWND(amount: number): BN {
  return new BN(amount * 10 ** 12)
}

export function planckFromDOT(amount: number): BN {
  return new BN(amount * 10 ** 10)
}

export function planckFromKSM(amount: number): BN {
  return new BN(amount * 10 ** 12)
}

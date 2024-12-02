export const decimalPrecision = {
  // Decimal round (half away from zero)
  round: function (num: number, decimalPlaces: number) {
    const p = Math.pow(10, decimalPlaces || 0)
    const n = num * p * (1 + Number.EPSILON)
    return Math.round(n) / p
  },
  // Decimal ceil
  ceil: function (num: number, decimalPlaces: number) {
    const p = Math.pow(10, decimalPlaces || 0)
    const n = num * p * (1 - Math.sign(num) * Number.EPSILON)
    return Math.ceil(n) / p
  },
  // Decimal floor
  floor: function (num: number, decimalPlaces: number) {
    const p = Math.pow(10, decimalPlaces || 0)
    const n = num * p * (1 + Math.sign(num) * Number.EPSILON)
    return Math.floor(n) / p
  },
  // Decimal trunc
  trunc: function (num: number, decimalPlaces: number) {
    return (num < 0 ? this.ceil : this.floor)(num, decimalPlaces)
  },
  // Format using fixed-point notation
  toFixed: function (num: number, decimalPlaces: number) {
    return this.round(num, decimalPlaces).toFixed(decimalPlaces)
  }
}

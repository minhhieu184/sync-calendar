export const uncapitalize = <T extends string>(s: T): Uncapitalize<T> =>
  (s.charAt(0).toLowerCase() + s.slice(1)) as Uncapitalize<T>

import { generateSlug } from './generateSlug'

export function searchWhere(field: string, value: string) {
  const containsName = generateSlug(value)
  // const ftsName = containsName.replaceAll(' ', '&')  // Postgres
  const ftsName = '+' + containsName.split(' ').join(' +') // MySQL

  return [
    {
      [field]: {
        search: ftsName
        // mode: 'insensitive' // Postgres
      }
    },
    {
      [field]: {
        contains: containsName
        // mode: 'insensitive'  // Postgres
      }
    }
  ]
}

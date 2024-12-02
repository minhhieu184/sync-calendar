import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { DefaultFindAllQuerySchema } from './query.dto'

export const SEARCH_FIELD_DEFAULT = 'slug'

export const SearchSchema = z
  .object({ search: z.string() })
  .merge(DefaultFindAllQuerySchema)

export class SearchDto extends createZodDto(SearchSchema) {}

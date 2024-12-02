import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const SEARCH_FIELD_DEFAULT = 'slug'

export const DefaultFindAllQuerySchema = z
  .object({
    fields: z.string(),
    sort: z.string(),
    page: z.coerce.number().int().min(1),
    take: z.coerce.number().int().min(1),
    search: z.string().min(1).max(255)
  })
  .partial()

export class DefaultFindAllQueryDto extends createZodDto(
  DefaultFindAllQuerySchema
) {}

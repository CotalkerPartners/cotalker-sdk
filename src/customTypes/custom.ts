import { z } from 'zod'
    
export const genericQueryParams = z.object({
  page: z.number(),
  limit: z.number(),
  count: z.boolean(),
  isActive: z.union([z.literal('true'), z.literal('false'), z.literal('all')]),
}).partial().strict()
    
export const dateQueryParams = z.object({
  modified: z.date(),
  modified_gt: z.date(),
  modified_gte: z.date(),
  modified_lt: z.date(),
  modified_lte: z.date(),
  created: z.date(),
  created_gt: z.date(),
  creatd_gte: z.date(),
  created_lt: z.date(),
  created_lte: z.date(),
}).partial().strict()
    
export const objectId = z.string().regex(new RegExp('^[a-fA-F0-9]{24}$'))
  
export type GenericQueryParams = z.infer<typeof genericQueryParams>
export type DateQueryParams = z.infer<typeof dateQueryParams>
export type ObjectId = z.infer<typeof objectId>

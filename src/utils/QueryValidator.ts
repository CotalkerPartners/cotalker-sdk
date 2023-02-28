export function queryValidator(querySchema, query) {
  try { 
    querySchema.parse(query)
  } catch (err) {
    throw new Error(err.message)
  }
}

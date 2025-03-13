import express from 'express'
import Logger from './Logger'

export const handlerWrap = (handler: express.RequestHandler): express.RequestHandler => async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    await handler(req, res, next);
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal server error', message: String(e) });
  }
}

export const lambdaWrap = (handler): express.RequestHandler => async (req: express.Request, res: express.Response) => {
  const logger = new Logger(req.method, req.path)
  try {
    let manualEnd = false
    let endData = ''
    const writeResponse = (s?: string, headers?: Record<string, string>) => {
      if (!manualEnd) {
        if (headers) Object.entries(headers).forEach(([k,v])=>res.setHeader(k,v))
        else res.setHeader('Content-Type', 'application/json')
      }
      manualEnd = true
      res.write(s??' ')
    }
    const endResponse = (s?: string) => (endData = s ?? '')
    const event = {
      queryStringParameters: req.query,
      pathParameters: req.params,
      headers: req.headers,
      body: req.body,
      logger,
      writeResponse,
      endResponse,
    }

    const response = await handler(event)

    if ((!manualEnd) && (!response || !response.headers)) response.headers = { 'Content-Type': 'application/json' };
    logger.end(response?.statusCode || 200)
    switch (response?.headers['Content-Type']) {
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        res.writeHead(200, {
          ...response.headers
        })
        res.end(response.body, 'base64')
        break
      case 'text/html':
        res.status(response.statusCode).header(response.headers).send(response.body);
        break
      case 'application/json':
      default:
        if (manualEnd) res.end(endData)
        else res.status(response.statusCode).header(response.headers).json(response.body);
        break
    }
  } catch (e) {
    logger.error(e)
    logger.end(500)
    res.status(500).json({ error: 'Internal server error', message: String(e) });
  }
}

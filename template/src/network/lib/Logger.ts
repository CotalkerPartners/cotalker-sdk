import crypto from 'node:crypto'

type logRegistry = {
  start: Date
  duration: number
  endpoint: string
  result: number
  errors: string[]
}
/*
This class will store the last stats for recent API calls to get statistics
*/
class LogStats {
  private maxSize: number;
  private cache: Map<string, logRegistry>;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.cache = new Map<string, logRegistry>();
  }

  get(key: string): logRegistry | null {
    if (this.cache.has(key)) {
      // Remove and re-add the item to the cache to make it the most recently used
      const value = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    } else {
      return null;
    }
  }

  set(key: string, value: logRegistry): void {
    // If the cache is already at the max size, delete the least recently used item
    if (this.cache.size === this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    // Add the new item to the cache as the most recently used
    this.cache.set(key, value);
  }

  toArray(): logRegistry[] {
    return Array.from(this.cache.values());
  }
}


export default class Logger {
  static logStats = new LogStats(1000) 
  private id = crypto.randomBytes(8).toString('hex')
  private start = Date.now()
  private errorMessages: string[] = []
  constructor(
    private method: string,
    private endpoint: string,
  ) {
    console.info(this._baseLog(`BEGIN ${this.method} ${this.endpoint}`))
  }
  private _baseLog(content: string) {
    return `[${(new Date()).toISOString()} ${this.id}] ${content}`
  }
  public error(content: string | Error) {
    this.errorMessages.push(String(content).slice(0, 1000))
    console.error(`${this._baseLog('❌'+String(content))}`)
  }
  public war(content: string) {
    console.warn(`${this._baseLog('⚠️'+content)}`)
  }
  public info(content: string) {
    console.info(`${this._baseLog('📰'+content)}`)
  }
  public end(statusCode: number) {
    const duration = Date.now() - this.start
    const start = new Date(this.start)
    const endpoint = `${this.method} ${this.endpoint}`
    Logger.logStats.set(this.id, {
      duration, start, endpoint, result: statusCode,
      errors: this.errorMessages
    })
    console.info(this._baseLog(`END ${endpoint} Result:${statusCode} Duration:${duration}ms`))
  }
}

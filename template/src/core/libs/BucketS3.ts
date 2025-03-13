import {
  S3Client,
  GetObjectCommand,
  ListObjectsCommand,
  ListObjectsCommandInput,
  ListObjectsCommandOutput
  ,
  ListBucketsCommand,
  ListBucketsCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  PutObjectCommandInput,
  DeleteObjectCommandInput,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { Readable } from 'stream'

const REGION = process.env.AWS_REGION ?? 'us-east-1'

export default class BucketS3 {
  private _client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESSKEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESSKEY,
    },
  })
  bucket: string = process.env.AWS_S3_BUCKET_NAME
  constructor(bucket?: string, client?: S3Client) {
    if (bucket) this.bucket = bucket
    if (client) this._client = client
  }
  
  async listBuckets(): Promise<void> {
    try {
      const data: ListBucketsCommandOutput = await this._client.send(new ListBucketsCommand({}))
      console.log(data.Buckets.map(b=>b.Name))
    } catch (error) {
      console.error(error)
    }
  }
  
  async getObject(name: string): Promise<Buffer | void> {
    try {
      const chunks = []
      const data = await this._client.send(new GetObjectCommand({
        Bucket: this.bucket,
        Key: name
      }))
      return new Promise((resolve, reject) => {
        (data.Body as Readable)
        .on('data', (chunk: Buffer) => chunks.push(chunk))
        .on('error', reject)
        .on('end', () => resolve(Buffer.concat(chunks)))
      })
    } catch (error) {
      console.error(error)
      return
    }
  }
  
  async listObjects(): Promise<ListObjectsCommandOutput> {
    try {
      const data = await this._client.send(new ListObjectsCommand({
        Bucket: this.bucket
      }))
      return data
    } catch (error) {
      console.error(error)
      return
    }
  }
  
  async uploadObject(objectName: string, objectDataBuffer: Buffer, contentType?: string): Promise<PutObjectCommandOutput> {
    try {
      const config: PutObjectCommandInput = {
        Bucket: this.bucket,
        Key: objectName,
        Body: objectDataBuffer,
      }
      if (contentType) config.ContentType = contentType
      const data = await this._client.send(new PutObjectCommand(config))
      console.info(`🎯 ${(new Date()).toISOString()} UPLOADED ${objectName} - STATUS:${data.$metadata.httpStatusCode ?? 0} - ATTEMPTS ${data.$metadata.attempts}`)
      return data
    } catch (error) {
      console.error(error)
      return
    }
  }
  
  async deleteObject(key: string) {
    try {
      const config: DeleteObjectCommandInput = {
        Bucket: this.bucket,
        Key: key,
      }
      const data = await this._client.send(new DeleteObjectCommand(config))
      if (data.$metadata.httpStatusCode === 204) console.info('DELETED - ',key)
    } catch (error) {
      console.error(error)
      return
    }
  }
  async deleteObjectByPrefix(prefix: string) {
    try {
      const listParams: ListObjectsCommandInput = {
        Bucket: this.bucket,
        Prefix: prefix,
      }
      const listObjectsData = await this._client.send(new ListObjectsCommand(listParams))
      if (listObjectsData.Contents && listObjectsData.Contents.length > 0) {
        const deletePromises = listObjectsData.Contents.map((object) =>this.deleteObject(object.Key))
        await Promise.all(deletePromises)
        console.info(`Deleted all objects with prefix '${prefix}'`)
      } else {
        console.info(`No objects found with prefix '${prefix}'`)
      }
    } catch (error) {
      console.error(error);
    }
  }  
}

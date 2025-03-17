import {
	S3Client,
	GetObjectCommand,
	ListObjectsCommand,
	ListObjectsCommandOutput,
	PutObjectCommand,
	PutObjectCommandOutput
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

const REGION = process.env.AWS_REGION ?? "us-east-1";

export default class BucketS3 {
	private _client = new S3Client({
		region: REGION,
		credentials: {
			accessKeyId: process.env.AWS_S3_ACCESSKEY_ID,
			secretAccessKey: process.env.AWS_S3_SECRET_ACCESSKEY
		}
	});
	bucket: string = process.env.AWS_S3_BUCKET_NAME;
	constructor(bucket?: string, client?: S3Client) {
		if (bucket) this.bucket = bucket;
		if (client) this._client = client;
	}

	async getObject(name: string): Promise<Buffer | void> {
		try {
			const chunks = [];
			const data = await this._client.send(
				new GetObjectCommand({
					Bucket: this.bucket,
					Key: name
				})
			);
			return new Promise((resolve, reject) => {
				(data.Body as Readable)
					.on("data", (chunk: Buffer) => chunks.push(chunk))
					.on("error", reject)
					.on("end", () => resolve(Buffer.concat(chunks)));
			});
		} catch (error) {
			console.error(error);
			return;
		}
	}

	async listObjects(): Promise<ListObjectsCommandOutput> {
		try {
			const data = await this._client.send(
				new ListObjectsCommand({
					Bucket: this.bucket
				})
			);
			return data;
		} catch (error) {
			console.error(error);
			return;
		}
	}

	async uploadObject(
		objectName: string,
		objectDataBuffer: Buffer
	): Promise<PutObjectCommandOutput> {
		try {
			const data = await this._client.send(
				new PutObjectCommand({
					Bucket: this.bucket,
					Key: objectName,
					Body: objectDataBuffer
				})
			);
			return data;
		} catch (error) {
			console.error(error);
			return;
		}
	}
}

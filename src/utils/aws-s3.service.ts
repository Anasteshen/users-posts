import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StreamingBlobPayloadOutputTypes } from '@smithy/types';
@Injectable()
export class AwsS3Service {
  private client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: this.configService.get<string>('awsS3.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('awsS3.accessKeyId'),
        secretAccessKey: this.configService.get<string>(
          'awsS3.secretAccessKey',
        ),
      },
      endpoint: this.configService.get<string>('localStack.endpoint'),
      forcePathStyle: true,
    });
  }

  async uploadedFile(
    dataBuffer: Buffer,
    filename: string,
    mimeType: string,
  ): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.configService.get('awsS3.bucket'),
        Body: dataBuffer,
        Key: filename,
        ContentType: mimeType,
      });

      await this.client.send(command);
    } catch (error) {
      console.log('Error uploading file: ', {
        message: error.message,
        stack: error.stack,
      });
    }
  }

  async getFile(key: string): Promise<StreamingBlobPayloadOutputTypes> {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('awsS3.bucket'),
      Key: key,
    });

    const result = await this.client.send(command);
    return result.Body;
  }
}

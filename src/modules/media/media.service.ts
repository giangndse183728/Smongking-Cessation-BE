import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getNameFromFullname, handleImageFiles } from '@common/utils/files';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { createReadStream } from 'fs';
import { Fields, File } from 'formidable';
import { ConfigService } from '@nestjs/config';
import vision from '@google-cloud/vision';

@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImages(req: Request): Promise<{ url: string }[]> {
    const { files, fields }: { files: File[]; fields: Fields } =
      await handleImageFiles(req);
    const visionClient = new vision.ImageAnnotatorClient();
    const result = await Promise.all(
      files.map(async (image: File) => {

        // Analyze image with Google Vision 
        const [safeSearchResult] = await visionClient.safeSearchDetection(image.filepath);
        console.log('SafeSearchDetection result:', safeSearchResult);
        const { adult, violence, racy, medical, spoof } = safeSearchResult.safeSearchAnnotation || {};
        if (
          adult === 'LIKELY' || adult === 'VERY_LIKELY' ||
          violence === 'LIKELY' || violence === 'VERY_LIKELY' ||
          racy === 'LIKELY' || racy === 'VERY_LIKELY' ||
          medical === 'VERY_LIKELY' ||
          spoof === 'VERY_LIKELY'
        ) {
          throw new BadRequestException('Inappropriate image content detected (adult, violence, racy, medical, or spoof)');
        }
        // Upload to S3
        const folderName = Array.isArray(fields.folder)
          ? fields.folder[0]
          : fields.folder || 'default';
        const fileName = `${folderName}/${getNameFromFullname(image.originalFilename!)}-${image.newFilename}`;
        const fileStream = createReadStream(image.filepath);
        const client = new S3Client({
          region: this.configService.getOrThrow<string>('REGION'),
          credentials: {
            accessKeyId: this.configService.getOrThrow<string>('ACCESS_KEY_ID'),
            secretAccessKey:
              this.configService.getOrThrow<string>('SECRET_ACCESS_KEY'),
          },
        });
        const params = {
          Bucket: this.configService.getOrThrow<string>('BUCKET'),
          Key: fileName,
          Body: fileStream,
          ContentType: 'image/jpeg',
        };
        const command = new PutObjectCommand(params);
        await client.send(command);
        const url = `https://${process.env.BUCKET!}.s3.${process.env.REGION!}.amazonaws.com/${fileName}`;
        return { url };
      }),
    );
    return result;
  }
}

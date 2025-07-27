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
  constructor(private readonly configService: ConfigService) { }

  async uploadImages(req: Request): Promise<{ url: string }[]> {
    const { files, fields }: { files: File[]; fields: Fields } =
      await handleImageFiles(req);
    
    const projectId = this.configService.get<string>('GOOGLE_PROJECT_ID');
    const privateKeyId = this.configService.get<string>('GOOGLE_PRIVATE_KEY_ID');
    const privateKey = this.configService.get<string>('GOOGLE_PRIVATE_KEY');
    const clientEmail = this.configService.get<string>('GOOGLE_CLIENT_EMAIL');
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const authUri = this.configService.get<string>('GOOGLE_AUTH_URI');
    const tokenUri = this.configService.get<string>('GOOGLE_TOKEN_URI');
    const authProviderX509CertUrl = this.configService.get<string>('GOOGLE_AUTH_PROVIDER_X509_CERT_URL');
    const clientX509CertUrl = this.configService.get<string>('GOOGLE_CLIENT_X509_CERT_URL');
    
    if (!projectId || !privateKeyId || !privateKey || !clientEmail) {
      throw new Error('Missing required Google Cloud credentials in environment variables');
    }
    
    const credentials = {
      type: 'service_account',
      project_id: projectId,
      private_key_id: privateKeyId,
      private_key: privateKey?.replace(/\\n/g, '\n'),
      client_email: clientEmail,
      client_id: clientId,
      auth_uri: authUri || 'https://accounts.google.com/o/oauth2/auth',
      token_uri: tokenUri || 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: authProviderX509CertUrl || 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: clientX509CertUrl,
      universe_domain: 'googleapis.com'
    };
    const visionClient = new vision.ImageAnnotatorClient({ credentials });
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

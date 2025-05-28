import { AccessTokenGuard } from '@modules/auth/guards/access-token.guard';
import { Controller, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Media')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-images')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        folder: {
          type: 'string',
          example: 'avatar',
        },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Upload images successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async uploadImages(@Req() req: Request) {
    return this.mediaService.uploadImages(req);
  }
}

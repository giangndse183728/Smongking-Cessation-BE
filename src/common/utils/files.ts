import { KILOBYTE, MEDIA_TYPE } from '@common/constants/enum';
import { MEDIA_MESSAGES } from '@common/constants/messages';
import { UnprocessableEntityException } from '@nestjs/common';
import { Request } from 'express';
import formidable, {
  EmitData,
  Fields,
  File,
  errors as formidableErrors,
} from 'formidable';

export async function handleImageFiles(req: Request) {
  const form = formidable({
    keepExtensions: true,
    maxFileSize: 300 * KILOBYTE * 4,
    maxFiles: 10,
    allowEmptyFiles: false,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid =
        name === MEDIA_TYPE.IMAGES && Boolean(mimetype?.includes('image/'));

      if (!valid) {
        form.emit(
          'error' as any,
          {
            formname: 'upload',
            name: 'file',
            value: MEDIA_MESSAGES.INVALID_FILE_TYPE,
          } as EmitData,
        );
      }
      return valid;
    },
  });

  return new Promise<{
    files: File[];
    fields: Fields;
  }>((resolve, reject) => {
    form.parse(
      req,
      (
        err: Error | null,
        fields: formidable.Fields,
        files: formidable.Files,
      ) => {
        if (err) {
          return reject(
            new UnprocessableEntityException(MEDIA_MESSAGES.INVALID_FILE_TYPE),
          );
        }
        if (!files.images || files.images.length === 0) {
          return reject(
            new UnprocessableEntityException(MEDIA_MESSAGES.IMAGES_NOT_EMPTY),
          );
        }

        return resolve({ files: files.images as File[], fields });
      },
    );
  });
}

export const getNameFromFullname = (filename: string) => {
  const nameArr = filename.split('.');
  nameArr.pop();
  return nameArr.join('-').replace(' ', '-');
};

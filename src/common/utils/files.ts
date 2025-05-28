import { KILOBYTE, MEDIA_TYPE } from '@common/constants/enum';
import { MEDIA_MESSAGES } from '@common/constants/messages';
import { Request } from 'express';
import formidable, { Fields, File } from 'formidable';

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
          new Error(MEDIA_MESSAGES.INVALID_FILE_TYPE) as any,
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
          return reject(err);
        }
        if (!files.images) {
          return reject(new Error(MEDIA_MESSAGES.IMAGES_NOT_EMPTY));
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

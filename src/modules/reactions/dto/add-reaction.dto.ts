import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { addReactionSchema } from '../schema/add-reaction.schema';

export class addReactionDto extends createZodDto(addReactionSchema) {
  @ApiProperty({
    example: '007456f9-5d43-4346-a02b-ca83ca4c7f40',
    description: 'Post id',
  })
  ref_id: string;
  @ApiProperty({
    example: 'LIKE',
    description: 'Reaction type',
  })
  type: string;
}

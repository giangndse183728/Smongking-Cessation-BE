import { Controller, Get, Post, Body } from '@nestjs/common';
import { MotivationService } from './motivation.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MotivationResponseDto } from './dto/motivation-response.dto';
import { SendMessageDto, ChatResponseDto } from './dto/chat-message.dto';

@ApiTags('Motivation')
@Controller('motivation')
export class MotivationController {
  constructor(private readonly motivationService: MotivationService) {}

  @Get('message')
  @ApiOperation({ summary: 'Get the current motivational message' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current motivational message',
    type: MotivationResponseDto,
  })
  async getMotivationalMessage(): Promise<MotivationResponseDto> {
    return this.motivationService.getCurrentMotivationalMessage();
  }

  @Post('chat')
  @ApiOperation({ summary: 'Send a message to the AI coach' })
  @ApiResponse({
    status: 200,
    description: 'Returns the AI response',
    type: ChatResponseDto,
  })
  async chatWithAI(@Body() sendMessageDto: SendMessageDto): Promise<ChatResponseDto> {
    return this.motivationService.chatWithAI(sendMessageDto.message);
  }
} 
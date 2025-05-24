import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly openaiApiKey: string;
  private readonly openaiApiUrl: string;
  private readonly modelAi: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    this.openaiApiUrl = process.env.OPENAI_API_URL || '';
    this.modelAi = process.env.OPENAI_MODEL || ''
  }

  async generateMotivationalMessage(): Promise<string> {
    try {
      const response = await axios.post(
        this.openaiApiUrl,
        {
          model: this.modelAi,
          messages: [
            {
              role: 'system',
              content: 'You are a motivational coach helping people quit smoking. Generate a short, encouraging message.',
            },
            {
              role: 'user',
              content: 'Generate a motivational message for someone trying to quit smoking.',
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      this.logger.error('Failed to generate message from AI service', error.message);
      throw error;
    }
  }

  async generateChatResponse(userMessage: string): Promise<string> {
    try {
      const response = await axios.post(
        this.openaiApiUrl,
        {
          model: this.modelAi,
          messages: [
            {
              role: 'system',
              content: 'You are a supportive AI coach helping people quit smoking. Provide empathetic, practical advice and encouragement.',
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      this.logger.error('Failed to generate chat response', error.message);
      throw error;
    }
  }
} 
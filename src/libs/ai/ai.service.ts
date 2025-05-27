import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface QuitPlanPhaseAI {
  phase_number: number;
  limit_cigarettes_per_day: number;
  duration_days: number;
  start_date: Date;
  expected_end_date: Date;
  description: string;
}

export interface SmokingHabitsData {
  cigarettes_per_day: number;
  smoking_years: number;
  triggers: string[];
  health_issues: string;
}

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

  async generateQuitPlanPhases(
    planType: string, 
    currentCigarettesPerDay: number,
    startDate: Date,
    targetDays?: number
  ): Promise<QuitPlanPhaseAI[]> {
    try {
      const systemPrompt = `You are an expert smoking cessation coach. Generate a structured quit smoking plan with multiple phases.

Plan Type: ${planType}
Current cigarettes per day: ${currentCigarettesPerDay}
Start date: ${startDate.toISOString().split('T')[0]}
${targetDays ? `Target duration: ${targetDays} days` : ''}

Generate a JSON array of phases with the following structure:
[
  {
    "phase_number": 1,
    "limit_cigarettes_per_day": number,
    "duration_days": number,
    "description": "Brief description of this phase"
  }
]

Rules:
1. Each phase should gradually reduce cigarettes
2. Phase 1 should start with slightly less than current amount
3. Final phase should be 0 cigarettes
4. Total phases should be 3-6 phases
5. Each phase duration should be realistic (5-14 days)
6. Reduction should be gradual and achievable
7. Return only valid JSON array, no extra text`;

      const response = await axios.post(
        this.openaiApiUrl,
        {
          model: this.modelAi,
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `Create a ${planType} quit smoking plan for someone smoking ${currentCigarettesPerDay} cigarettes per day.`,
            },
          ],
          max_tokens: 500,
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content.trim();
      const phases = JSON.parse(aiResponse);
      
      // Convert to proper format with dates
      let currentStartDate = new Date(startDate);
      
      return phases.map((phase: any, index: number) => {
        const phaseStartDate = new Date(currentStartDate);
        const phaseEndDate = new Date(currentStartDate);
        phaseEndDate.setDate(phaseEndDate.getDate() + phase.duration_days);
        
        const result: QuitPlanPhaseAI = {
          phase_number: index + 1,
          limit_cigarettes_per_day: phase.limit_cigarettes_per_day,
          duration_days: phase.duration_days,
          start_date: phaseStartDate,
          expected_end_date: phaseEndDate,
          description: phase.description,
        };
        
        // Move to next phase start date
        currentStartDate.setDate(currentStartDate.getDate() + phase.duration_days);
        
        return result;
      });

    } catch (error) {
      this.logger.error('Failed to generate quit plan phases', error.message);
      
      // Fallback to default phases if AI fails
      return this.generateDefaultPhases(currentCigarettesPerDay, startDate);
    }
  }

  private generateDefaultPhases(currentCigarettesPerDay: number, startDate: Date): QuitPlanPhaseAI[] {
    const phases: QuitPlanPhaseAI[] = [];
    let currentStartDate = new Date(startDate);
    
    // Generate 4 default phases
    const reductions = [
      Math.ceil(currentCigarettesPerDay * 0.7), // 30% reduction
      Math.ceil(currentCigarettesPerDay * 0.4), // 60% reduction  
      Math.ceil(currentCigarettesPerDay * 0.2), // 80% reduction
      0 // Complete quit
    ];
    
    reductions.forEach((limit, index) => {
      const duration = index === reductions.length - 1 ? 14 : 7; // Last phase longer
      const phaseStartDate = new Date(currentStartDate);
      const phaseEndDate = new Date(currentStartDate);
      phaseEndDate.setDate(phaseEndDate.getDate() + duration);
      
      phases.push({
        phase_number: index + 1,
        limit_cigarettes_per_day: limit,
        duration_days: duration,
        start_date: phaseStartDate,
        expected_end_date: phaseEndDate,
        description: `Phase ${index + 1}: Reduce to ${limit} cigarettes per day`,
      });
      
      currentStartDate.setDate(currentStartDate.getDate() + duration);
    });
    
    return phases;
  }

  async generateSmokingHabitsFeedback(smokingHabitsData: SmokingHabitsData): Promise<string> {
    try {
      const prompt = `Based on the following smoking habits:
      - Cigarettes per day: ${smokingHabitsData.cigarettes_per_day}
      - Years of smoking: ${smokingHabitsData.smoking_years}
      - Triggers: ${smokingHabitsData.triggers.join(', ')}
      - Health issues: ${smokingHabitsData.health_issues}
      
      Please provide personalized advice and encouragement to help quit smoking.`;

      const response = await axios.post(
        this.openaiApiUrl,
        {
          model: this.modelAi,
          messages: [
            {
              role: 'system',
              content: 'You are a supportive AI coach helping people quit smoking. Provide empathetic, practical advice and encouragement based on their smoking habits.',
            },
            {
              role: 'user',
              content: prompt,
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
      this.logger.error('Failed to generate smoking habits feedback', error.message);
      throw error;
    }
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
          max_tokens: 80,
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
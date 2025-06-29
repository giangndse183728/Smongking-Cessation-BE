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
  cigarettes_per_pack: number;
  price_per_pack: number;
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
    this.modelAi = process.env.OPENAI_MODEL || '';
  }

  async generateQuitPlanPhases(
    planType: string,
    smokingHabits: SmokingHabitsData,
    startDate: Date,
  ): Promise<QuitPlanPhaseAI[]> {
    try {
      const systemPrompt = `You are an expert smoking cessation coach. Generate a structured quit smoking plan with multiple phases based on detailed smoking habits.

Plan Type: ${planType}
Current cigarettes per day: ${smokingHabits.cigarettes_per_day}
Smoking years: ${smokingHabits.smoking_years}
Cigarettes per pack: ${smokingHabits.cigarettes_per_pack}
Price per pack: $${smokingHabits.price_per_pack}
Triggers: ${smokingHabits.triggers.join(', ')}
Health issues: ${smokingHabits.health_issues}
Start date: ${startDate.toISOString().split('T')[0]}

Generate a JSON array of phases with the following structure:
[
  {
    "phase_number": 1,
    "limit_cigarettes_per_day": number,
    "duration_days": number,
    "description": "Brief description of this phase focusing on specific triggers and health benefits"
  }
]

Rules:
1. Consider smoking history and triggers when creating phases
2. For heavy smokers (>20/day) or long-term smokers (>10 years), create more gradual reduction
3. For aggressive plan: faster reduction with shorter phases
4. For slow plan: gentler reduction with longer phases  
5. For standard plan: balanced approach
6. Phase 1 should start with 10-20% reduction from current amount
7. Final phase should be 0 cigarettes
8. Total phases should be 3-5 phases based on smoking intensity
9. Each phase duration should be realistic (5-21 days based on plan type)
10. Address specific triggers mentioned in description
11. Return only valid JSON array, no extra text`;

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
              content: `Create a ${planType} quit smoking plan for someone with these smoking habits: ${smokingHabits.cigarettes_per_day} cigarettes/day for ${smokingHabits.smoking_years} years, triggers: ${smokingHabits.triggers.join(', ')}, health issues: ${smokingHabits.health_issues}`,
            },
          ],
          max_tokens: 800,
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const aiResponse = response.data.choices[0].message.content.trim();
      const phases = JSON.parse(aiResponse);

      const currentStartDate = new Date(startDate);

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

        currentStartDate.setDate(
          currentStartDate.getDate() + phase.duration_days,
        );

        return result;
      });
    } catch (error) {
      this.logger.error('Failed to generate quit plan phases', error.message);

      return this.generateDefaultPhases(
        smokingHabits.cigarettes_per_day,
        startDate,
        planType,
      );
    }
  }

  private generateDefaultPhases(
    currentCigarettesPerDay: number,
    startDate: Date,
    planType: string,
  ): QuitPlanPhaseAI[] {
    const phases: QuitPlanPhaseAI[] = [];
    const currentStartDate = new Date(startDate);

    let reductionRates: number[];
    let phaseDurations: number[];

    switch (planType.toLowerCase()) {
      case 'aggressive':
        reductionRates = [0.6, 0.3, 0.1, 0]; // Faster reduction
        phaseDurations = [5, 5, 7, 14];
        break;
      case 'slow':
        reductionRates = [0.8, 0.6, 0.4, 0.2, 0.1, 0]; // Gentler reduction
        phaseDurations = [10, 10, 14, 14, 14, 21];
        break;
      default: // standard
        reductionRates = [0.7, 0.4, 0.2, 0]; // Balanced approach
        phaseDurations = [7, 7, 10, 14];
    }

    const reductions = reductionRates.map((rate) =>
      rate === 0 ? 0 : Math.ceil(currentCigarettesPerDay * rate),
    );

    reductions.forEach((limit, index) => {
      const duration = phaseDurations[index];
      const phaseStartDate = new Date(currentStartDate);
      const phaseEndDate = new Date(currentStartDate);
      phaseEndDate.setDate(phaseEndDate.getDate() + duration);

      phases.push({
        phase_number: index + 1,
        limit_cigarettes_per_day: limit,
        duration_days: duration,
        start_date: phaseStartDate,
        expected_end_date: phaseEndDate,
        description: `Phase ${index + 1}: ${limit === 0 ? 'Complete quit - Stay smoke-free' : `Reduce to ${limit} cigarettes per day`}`,
      });

      currentStartDate.setDate(currentStartDate.getDate() + duration);
    });

    return phases;
  }

  async generateSmokingHabitsFeedback(
    smokingHabitsData: SmokingHabitsData,
  ): Promise<string> {
    try {
      const prompt = `Based on the following smoking habits:
      - Cigarettes per day: ${smokingHabitsData.cigarettes_per_day}
      - Years of smoking: ${smokingHabitsData.smoking_years}
      - Cigarettes per pack: ${smokingHabitsData.cigarettes_per_pack}
      - Price per pack: $${smokingHabitsData.price_per_pack}
      - Triggers: ${smokingHabitsData.triggers.join(', ')}
      - Health issues: ${smokingHabitsData.health_issues}
      
      Please provide personalized advice and encouragement to help quit smoking, including financial and health benefits.`;

      const response = await axios.post(
        this.openaiApiUrl,
        {
          model: this.modelAi,
          messages: [
            {
              role: 'system',
              content:
                'You are a supportive AI coach helping people quit smoking. Provide empathetic, practical advice and encouragement based on their detailed smoking habits.',
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
        },
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      this.logger.error(
        'Failed to generate smoking habits feedback',
        error.message,
      );
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
              content:
                'You are a motivational coach helping people quit smoking. Generate a short, encouraging message.',
            },
            {
              role: 'user',
              content: 'Give me a short motivational message for someone quitting smoking.'
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
        },
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      this.logger.error(
        'Failed to generate message from AI service',
        error.message,
      );
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
              content:
                'You are a supportive AI coach helping people quit smoking. Provide empathetic, practical advice and encouragement.',
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
        },
      );

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      this.logger.error('Failed to generate chat response', error.message);
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';

@Injectable()
export class LiveKitService {
  private readonly livekitHost = process.env.LIVEKIT_URL;
  private readonly apiKey = process.env.LIVEKIT_API_KEY;
  private readonly apiSecret = process.env.LIVEKIT_API_SECRET;

  async createToken(roomName: string, participantName: string): Promise<string> {
    if (!this.apiKey || !this.apiSecret || !this.livekitHost) {
      throw new Error('LiveKit server environment variables not configured.');
    }

    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity: participantName,
    });

    at.addGrant({ room: roomName, roomJoin: true, canPublish: true, canSubscribe: true });

    return await at.toJwt();
  }
} 
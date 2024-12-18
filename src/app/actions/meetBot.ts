import { auth } from "@/lib/auth";

import { cookies } from 'next/headers';
import puppeteer from 'puppeteer';


interface BotSession {
    id: string;
    meetingUrl: string;
    startTime: string;
    status: 'active' | 'ended';
}

class BotSessionManager {
  private static COOKIE_NAME = 'meet-bot-session';

  static async createSession(meetingUrl: string): Promise<BotSession> {

    const session = await auth();
    if (!session) {
      throw new Error('Unauthorized');
    }

    const urlPattern = /^(https?:\/\/)?(meet\.google\.com\/[a-z0-9-]+)$/i;
    if (!urlPattern.test(meetingUrl)) {
      throw new Error('Invalid Google Meet URL');
    }

    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    await page.goto(meetingUrl, { waitUntil: 'networkidle0' });

    // TODO: Add specific login/join logic for Google Meet

    // fr => await page.click('selector for join button');

    const botSession: BotSession = {
      id: Math.random().toString(36).substring(7),
      meetingUrl,
      startTime: new Date().toISOString(),
      status: 'active'
    };

    const cookieStore = await cookies()
    cookieStore.set({
      name: this.COOKIE_NAME,
      value: JSON.stringify(botSession),
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60
    });

    return botSession;
  }
}

export async function startMeetBot(meetingUrl: string) {
  try {
    const session = await BotSessionManager.createSession(meetingUrl);
    return { 
      success: true, 
      message: 'Bot joined meeting successfully', 
      session 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
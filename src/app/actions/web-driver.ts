import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

class BrowserManager {
  private static instance: BrowserManager | null = null;
  private driver: any;

  static async getInstance(): Promise<BrowserManager> {
    if (!this.instance) {
      this.instance = new BrowserManager();
      await this.instance.createBrowser();
    }
    return this.instance;
  }

  async createBrowser() {
    try {
      const stealthPlugin = StealthPlugin();
      stealthPlugin.enabledEvasions.delete("iframe.contentWindow");
      stealthPlugin.enabledEvasions.delete("media.codecs");
      puppeteer.use(stealthPlugin);

      this.driver = await puppeteer.launch({
        headless: false,
        args: [
          "--disable-blink-features=AutomationControlled",
          "--start-maximized",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--use-fake-device-for-media-stream",
          "--use-file-for-fake-video-capture",
          "--enable-experimental-web-platform-features",
        ],
        defaultViewport: null,
      });
    } catch (error) {
      console.error("Failed to initialize the browser:", error);
      throw error;
    }
  }

  async startScreenRecording() {
    try {
    } catch (error) {
      console.error("Failed to start screen recording:", error);
      throw error;
    }
  }

  async closeBrowser(browser: any) {
    if (browser) {
      await browser.close();
    }
  }

  async getDriver() {
    return this.driver;
  }
}

export async function getBrowserManager() {
  const broewserManager = await BrowserManager.getInstance();
  return broewserManager;
}
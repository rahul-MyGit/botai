import { By, Builder, Browser } from "selenium-webdriver";
import * as fs from "fs-extra";
import path from "path";
import { spawn } from "child_process";
import chrome from "selenium-webdriver/chrome";

interface ScreenRecorderOptions {
  outputDir?: string;
  videoOutput?: string;
  frameRate?: number;
  maxWidth?: number;
  maxHeight?: number;
  debugMode?: boolean;
}

class BrowserInstance {
  private static instance: BrowserInstance | null = null;
  private driver: any;
  private options: Required<ScreenRecorderOptions>;
  private frameIndex: number = 0;
  private isRecording: boolean = false;

  constructor(options: ScreenRecorderOptions = {}) {
    this.options = {
      outputDir: path.resolve("./dns-recordings"),
      videoOutput: path.resolve("./dns-recording.mp4"),
      frameRate: 10,
      maxWidth: 1920,
      maxHeight: 1080,
      debugMode: false,
      ...options,
    };
  }

  static async getInstance(): Promise<BrowserInstance> {
    if (!this.instance) {
      this.instance = new BrowserInstance();
      await this.instance.createBrowser();
    }
    return this.instance;
  }

  private async createBrowser() {
    try {
      const options = new chrome.Options();
      //
      options.addArguments("--disable-blink-features=AutomationControlled");
      options.addArguments("--start-maximized");
      options.setUserPreferences({
        "profile.default_content_setting_values.media_stream_mic": 1,
        "profile.default_content_setting_values.media_stream_camera": 1,
        "profile.default_content_setting_values.geolocation": 0,
        "profile.default_content_setting_values.notifications": 1,
      });
      this.driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .build();
      await (this.driver as any).createCDPConnection("page");
    } catch (error) {
      console.error("Failed to initialize the Selenium WebDriver:", error);
      throw error;
    }
  }

  getDriver() {
    if (!this.driver) {
      throw new Error(
        "Selenium WebDriver not initialized. Call getInstance() first."
      );
    }
    return this.driver;
  }

  async startScreenRecording(): Promise<void> {
    await this.cleanupFrames();

    try {
      // Start screencast using direct CDP method
      const cdpConnection = await (this.driver as any).createCDPConnection(
        "page"
      );

      await (this.driver as any).executeCdpCommand("Page.startScreencast", {
        format: "jpeg",
        quality: 90,
        maxWidth: this.options.maxWidth,
        maxHeight: this.options.maxHeight,
      });

      this.frameIndex = 0;
      this.isRecording = true;

      // Use the driver's event handling for screencast frames
      await (this.driver as any).addCdpListener(
        "Page.screencastFrame",
        async (frameData: any) => {
          if (!this.isRecording) return;

          try {
            const buffer = Buffer.from(frameData.data, "base64");
            const framePath = path.join(
              this.options.outputDir,
              `frame-${String(this.frameIndex).padStart(5, "0")}.jpeg`
            );

            await fs.writeFile(framePath, buffer);
            this.frameIndex++;

            // Acknowledge the frame
            await (this.driver as any).executeCdpCommand(
              "Page.screencastFrameAck",
              {
                sessionId: frameData.sessionId,
              }
            );
          } catch (error) {
            console.error("Failed to save frame:", error);
          }
        }
      );
    } catch (error) {
      console.error("Failed to start screen recording:", error);
      throw error;
    }
  }

  private async cleanupFrames() {
    try {
      await fs.remove(this.options.outputDir);
      await fs.ensureDir(this.options.outputDir);
    } catch (error) {
      console.log("Failed to cleanup frames:", error);
    }
  }

  async stopScreenRecording(): Promise<void> {
    if (!this.isRecording) return;

    await (this.driver as any).sendDevToolsCommand("Page.stopScreencast");
    this.isRecording = false;

    await this.convertFramesToVideo();
  }

  private async convertFramesToVideo(): Promise<void> {
    return new Promise((resolve, reject) => {
      const ffmpegProcess = spawn("ffmpeg", [
        "-framerate",
        this.options.frameRate.toString(),
        "-i",
        path.join(this.options.outputDir, "frame-%05d.jpeg"),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        this.options.videoOutput,
      ]);

      ffmpegProcess.on("close", (code: any) => {
        if (code === 0) {
          console.log(`FFmpeg process exited successfully`);
          resolve();
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`));
        }
      });

      ffmpegProcess.stderr.on("data", (data: any) => {
        console.log(`FFmpeg stderr: ${data}`);
      });
    });
  }
}

export async function getBrowserInstance() {
  const browserInstance = await BrowserInstance.getInstance();
  return browserInstance;
}
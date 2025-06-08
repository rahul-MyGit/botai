import { Builder, By, until, WebDriver } from "selenium-webdriver";
// import chrome from "selenium-webdriver/chrome";
import { getBrowserInstance } from "./selenium-driver";
import { getBrowserManager } from "./web-driver";

async function Glogin(
  driver: WebDriver,
  mailAddress: string,
  password: string
) {
  await driver.get(
    "https://accounts.google.com/ServiceLogin?hl=en&passive=true&continue=https://www.google.com/&ec=GAZAAQ"
  );

  const emailField = await driver.findElement(By.id("identifierId"));
  await emailField.sendKeys(mailAddress);

  const nextButton = await driver.findElement(By.id("identifierNext"));
  await nextButton.click();

  await driver.sleep(2000);

  const passwordField = await driver.findElement(
    By.xpath('//*[@id="password"]/div[1]/div/div[1]/input')
  );
  await passwordField.sendKeys(password);

  const passwordNextButton = await driver.findElement(By.id("passwordNext"));
  await passwordNextButton.click();

  await driver.sleep(2000);

  await driver.get("https://google.com/");
}

async function turnOffMicCam(driver: WebDriver) {
  try {
    await driver.sleep(2000);
    const micButton = await driver.findElement(
      By.xpath(
        '//*[@id="yDmH0d"]/c-wiz/div/div/div[35]/div[4]/div/div[2]/div[4]/div/div/div[1]/div[1]/div/div[6]/div[1]/div/div/div/div[1]'
      )
    );
    await micButton.click();

    await driver.sleep(1000);
    const camButton = await driver.findElement(
      By.xpath(
        '//*[@id="yDmH0d"]/c-wiz/div/div/div[35]/div[4]/div/div[2]/div[4]/div/div/div[1]/div[1]/div/div[6]/div[2]/div/div/div[1]'
      )
    );
    await camButton.click();
  } catch (error) {
    console.error("Failed to turn off mic/camera:", error);
  }
}

async function joinNow(driver: any) {
  const nameInput = await driver.findElement(
    By.className("qdOxv-fmcmS-wGMbrd")
  );

  await nameInput.sendKeys("FireFly AI");
  await driver.sleep(5000);
  const joinButton = await driver.findElement(
    By.xpath(
      '//*[@id="yDmH0d"]/c-wiz/div/div/div[35]/div[4]/div/div[2]/div[4]/div/div/div[2]/div[1]/div[2]/div[1]/div/div'
    )
  );
  await joinButton.click();
}

async function joinNowPup(page: any) {
  try {
    // Wait for the name input to be available
    await page.waitForSelector(".qdOxv-fmcmS-wGMbrd", { visible: true });

    // Type the name
    await page.type(".qdOxv-fmcmS-wGMbrd", "FireFly AI");

    // Wait for 5 seconds
    await page.evaluate(
      () => new Promise((resolve) => setTimeout(resolve, 5000))
    );

    console.log("Attempting to join the meeting...");

    await page.click("UywwFc-kBDsod-Rtc0Jf UywwFc-kBDsod-Rtc0Jf-OWXEXe-M1Soyc");

    // Locate the join button using XPath
    // const joinButton = await page.$$(
    //   'xpath=//*[@id="yDmH0d"]/c-wiz/div/div/div[35]/div[4]/div/div[2]/div[4]/div/div/div[2]/div[1]/div[2]/div[1]/div/div'
    // );

    // if (joinButton.length > 0) {
    //   // Click the join button
    //   await joinButton[0].evaluate((button: any) => button.click());

    //   console.log("Clicked the join button");
    // } else {
    //   console.error("Join button not found");
    // }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// (async function main() {
//   const browser = await getBrowserInstance();
//   const driver = browser.getDriver();

//   try {
//     const mailAddress = "sukshamever@gmail.com";
//     const password = "geeksforgeeks";

//     // await Glogin(driver, mailAddress, password);

//     await driver.get("https://meet.google.com/kvg-wggx-ure");

//     // await turnOffMicCam(driver);

//     // await joinNow(driver);

//     try {
//       await browser.startScreenRecording();
//     } catch (error) {
//       console.error("Failed to start screen recording:", error);
//     }

//     await driver.sleep(10000);
//   } catch (error) {
//     console.error("Failed to join the meeting:", error);
//   }
// })();

async function main() {
  const browser = await getBrowserManager();
  const driver = await browser.getDriver();

  const page = await driver.newPage();
  await page.goto("https://meet.google.com/kvg-wggx-ure");

  await page.evaluate(() => {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      get: () => ({
        ...navigator.mediaDevices,
        getUserMedia: async (constraints: any) => {
          return Promise.resolve(new MediaStream());
        },
      }),
    });
  });

  await joinNowPup(page);
}

main();
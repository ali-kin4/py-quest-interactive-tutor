import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const server = spawn("python3",["-m","http.server","8000","--bind","127.0.0.1"],{
  cwd:root.pathname,
  stdio:["ignore","pipe","pipe"]
});
let browser;
async function waitForServer() {
  for(let i=0;i<40;i++) {
    try { const response=await fetch("http://127.0.0.1:8000/"); if(response.ok) return; } catch {}
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  throw new Error("Local preview server did not start.");
}
async function check(assertion,message){if(!assertion)throw new Error(message);}
async function main(){
  await mkdir("screenshots",{recursive:true});
  await waitForServer();
  browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  const page=await browser.newPage({viewport:{width:1440,height:950},deviceScaleFactor:1});
  const errors=[];
  page.on("pageerror",error=>errors.push(String(error.message)));
  await page.goto("http://127.0.0.1:8000/",{waitUntil:"domcontentloaded"});
  await page.getByRole("heading",{name:/Good to see you/}).waitFor();
  await page.screenshot({path:"screenshots/01-dashboard-desktop.png",fullPage:true});
  await page.locator('[data-nav="courses"]').click();
  await check(await page.locator(".lesson-tile").count()===12,"Expected 12 course lessons");
  await page.screenshot({path:"screenshots/02-learning-paths.png",fullPage:true});
  await page.locator('#courses-view a[href="#/lesson/variables"]').first().click();
  await page.getByRole("heading",{name:"Variables & types"}).waitFor();
  await page.locator('[data-choice="1"]').click();
  await page.getByText("✓ Correct.",{exact:false}).waitFor();
  await page.locator("#launchChallenge").click();
  await page.locator("#studioTitle").getByText("Invoice total").waitFor();
  await page.locator("#codeEditor").fill('price = float(input())\nquantity = int(input())\nprint(f"{price * quantity:.2f}")');
  await page.locator("#runCode").click();
  await page.getByText("3 / 3 passed",{exact:true}).waitFor({timeout:120000});
  await check(await page.locator(".test-case.pass").count()===3,"Python runtime did not pass all cases.");
  await page.screenshot({path:"screenshots/03-studio-passed.png",fullPage:true});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator('[data-nav="progress"]').click();
  await page.getByText("1 / 12",{exact:false}).first().waitFor();
  await page.screenshot({path:"screenshots/04-progress.png",fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-nav="overview"]').click({force:true}).catch(()=>page.goto("http://127.0.0.1:8000/#/overview"));
  await page.screenshot({path:"screenshots/05-dashboard-mobile.png",fullPage:true});
  await check(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),"Horizontal overflow detected on mobile.");
  await page.locator("#menuToggle").click();
  await check(await page.locator("#sidebar").evaluate(el=>el.classList.contains("open")),"Mobile navigation did not open.");
  await page.locator('[data-nav="courses"]').click();
  await check(await page.locator("#courses-view").evaluate(el=>el.classList.contains("active")),"Mobile navigation did not route.");
  await check(errors.length===0,"Browser page errors: "+errors.join("; "));
  console.log("PASS: desktop/mobile navigation, quizzes, live Pyodide execution, progress persistence, mobile overflow and screenshots.");
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.kill("SIGTERM");});

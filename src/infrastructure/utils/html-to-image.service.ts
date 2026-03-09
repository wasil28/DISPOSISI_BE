import * as puppeteer from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from "fs";
import * as path from 'path';

@Injectable()
export class HtmlToImageService {
  async generateJpg(htmlContent: string, width: number, height: number, tempDir: string, fileName: string): Promise<string> {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: true, // Nonaktifkan headless untuk debug
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      // Set ukuran halaman sesuai input
      await page.setViewport({ width, height });

      // Muat konten HTML
      await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

      // Buat temp directory jika belum ada
      const tempPath = `../upload/temp/${tempDir}/`
      const dir = path.join(process.cwd(), tempPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      // Ambil screenshot
      const imagePath = `../upload/temp/${tempDir}/${fileName}.jpg`;

      await page.screenshot({ path: imagePath, type: 'jpeg', quality: 100 });

      return imagePath;
    } catch (error) {
      console.error('Error generating JPG:', error);
      throw new Error('Failed to generate JPG');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}

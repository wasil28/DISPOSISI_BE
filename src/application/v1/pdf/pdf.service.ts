import { Inject, Injectable } from "@nestjs/common";
import { PDFModuleOptions, ToPDFFile } from "./pdf.interface";
import * as pdf from "html-pdf";
import Handlebars from "handlebars";
import { join } from "path";
import { readFileSync, ReadStream } from "fs";
@Injectable() 
export class PDFService {
  constructor(@Inject("PDF_OPTIONS") private options: PDFModuleOptions) {}

  toPdfFile<T>(options: ToPDFFile<T>) {
    const path = join(`${this.options.templateDirectory}`, options.template);

    const html = this.generateHTML(path, options.data);
    return new Promise((resolve, reject) => {
      return pdf
        .create(html, {
          localUrlAccess: true,
          type: "pdf",
          directory: options.outputDirectory,
          format: "A4",
          orientation: options.orientation
        })
        .toFile(
          join(options.outputDirectory, options.outputFilename),
          (err, res) => {
            if (err) reject(err);

            resolve(res);
          }
        );
    });
  }

  toBuffer<T>(template: string, data: T): Promise<Buffer> {
    const path = join(`${this.options.templateDirectory}`, template);
    const html = this.generateHTML<T>(path, data);

    return new Promise((resolve, reject) => {
      return pdf
        .create(html, {
          localUrlAccess: true,
          type: "pdf",
          format: "A4",
          orientation: "portrait",
          paginationOffset: 1
        })
        .toBuffer((err, buffer) => {
          if (err) reject(err);

          resolve(buffer);
        });
    });
  }

  toStream<T>(
    template: string,
    data: T,
    type: "png" | "jpeg" | "pdf" = "pdf",
    orientation: 'landscape' | 'portrait' = 'portrait'
  ): Promise<ReadStream> {
    const path = join(`${this.options.templateDirectory}`, template);
    const html = this.generateHTML<T>(path, data);

    return new Promise((resolve, reject) => {
      return pdf
        .create(html, {
          localUrlAccess: true,
          type: type,
          format: "A4",
          timeout: 100000000,
          orientation: orientation,
        })
        .toStream((err, stream) => {
          if (err) reject(err);

          resolve(stream);
          return stream;
        });
    });
  }

  generateHTML<T>(path: string, data: T) {
    Handlebars.registerHelper("inc", (value, options) => {
      return Number(value) + 1;
    });
    const template = Handlebars.compile(String(readFileSync(path, "utf-8")));

    return template(data);
  }
}

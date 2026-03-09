import { DynamicModule, Inject, Injectable, Module } from "@nestjs/common";
import Handlebars from "handlebars";
import { PDFModuleOptions } from "./pdf.interface";
import { PDFService } from "./pdf.service";

@Module({})
export class PDFConfig {
  static register(options: PDFModuleOptions): DynamicModule {
    return {
      module: PDFConfig,
      global: options.isGlobal,
      providers: [
        {
          provide: "PDF_OPTIONS",
          useValue: options
        },
        PDFService
      ],
      exports: [PDFService]
    };
  }
}

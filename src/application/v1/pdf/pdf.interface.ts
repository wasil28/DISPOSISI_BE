export interface PDFModuleOptions {
    templateDirectory: string;
    isGlobal: boolean;
  }
  
  export interface ToPDFFile<T> {
    outputDirectory: string;
    template: string;
    outputFilename: string;
    data: T;
    orientation: string;
  }
  
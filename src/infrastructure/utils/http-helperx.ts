import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HttpHelperx {
  constructor(private readonly httpService: HttpService) {}

  // Helper method for GET requests
  async get<T>(url: string, headers?: any): Promise<T> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<T>(url, { headers })
      );
      return response.data;
    } catch (error) {
      throw new Error(`GET request failed: ${error.message}`);
    }
  }

  // Helper method for POST requests
  async post<T>(url: string, data: any, headers?: any): Promise<T> {
    try {
      const response = await lastValueFrom(
        this.httpService.post<T>(url, data, { headers })
      );
      return response.data;
    } catch (error) {
      throw new Error(`POST request failed: ${error.message}`);
    }
  }
}

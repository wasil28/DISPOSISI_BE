// brute-force.middleware.ts

import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

@Injectable()
export class BruteForceProtectionMiddleware implements NestMiddleware {
  //   private attempts = new Map<string, number>();

  /* Menggunakan Rate Limit (package) */
  private maxLoginAttempts = parseInt(process.env.MAX_REQUEST_ATTEMPTS) || 5;
  private maxRequestTime = parseInt(process.env.MAX_REQUEST_TIME) || 15;
  private limiter = rateLimit({
    windowMs: this.maxRequestTime * 60 * 1000, // 15 menit
    max: this.maxLoginAttempts,
    handler: (req: Request, res: Response) => {
      res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        status: HttpStatus.TOO_MANY_REQUESTS,
        message:
          'Terlalu banyak percobaan masuk dari alamat IP ini, coba lagi nanti.',
      });
    },
  });

  use(req: Request, res: Response, next: NextFunction) {
    // Terapkan pembatasan menggunakan express-rate-limit
    this.limiter(req, res, (err: any) => {
      if (err) {
        return res.status(HttpStatus.FORBIDDEN).json({
          status: HttpStatus.TOO_MANY_REQUESTS,
          message:
            'Terlalu banyak percobaan masuk dari alamat IP ini, coba lagi nanti.',
        });
      }

      // Jika tidak ada pembatasan, lanjutkan dengan middleware berikutnya
      next();
    });
  }

  /* Menggunakan Attemps */
  //   use(req: Request, res: Response, next: NextFunction) {
  //     console.log('Middleware is called!');
  //     const ip = req.ip;
  //     console.log(ip);

  //     // Cek jumlah percobaan masuk dari alamat IP
  //     const attempts = this.attempts.get(ip) || 0;
  //     console.log(attempts);

  //     if (attempts >= this.maxLoginAttempts) {
  //       // Blokir sementara alamat IP jika percobaan melebihi batas
  //       return res.status(HttpStatus.FORBIDDEN).json({
  //         message:
  //           'Terlalu banyak percobaan masuk dari alamat IP ini, coba lagi nanti.',
  //       });
  //     }

  //     console.log('lewat sinii');
  //     this.attempts.set(ip, attempts + 1);
  //     // Lanjutkan jika belum mencapai batas percobaan
  //     next();
  //   }
}

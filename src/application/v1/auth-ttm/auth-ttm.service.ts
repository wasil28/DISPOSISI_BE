import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class AuthTtmService {
  constructor(private httpService: HttpService) {}

  public async updateSession(tokenSRS: string) {
    try {
      const dp = this.httpService
        .post(
          'https://api-srs-dev.ut.ac.id/backend-srs/api/graphql',
          {
            query: `mutation{
            updateSession
          }`,
          },
          {
            headers: {
              'content-type': 'application/json',
              Authorization: tokenSRS,
            },
          },
        )
        .toPromise();

      return await dp;
    } catch (err) {
      console.log(err);
    }
  }

  public async mySession(tokenSRS: string): Promise<AxiosResponse> {
    try {
      const dp = this.httpService
        .post(
          'https://api-srs-dev.ut.ac.id/backend-srs/api/graphql',
          {
            query: `query{
            mySession{
              id
              expiredAt
              ip
              country
              city
              timezone
              latitude
              longitude
              browser
              browserVersion
              os
              osVersion
              device
              deviceBrand
              deviceModel
              isFirstLogin
              userId
              user{
                id
                email
                name
                statusAktif
                idGroup
                group{
                  kodeGroup
                  namaGroup
                  idLevel
                  level{
                    name
                  }
                  unitId
                  unit{
                    kodeUnit
                    name
                  }
                }
                kodeUpbjj
                upbjj{
                  id
                  kodeUpbjj
                  namaUpbjj
                  emailUpbjj
                  alamatUpbjj
                  idZonaWaktu
                  zonaWaktu{
                    namaZonaWaktu
                  }
                }
              }
            }
          }`,
          },
          {
            headers: {
              'content-type': 'application/json',
              Authorization: tokenSRS,
            },
          },
        )
        .toPromise();

      return await dp;
    } catch (err) {
      console.log(err);
    }
  }
}

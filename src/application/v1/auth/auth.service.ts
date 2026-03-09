import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { SystemLogsService } from '../rest/system-logs/system-logs.service';
import {
  badRequestError,
  internalServerError,
  unauthorizedError,
} from 'src/infrastructure/utils/exception';
import { UserService } from '../user/user.service';
import { LoginPayload } from './auth.payload';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { SessionEntity } from 'src/entities/session.entity';
import { Repository, EntityManager, Like, IsNull, Not, Raw, MoreThan } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { checkErrorDb } from 'src/infrastructure/utils/check-arg';
import { verify, decode } from 'jsonwebtoken';
import { UserGeneralService } from '../user-general/user-general.service';
import { UserGeneralEntity } from 'src/entities/user-general.entity';
import { AktivasiAkun, RegisterAkun, ResetPassword, VerifikasiUser, compareDataUser, UpdatePasswordUser } from '../user-general/user-general.payload';
import { UserEntity } from 'src/entities/user.entity';
import { isNull } from 'util';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userGeneralService: UserGeneralService,
    private readonly redisService: RedisService,
    @InjectRepository(UserGeneralEntity) private readonly userGeneralRepo: Repository<UserGeneralEntity>,
    @InjectRepository(SessionEntity) private readonly sessionRepo: Repository<SessionEntity>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @Inject(forwardRef(() => SystemLogsService))
    private readonly systemLogsService: SystemLogsService
  ) {}

  private sessionAge: number = 60 * 240;
  private redis = this.redisService.getClient();

  async login({ email, password }: LoginPayload, session: SessionEntity, sso = false, accessToken?: string) {
    try {
      if (sso) {
        const user = await this.userGeneralService.findOne({
          ecampusAccount: email
        }, {
          select: ['id', 'email', 'name', 'password','idGroup','emailVerified']
        });

        if (user.emailVerified == false) {
            throw new BadRequestException({
            error: 'unauthorized access',
            message: 'Silakan Verifikasi Email terlebih dahulu!'
            })
            
        }
  
        const newSession = await this.createSession({ ...session, userId: user.id });
        const token = this.signToken(newSession);
        const isFirstLogin = await this.userGeneralService.isFirstLogin(user.id) <=1 ? true : false;
        await this.cacheSessionInRedis({ ...await this.findSession(newSession.id), isFirstLogin, isDefaultPassword: false});
  
        return token;
      }else{
  
        const user = await this.userGeneralService.findOne({
          email: email
        }, {
          select: ['id', 'email', 'name', 'password', 'idGroup', 'emailVerified', 'status']
        });
        if (user.emailVerified == false) {
            this.systemLogsService.createLog({
                level: 'WARN',
                source: 'Auth',
                message: `Login failed for ${email}: Email not verified`,
            });
            throw new BadRequestException({
            error: 'unauthorized access',
            message: 'Silakan Verifikasi Email terlebih dahulu!'
            })
            
        }
        if (user.status == null || user.status == 0 ) {
             this.systemLogsService.createLog({
                level: 'WARN',
                source: 'Auth',
                message: `Login failed for ${email}: User account inactive`,
            });
            throw new BadRequestException({
            error: 'unauthorized access',
            message: 'User tersebut tidak aktif!'
            })
            
        }
  
        this.comparePassword(user.password, password);
        // const group = await this.groupRepo.findOne({where:{id:user.idGroup}})
        // if (group.kodeGroup === 'M0000' || group.kodeGroup === 'M0001') {
        //   throw new BadRequestException({
        //     error: 'unauthorized access',
        //     message: 'Situs ini hanya diperuntukkan untuk pegawai UT'
        //   })
        // }
        const isDefaultPassword = this.userGeneralService.isDefaultPassword(this.converHashToBcrypt(user.password));
        const isFirstLogin = await this.userGeneralService.isFirstLogin(user.id) <=1 ? true : false;
  
        const newSession = await this.createSession({ ...session, userId: user.id });
        const token = this.signToken(newSession);
        /*const sessionse = await this.sessionRepo.findOne({
          where: {
            id: newSession.id
          },
          cache: true,
        });*/
        await this.cacheSessionInRedis({ ...await this.findSession(newSession.id), isFirstLogin, isDefaultPassword});
        
        this.systemLogsService.createLog({
            level: 'INFO',
            source: 'Auth',
            message: `User ${user.email} (${user.id}) logged in successfully`,
            context: { userId: user.id }
        });

        return token;
      }
    } catch (error) {
       // Log internal errors during login
       if (!(error instanceof BadRequestException)) {
           this.systemLogsService.createLog({
               level: 'ERROR',
               source: 'Auth',
               message: `Login error for ${email}: ${error.message}`,
               trace: error.stack
           });
       }
      internalServerError(error);
    }
  }

  async loginAsMhs(idUserSender: number,{ email }: LoginPayload, session: SessionEntity, accessToken?: string ) {
    try {
      const user = await this.userGeneralService.findOne({
        email: email
      }, {
        select: ['id', 'email', 'name', 'password','idGroup','emailVerified']
      });

      if (user.emailVerified == false) {
          throw new BadRequestException({
          error: 'unauthorized access',
          message: 'Silakan Verifikasi Email terlebih dahulu!'
          })
          
      }

      const newSession = await this.createSession({ ...session, userId: user.id });
      const token = this.signToken(newSession);
      const isFirstLogin = await this.userGeneralService.isFirstLogin(user.id) <=1 ? true : false;
      await this.cacheSessionInRedis({ ...await this.findSession(newSession.id), isFirstLogin, isDefaultPassword: false, accessToken });
  
      return token;
    } catch (error) {
      internalServerError(error);
    }
  }

  signToken(payload: SessionEntity): string {
    // sign jwt with 30 minute exp and take jwt secret from env
    const token = sign(
      {
        data: payload,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );
    return token;
  }

  verifyToken(token: string): boolean {
    try {
      const verified = verify(token, process.env.JWT_SECRET);
      return true;
    } catch (error) {
      unauthorizedError('Token tidak valid.');
    }
  }

  async getUserInfoJwt(token: string) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET);

      return decoded;
    } catch (error) {
      console.log(error);
      return token;
    }
  }

  decodeToken(token: string): any {
    const decoded = decode(token);

    return decoded;
  }

  async cacheSessionInRedis(session: any) {
    try {
      const redisKey = `session|${session.id}`;
      // save session to redis with 30minutes expired time
      const setRedis = await this.redis.set(
        redisKey,
        JSON.stringify(session),
        'EX',
        this.sessionAge,
      );
      console.log(`[Redis] Session cached: key=${redisKey}, result=${setRedis}, ttl=${this.sessionAge}s`);
      console.log(`[Redis] Session data:`, { id: session.id, userId: session.userId || session.userGeneral?.id });
      return setRedis;
    } catch (error) {
      console.error(`[Redis] Failed to cache session:`, error);
      internalServerError(error);
    }
  }

  async createSession(session: SessionEntity) {
    try {
      const datetime = new Date();
      const thirtyMinutes = datetime.setMinutes(datetime.getMinutes() + 240);

      session.expiredAt = new Date(thirtyMinutes);
      const newSession = this.sessionRepo.save({
        ...session,
      });
      return newSession;
    } catch (error) {
      internalServerError(error);
    }
  }

  converHashToBcrypt(hashedPassword: string) {
    if (hashedPassword.slice(0, 3) === '$2y')
      return hashedPassword.replace(/^\$2y(.+)$/i, '$2a$1');
    return hashedPassword;
  }

  comparePassword(hashedPassword: string, password: string): boolean {
    const compare: boolean = compareSync(
      password,
      this.converHashToBcrypt(hashedPassword),
    );
    if (!compare) badRequestError('Periksa kembali email/kata sandi anda');
    return compare;
  }

  async getSessionRedis(id: number): Promise<SessionEntity> {
    const cache = await this.redis.get(`session|${id}`);

    if (!cache) unauthorizedError('Sesi anda telah berakhir.');
    return JSON.parse(cache);
  }

  async removeSessionRedis(id: number): Promise<boolean> {
    try {
      const remove = await this.redis.del(`session|${id}`);
      return true;
    } catch (error) {
      internalServerError(error);
    }
  }

  async findSession(id: number, withRelation = true) {
    try {
      if (!withRelation) {
        const session = await this.sessionRepo.findOne({
          where: {
            id: id
          },
          cache: true,
        });

        if (!session) unauthorizedError('Session tidak ditemukan.');
        return session;
      }
      const session = await this.sessionRepo.findOne({
        where: {
          id: id
        },
        relations: ['userGeneral'],
        cache: true,
      });


      await Promise.all(session.userGeneral.roles.map(async (role, index) => {
        if (role.kode === 'RL09' || role.kode === 'RL03' || role.kode === 'RL04' || role.kode === 'RL05' ) {
          const dataUserRole = await this.entityManager.query(`
            select * from t_user_role a  
            where a.id_user = $1 and a.id_role = $2
          `, [
            session.userGeneral.id, role.id
          ]);
      
          if (dataUserRole.length !== 0) {
            if(role.kode === 'RL03' || role.kode === 'RL04'){
              session.userGeneral.roles[index].idFakultas = dataUserRole[0].id_fakultas;
            }else if(role.kode === 'RL05'){
              session.userGeneral.roles[index].idProgramStudi = dataUserRole[0].id_program_studi;
            }else if(role.kode === 'RL09'){
              session.userGeneral.roles[index].idUpbjj = dataUserRole[0].id_upbjj;
            }
          } else {
            session.userGeneral.roles[index].idUpbjj = null;
          }
        } else {
          session.userGeneral.roles[index].idUpbjj = null;
        }
      }));
      

      if (!session) unauthorizedError('Session tidak ditemukan.');

      
      return session;
    } catch (error) {
      internalServerError(error);
    }
  }

  async updateSession(sessionId: number) {
    try {
      const getTTL = await this.redis.ttl(`session|${sessionId}`);
      const sessionDb = await this.findSession(sessionId, false);
      if (
        new Date(sessionDb.expiredAt.getDate()) <
        new Date(new Date().getDate() - 1)
      ) {
        badRequestError('Sesi anda telah lama berakhir');
      }

      await this.redis.setex(
        `session|${sessionId}`,
        getTTL + this.sessionAge,
        JSON.stringify(sessionDb),
      );

      const dateTime = new Date();
      await this.sessionRepo.update(sessionId, {
        expiredAt: new Date(dateTime.setMinutes(dateTime.getMinutes() + 240)),
      });
      return this.signToken(sessionDb);
    } catch (error) {
      internalServerError(error);
    }
  }

  async setSessionExpired(id: number) {
    try {
      const session = await this.sessionRepo.update(id, {
        expiredAt: new Date(),
      });
      return session;
    } catch (error) {
      internalServerError(error);
    }
  }

  async logout(session: SessionEntity): Promise<boolean> {
    try {
      this.removeSessionRedis(session.id);
      this.setSessionExpired(session.id);
      return true;
    } catch (error) {
      internalServerError(error);
    }
  }

  public async create(payload: RegisterAkun, createdBy?: string) {
    try {
      // Decrypt Password
      payload.password = hashSync(payload.password, genSaltSync(12));

      payload.kodeAktifasiAkun = this.generateRandomCode(32)

      const checkEmail = await this.userGeneralRepo.findOne({
        where: { email: payload.email },
      });
      const roleRepository: Repository<any> = this.entityManager.getRepository('Role'); // Replace 'M_Role' with your actual entity name

      if (checkEmail == undefined) {
        const data = this.userGeneralRepo.create({
          ...payload,
          createdBy: 'SYSTEM APP',
        });
        const saveData = await this.userGeneralRepo.save(data);

        const dataUser = await this.userGeneralRepo.findOne({
          where: { email: payload.email },
        });

        if(!saveData){
          internalServerError('Gagal Simpan User');
        }

        const result = await this.entityManager.query(`
            INSERT INTO t_user_role (
              id_user,
                id_role
            ) VALUES (
                $1, $2
            ) RETURNING *;
        `, [
            dataUser.id,
            0
        ]);
        if(!result){
          internalServerError('Gagal Simpan User Role');
        }else{
          return saveData
        }

      }else{
        throw new Error('Email Sudah Terdaftar');
      }
    } catch (error) {
      checkErrorDb(error);

      internalServerError(error);
    }
  }

  public async verifikasiAkun(payload: VerifikasiUser) {
    try {
      const isVerif =  await this.userGeneralRepo.findOne({
        where: { email: payload.email, kodeAktifasiAkun:payload.kodeAktifasiAkun },
      });

      if(isVerif != null){
        isVerif.emailVerified = true
        isVerif.status = 1
        return  await this.userGeneralRepo.save({
            id: isVerif.id,
            ...isVerif,
            updatedBy: 'system',
          });
        
      }else{
        throw new Error('Kode Verifikasi Salah, Silakan Klik LINK dari Email!');
      }
    } catch (error) {
      checkErrorDb(error);

      internalServerError(error);
    }
  }

  public async aktivasiAkun(payload: AktivasiAkun) {
    try {
      const user =  await this.userGeneralRepo.findOne({
        where: { email: payload.email, kodeAktifasiAkun:payload.kodeAktifasiAkun },
      });

      if (!user) {
        throw new Error('Kode Aktivasi Tidak Valid');
      }

      user.emailVerified = true
      user.status = 1
      user.password = hashSync(payload.password, genSaltSync(12));
      user.kodeAktifasiAkun = null
      return await this.userGeneralRepo.save({
        id: user.id,
        ...user,
        updatedBy: 'system',
      });

    } catch (error) {
      checkErrorDb(error);
      internalServerError(error);
    }
  }

  public async forgotPassword(email: string) {
    try {
      const user = await this.userGeneralRepo.findOne({
        where: { email: email }
      })

      if (!user) {
        return null
      }

      user.kodeLupaPassword = this.generateRandomCode(32)
      user.kadaluarsaLupaPassword = new Date(Date.now() + 7200000) // kode berlaku untuk 2 jam kedepan

      return await this.userGeneralRepo.save({
        id: user.id,
        ...user,
        updatedBy: 'system',
      });

    } catch (error) {
      checkErrorDb(error);
      internalServerError(error);
    }
  }

  public async resetPassword(payload: ResetPassword) {
    try {
      const user =  await this.userGeneralRepo.findOne({
        where: { email: payload.email, kodeLupaPassword: payload.kodeLupaPassword },
      });

      if (!user) {
        throw new Error('Kode Tidak Valid');
      }

      const currentTime = new Date()
      if (currentTime > user.kadaluarsaLupaPassword) {
        throw new Error('Kode Sudah Tidak Berlaku');
      }

      user.password = hashSync(payload.password, genSaltSync(12))
      user.kadaluarsaLupaPassword = null
      user.kodeLupaPassword = null
      return await this.userGeneralRepo.save({
        id: user.id,
        ...user,
        updatedBy: 'system',
      });
    } catch (error) {
      checkErrorDb(error);
      internalServerError(error);
    }
  }

  public async gantiPassword(userId: number, payload: UpdatePasswordUser) {
    try {
      const user =  await this.userGeneralService.findOne({
        id: userId,
      }, {
        select: ['id', 'email', 'password']
      });

      if (!user) {
        throw new Error('User Tidak Ditemukan');
      }

      const compare: boolean = compareSync(payload.currentPassword, this.converHashToBcrypt(user.password));

      if (!compare) {
        throw new Error('Password lama tidak sesuai');
      }

      user.password = hashSync(payload.password, genSaltSync(12))

      return await this.userGeneralRepo.save({
        id: user.id,
        ...user,
        updatedBy: user.name,
      });
    } catch (error) {
      checkErrorDb(error);
      internalServerError(error);
    }
  }

  public async compareDataUser(payload: compareDataUser) {
    try {
      const dataUser =  await this.userGeneralRepo.findOne({
        where: { ecampusAccount: payload.ecampusAccount },
        select: ['id', 'email', 'name', 'idGroup']
      });

      const roleRepository: Repository<any> = this.entityManager.getRepository('Role'); // Replace 'M_Role' with your actual entity name
      
      const desiredRole = await roleRepository.findOne({
        where: { kodeSrs: Like(`%${payload.kode_group}%`) },
        select: ['id', 'name', 'kode'] // Adjust `select` based on your needs
      });

      if(desiredRole == null){

        if(dataUser == null){
          const payloadUser = {
            ecampusAccount : payload.ecampusAccount,
            name : payload.name,
            username : payload.ecampusAccount,
            email : payload.ecampusAccount,
            emailVerified : true,
            status : 1,
            password : 'system',
            idNegaraDikti: 103

          }
          const data = await this.userGeneralRepo.create({
            ...payloadUser
          });
          const dataSave = await this.userGeneralRepo.save(data);
          const dataUser =  await this.userGeneralRepo.findOne({
            where: { ecampusAccount: payload.ecampusAccount },
            select: ['id', 'email', 'name', 'idGroup']
          });
          
          
          return true
        }
      }else{

        if(dataUser == null){
          const payloadUser = {
            ecampusAccount : payload.ecampusAccount,
            name : payload.name,
            username : payload.ecampusAccount,
            email : payload.ecampusAccount,
            emailVerified : true,
            status : 1,
            password : 'system',
            idGroup : desiredRole.id,
            idNegaraDikti: 103

          }
          const data = await this.userGeneralRepo.create({
            ...payloadUser
          });
          const dataSave = await this.userGeneralRepo.save(data);
          const dataUser =  await this.userGeneralRepo.findOne({
            where: { ecampusAccount: payload.ecampusAccount },
            select: ['id', 'email', 'name', 'idGroup']
          });
          
          
          if(await dataUser != null){

            const result = await this.entityManager.query(`
                INSERT INTO t_user_role (
                  id_user,
                    id_role
                ) VALUES (
                    $1, $2
                ) RETURNING *;
            `, [
                dataUser.id,
                desiredRole.id
            ]);
    
          }
          
          return true
        }else{
          const dataRoleUser = await this.entityManager.query(`
                select * from t_user_role where id_user = $1 limit 1 ;
            `, [
              dataUser.id
            ]);
        }
      }

      return true

    } catch (error) {
      checkErrorDb(error);

      internalServerError(error);
    }
  }

  public generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  }

}

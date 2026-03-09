import { HttpException, HttpStatus } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { join, resolve } from 'path';
import { existsSync, mkdir } from 'fs';

export class FileUploadUtils {
  static directoryAdmisi(req, file, cb) {
    const directory = req.body.directory;
    const dir = `../${directory}`;

    cb(null, dir);
  }

  static filenameAdmisi(req, file, cb) {
    let extension;
    const filename = req.body.filename;
    const halaman = req.body.halaman;
    extension = req.body.formatFile;
    if (!extension || extension.trim() == '') {
      extension = 'jpg';
    }
    cb(null, `${filename}_${halaman}.${extension}`);
  }

  static customFileName(req, file, cb) {
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const uniqueSuffix = Date.now();
    let fileExtension = '';
    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtension = 'jpg';
    } else if (file.mimetype.indexOf('jpg') > -1) {
      fileExtension = 'jpg';
    } else if (file.mimetype.indexOf('png') > -1) {
      fileExtension = 'png';
    } else if (file.mimetype.indexOf('pdf') > -1) {
      fileExtension = 'pdf';
    }
    const originalName = file.originalname.split('.')[0];

    cb(null, originalName + '-' + uniqueSuffix + '.' + fileExtension);
  }

  static async nameFileUpload(req, file, cb) {
    // Directory
    let path_ktp = join(process.cwd(), `public/berkas/mahasiswa/ktp`);
    // let path_ktp = `${process.env.BERKAS_PATH}/mahasiswa/ktp`;

    let path_foto = join(process.cwd(), `public/berkas/mahasiswa/foto`);
    // let path_foto = `${process.env.BERKAS_PATH}/mahasiswa/foto`;

    let path_cv = join(process.cwd(), `public/berkas/mahasiswa/cv`);
    // let path_cv = `${process.env.BERKAS_PATH}/mahasiswa/cv`;

    let path_passport = join(process.cwd(), `public/berkas/mahasiswa/passport`);
    // let path_passport = `${process.env.BERKAS_PATH}/mahasiswa/passport`;

    path_ktp = path_ktp.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
    path_foto = path_foto.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g,'',); // Remove leading directory markers, and remove ending /file-name.extension
    path_cv = path_cv.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
    path_passport = path_passport.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension

    const uploadDir_ktp = resolve('/', path_ktp);
    const uploadDir_foto = resolve('/', path_foto);
    const uploadDir_cv = resolve('/', path_cv);
    const uploadDir_passport = resolve('/', path_passport);

    if (!existsSync(uploadDir_ktp)) {
      mkdir(uploadDir_ktp, { recursive: true }, (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('Directory ktp created successfully!');
      });
    }

    if (!existsSync(uploadDir_foto)) {
      mkdir(uploadDir_foto, { recursive: true }, (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('Directory foto created successfully!');
      });
    }

    if (!existsSync(uploadDir_cv)) {
      mkdir(uploadDir_cv, { recursive: true }, (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('Directory cv created successfully!');
      });
    }

    if (!existsSync(uploadDir_passport)) {
      mkdir(uploadDir_passport, { recursive: true }, (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('Directory passport created successfully!');
      });
    }

    let newname;
    let fileExtension = '';
    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtension = 'jpg';
    } else if (file.mimetype.indexOf('jpg') > -1) {
      fileExtension = 'jpg';
    } else if (file.mimetype.indexOf('png') > -1) {
      fileExtension = 'png';
    } else if (file.mimetype.indexOf('pdf') > -1) {
      fileExtension = 'pdf';
    }

    file.fieldname == 'file_ktp'
      ? (newname = req.body.id_mhs + '_1.' + fileExtension)
      : '';
    file.fieldname == 'file_foto'
      ? (newname = req.body.id_mhs + '_2.' + fileExtension)
      : '';
    file.fieldname == 'file_cv'
      ? (newname = req.body.id_mhs + '_3.' + fileExtension)
      : '';
    file.fieldname == 'file_passport'
      ? (newname = req.body.id_mhs + '_4.' + fileExtension)
      : '';

    //console.log(newname);

    // Rename
    // let i = 1
    // console.log(i)
    // if((file.fieldname == 'file_sertifikat') || (file.fieldname == 'file_ijazah' )){
    //   console.log(directory+i+"."+fileExtension)
    //   let checkfile = existsSync(directory+i+"."+fileExtension);
    //   console.log(!existsSync(directory+i+"."+fileExtension))
    //   while (checkfile == true){
    //     if(!existsSync(directory+i+"."+fileExtension)){
    //         newname = rawname+i+'.'+fileExtension;
    //         break;
    //     }
    //       checkfile == true
    //       i++;

    //   }
    // }

    cb(null, newname);
  }

  static customFileNameExcel(req, file, cb) {
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const uniqueSuffix = Date.now();
    let fileExtension = '';

    //console.log("mimetype : " + file.mimetype);

    if (
      file.mimetype ==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      fileExtension = 'xlsx';
    } else {
      fileExtension = 'xls';
    }
    const originalName = file.originalname.split('.')[0];

    cb(null, uniqueSuffix + '-' + originalName + '.' + fileExtension);
  }

  static destinationPath(req, file, cb) {
    cb(null, './berkas/');
  }

  static async excelFileFilterMultiple(req, file, cb) {
    const fileSize = parseInt(req.headers['content-length']);

    //console.log(fileSize);
    const filemax = 548576; //5 mb
    //const filemax = 32798; //22 kb

    if (!file.originalname.match(/\.(xlsx|xls)$/)) {
      return cb(
        new HttpException(
          'Harap Upload File dengan ektensi xlsx/xls',
          HttpStatus.NOT_ACCEPTABLE,
        ),
      );
    } else if (fileSize > filemax) {
      return cb(
        new HttpException(
          'File size lebih dari 5 mb',
          HttpStatus.NOT_ACCEPTABLE,
        ),
      );
    }

    cb(null, true);
  }

  static async imageFileFilterMultiple(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|pdf|png)$/)) {
      return cb(
        new HttpException(
          'Harap Upload File dengan ektensi jpg/jpeg/png/pdf',
          HttpStatus.NOT_ACCEPTABLE,
        ),
      );
    }
    cb(null, true);
  }

  static async imageFileFilter(req, file, cb) {
    try {
      const extension = req.body.formatFile;

      switch (extension) {
        case 'jpg':
        case 'jpeg':
          if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
            return cb(
              new HttpException(
                'Harap Upload File dengan ektensi jpg/jpeg',
                HttpStatus.NOT_ACCEPTABLE,
              ),
            );
          }
          break;
        case 'pdf':
          if (!file.originalname.match(/\.(pdf)$/)) {
            return cb(
              new HttpException(
                'Harap Upload File dengan ektensi pdf',
                HttpStatus.NOT_ACCEPTABLE,
              ),
            );
          }
          break;
        case 'png':
          if (!file.originalname.match(/\.(png)$/)) {
            return cb(
              new HttpException(
                'Harap Upload File dengan ektensi png',
                HttpStatus.NOT_ACCEPTABLE,
              ),
            );
          }
          break;
        default:
          if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
            return cb(
              new HttpException(
                'Harap Upload File dengan ektensi jpg/jpeg/png/pdf',
                HttpStatus.NOT_ACCEPTABLE,
              ),
            );
          }
          break;
      }

      const directory = req.body.directory;
      if (!directory) {
        return cb(
          new HttpException(
            'Directory Tidak Ditemukan',
            HttpStatus.NOT_ACCEPTABLE,
          ),
        );
      }

      const filename = req.body.filename;
      if (!filename) {
        return cb(
          new HttpException('Harap masukan file', HttpStatus.NOT_ACCEPTABLE),
        );
      }

      cb(null, true);
    } catch (error) {
      console.log(error);
    }
  }

  static filenameFormat(req, file, cb) {
    const filename = req.body.filename;
    const extension = req.body.formatFile;

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(null, `${filename}_${uniqueSuffix}.${extension}`);
  }
}

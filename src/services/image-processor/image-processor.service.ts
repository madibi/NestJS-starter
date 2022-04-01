import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CheckOutObject } from "./../../schema/common/models/classes/check-out-object.class";
import { ImageInfo } from "./../../schema/common/models/dtos/image-info.dto";
import { MulterFileInfoDetails } from "./../../schema/common/models/classes/multer-file-info-details.class";
import { MulterFileInfo } from "./../../schema/common/models/classes/multer-file-info.class";
import { langKeys, LangService } from "./../../services/lang/lang.service";
import { read, MIME_PNG } from 'jimp';
import * as getColors from 'get-image-colors';

@Injectable()
export class ImageProcessorService {

  constructor(
    // private readonly langService: LangService
  ) { }

  async createDifferentSizes(image: MulterFileInfo): Promise<CheckOutObject<MulterFileInfoDetails>> {
    let checkOutObject = new CheckOutObject<MulterFileInfoDetails>();
    let multerFileInfoDetails = new MulterFileInfoDetails();
    // now we just handle one image
    image = Array.isArray(image) ? image[0] : image;
    try {
      multerFileInfoDetails = {
        ...multerFileInfoDetails,
        ...image
      }
      const img = await read(image.path);
      const bitmap = img.bitmap;
      const buffer = await img.getBufferAsync(MIME_PNG);
      const colors = (await getColors(buffer, MIME_PNG)).map(color => color.hex());
      const mimeType = image.mimetype;
      const filename = image.originalname;
      const extension = filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename

      // await image.resize(width, height);
      // await image.quality(quality);
      // await image.writeAsync(img.destination + '\\' + 'xxx' + img.filename);         
      multerFileInfoDetails.width = bitmap.width;
      multerFileInfoDetails.height = bitmap.height;
      multerFileInfoDetails.averageColor = colors[0];
      multerFileInfoDetails.mimeType = mimeType;
      multerFileInfoDetails.extension = extension.toLocaleLowerCase();
      checkOutObject.object = multerFileInfoDetails;
      return checkOutObject;
    } catch (err) {
      // const translate = await this.langService.translate(langKeys.common.imageProcessor.SOMETHING_WRONG, '');
      // checkOutObject.status = false;
      // checkOutObject.http_status = HttpStatus.INTERNAL_SERVER_ERROR;
      // checkOutObject.message = translate.message;
      // checkOutObject.message_code = translate.code;
      return checkOutObject;
    }
  }

  getImageProperties(object: any): ImageInfo {
    return new ImageInfo({
      width: object?.width ? object.width : null,
      height: object?.height ? object.height : null,
      averageColor: object?.averageColor ? object.averageColor : null,
      path: object?.path ? object.path : null,
      extension: object?.extension ? object.extension : null,
      mimeType: object?.mimeType ? object.mimeType : null,
    });
  }

  getFileProperties(object: any): ImageInfo {
    return new ImageInfo({
      width: null,
      height: null,
      averageColor: null,
      path: object?.path ? object.path : null,
      extension: object?.extension ? object.extension : null,
      mimeType: object?.mimeType ? object.mimeType : null,
    });
  }

  async getImageInfo(file: any): Promise<MulterFileInfoDetails> {
    let imageInfo = new MulterFileInfoDetails();
    const createDifferentSizes = await this.createDifferentSizes(file);
    if (createDifferentSizes.status) {
      imageInfo = createDifferentSizes.object;
    } else {
      throw new HttpException(createDifferentSizes.message, createDifferentSizes.httpStatus);
    }
    return imageInfo;
  }

  async getFileInfo(file: MulterFileInfo): Promise<MulterFileInfoDetails> {
    let checkOutObject = new CheckOutObject<MulterFileInfoDetails>();
    let multerFileInfoDetails = new MulterFileInfoDetails();
    let fileInfo = new MulterFileInfoDetails();
    // now we just handle one image
    file = Array.isArray(file) ? file[0] : file;
    try {
      const mimeType = file.mimetype;
      const filename = file.originalname;
      const extension = filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;

      multerFileInfoDetails = {
        ...multerFileInfoDetails,
        ...file
      }
      multerFileInfoDetails.mimeType = mimeType;
      multerFileInfoDetails.extension = extension.toLocaleLowerCase();
      fileInfo = multerFileInfoDetails;
    } catch (err) {
      // TODO: prepare better exception
      throw new HttpException('createDifferentSizes.message', HttpStatus.BAD_REQUEST);
    }
    return fileInfo;
  }


}

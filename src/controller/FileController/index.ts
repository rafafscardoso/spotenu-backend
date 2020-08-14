import { Request, Response} from 'express';

import { S3Service, UploadFileInputDTO, UploadFileResponseDTO } from '../../service/S3Service';

import { InvalidParameterError } from '../../error/InvalidParameterError';

export class FileController {
  public uploadFile = async (req:Request, res:Response) => {
    try {
      const file = req.files && (req.files.file as any);

      if (!file) {
        throw new InvalidParameterError('Missing file');
      }

      const input:UploadFileInputDTO = { name: file.name, file:file.data };

      const result:UploadFileResponseDTO = await new S3Service().uploadFile(input);

      res.status(200).send(result);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
}
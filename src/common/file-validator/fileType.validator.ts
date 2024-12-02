import { FileValidator } from '@nestjs/common'

export class FileTypeValidator extends FileValidator {
  constructor() {
    super({})
  }

  private _isMulterFile(
    file: Record<string, Express.Multer.File[]> | Express.Multer.File
  ): file is Express.Multer.File {
    return (file as Express.Multer.File).fieldname !== undefined
  }

  isValid(
    fileObject: Record<string, Express.Multer.File[]> | Express.Multer.File
  ): boolean | Promise<boolean> {
    console.log('FileTypeValidator ~ file:', fileObject)
    const validTypeFile = ['image/png', 'image/jpg', 'image/jpeg']

    if (this._isMulterFile(fileObject)) {
      return validTypeFile.includes(fileObject.mimetype)
    } else {
      return Object.values(fileObject).every((files) =>
        files.every((file) => validTypeFile.includes(file.mimetype))
      )
    }
  }

  buildErrorMessage(_file: any): string {
    return `Validation failed (expected type is image)`
  }
}

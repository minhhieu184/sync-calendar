import { FileValidator } from '@nestjs/common'

export class FileSizeValidator extends FileValidator {
  protected declare validationOptions: { maxSize: number }

  private _isMulterFile(
    file: Record<string, Express.Multer.File[]> | Express.Multer.File
  ): file is Express.Multer.File {
    return (file as Express.Multer.File).fieldname !== undefined
  }

  isValid(
    file: Record<string, Express.Multer.File[]> | Express.Multer.File
  ): boolean | Promise<boolean> {
    let isValid = true
    if (this._isMulterFile(file)) {
      if (file.size > this.validationOptions.maxSize) {
        isValid = false
      }
    } else {
      Object.values(file).forEach((files) => {
        files.forEach((file) => {
          if (file.size > this.validationOptions.maxSize) {
            isValid = false
          }
        })
      })
    }

    return isValid
  }

  buildErrorMessage(_file: any): string {
    return `Validation failed (expected size is less than ${this.validationOptions.maxSize} bytes)`
  }
}

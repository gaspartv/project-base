interface ErrorDataReceiveDto {
  details: string
}

export interface UnsupportedReceiveDto {
  code: number
  title: string
  message: string
  error_data: ErrorDataReceiveDto
}

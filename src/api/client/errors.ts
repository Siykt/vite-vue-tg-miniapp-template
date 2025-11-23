export enum ApiErrorCode {}

export type ErrorCodeKeys = keyof typeof ApiErrorCode
export class ApiError extends Error {
  public codeMsg!: string
  constructor(
    public code: ApiErrorCode,
    msg?: string
  ) {
    super(msg)
    const codeName = ApiErrorCode[code] as ErrorCodeKeys
    this.codeMsg = codeName
    this.message = msg ?? codeName
  }
}

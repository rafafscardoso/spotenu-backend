export class RefreshToken {
  constructor (
    private token:string,
    private device:string,
    private isActive:boolean,
    private userId:string
  ) {}

  public getToken = ():string => this.token;

  public getDevice = ():string => this.device;

  public getIsActive = ():boolean => this.isActive;

  public getUserId = ():string => this.userId;

  public setToken = (token:string):void => {
    this.token = token;
  }

  public setDevice = (device:string):void => {
    this.device = device;
  }

  public setIsActive = (isActive:boolean):void => {
    this.isActive = isActive;
  }

  public setUserId = (userId:string):void => {
    this.userId = userId;
  }

  public static toRefreshTokenModel = (refreshToken:any):RefreshToken => (
    new RefreshToken(refreshToken.token, refreshToken.device, refreshToken.isActive, refreshToken.userId)
  )
}

export interface TokenResponseDTO {
  accessToken:string,
  refreshToken?:string
}

export interface RefreshTokenInputDTO {
  refreshToken:string,
  device:string
}
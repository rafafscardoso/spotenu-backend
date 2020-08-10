export class User {
  constructor (
    protected id:string,
    protected name:string,
    protected nickname:string,
    protected email:string,
    protected password:string,
    protected role:USER_ROLES,
    protected image:string
  ) {}

  public getId = ():string => this.id;

  public getName = ():string => this.name;

  public getNickname = ():string => this.nickname;

  public getEmail = ():string => this.email;

  public getPassword = ():string => this.password;

  public getRole = ():USER_ROLES => this.role;

  public getImage = ():string => this.image;

  public setId = (id:string):void => {
    this.id = id;
  }

  public setName = (name:string):void => {
    this.name = name;
  }

  public setNickname = (nickname:string):void => {
    this.nickname = nickname;
  }

  public setEmail = (email:string):void => {
    this.email = email;
  }

  public setPassword = (password:string):void => {
    this.password = password;
  }

  public setRole = (role:USER_ROLES):void => {
    this.role = role;
  }

  public setImage = (image:string):void => {
    this.image = image;
  }

  public static toUserModel = (user:any):User => (
    new User(user.id, user.name, user.nickname, user.email, user.password, user.role, user.image)
  )

  public static stringToUserRole = (role:string):USER_ROLES => {
    switch (role.toLowerCase()) {
      case 'band':
        return USER_ROLES.BAND;
      case 'free':
        return USER_ROLES.FREE;
      case 'premium':
        return USER_ROLES.PREMIUM;
      case 'admin':
        return USER_ROLES.ADMIN;
      default:
        return USER_ROLES.FREE;
    }
  }
}

export interface SignUpInputDTO {
  name:string,
  nickname:string,
  email:string,
  password:string,
  device?:string,
  description?:string,
  image:string
}

export interface LoginInputDTO {
  login:string,
  password:string,
  device:string
}

export interface SignUpResponseDTO {
  message:string
}

export enum USER_ROLES {
  BAND = 'BAND',
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  ADMIN = 'ADMIN'
}
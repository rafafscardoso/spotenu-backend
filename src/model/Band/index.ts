import { User, USER_ROLES } from "../User";

export class Band extends User {
  constructor (
    protected id:string,
    protected name:string,
    protected nickname:string,
    protected email:string,
    protected password:string,
    protected role:USER_ROLES,
    protected image:string,
    protected description:string,
    protected isApproved:boolean = false
  ) {
    super(id, name, nickname, email, password, role, image)
  }

  public getDescription = ():string => this.description;

  public getIsApproved = ():boolean => this.isApproved;

  public setDescription = (description:string):void => {
    this.description = description;
  }

  public setIsApproved = (isApproved:boolean):void => {
    this.isApproved = isApproved;
  }

  public static toBandModel = (band:any):Band => (
    new Band(band.id, band.name, band.nickname, band.email, band.password, band.role, band.image, band.description, band.isApproved)
  )
}

export interface GetAllBandsResponseDTO {
  name:string,
  nickname:string,
  email:string,
  image:string,
  isApproved:boolean
}

export interface ProfileResponseDTO {
  id:string,
  name:string,
  nickname:string,
  email:string,
  role:USER_ROLES,
  image:string,
  description?:string,
  isApproved?:boolean
}

export interface MusicGenre {
  id:string,
  name?:string
}
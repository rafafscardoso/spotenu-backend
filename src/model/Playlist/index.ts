import { SongAlbumDTO } from "../Song";

export class Playlist {
  constructor (
    private id:string,
    private name:string,
    private image:string,
    private isPrivate:boolean,
    private creatorUserId:string,
    private creatorUserName:string,
    private songs:SongAlbumDTO[]
  ) {}

  public getId = ():string => this.id;

  public getName = ():string => this.name;

  public getImage = ():string => this.image;

  public getIsPrivate = ():boolean => this.isPrivate;

  public getCreatorUserId = ():string => this.creatorUserId;

  public getCreatorUserName = ():string => this.creatorUserName;

  public getSongs = ():SongAlbumDTO[] => this.songs;

  public setId = (id:string):void => {
    this.id = id;
  }

  public setName = (name:string):void => {
    this.name = name;
  }

  public setImage = (image:string):void => {
    this.image = image;
  }

  public setIsPrivate = (isPrivate:boolean):void => {
    this.isPrivate = isPrivate;
  }

  public setCreatorUserId = (creatorUserId:string):void => {
    this.creatorUserId = creatorUserId;
  }

  public setCreatorUserName = (creatorUserName:string):void => {
    this.creatorUserName = creatorUserName;
  }

  public setSongs = (songs:SongAlbumDTO[]):void => {
    this.songs = songs;
  }

  public static toPlaylistModel = (playlist:any):Playlist => (
    new Playlist(playlist.id, playlist.name, playlist.image, playlist.isPrivate, playlist.creatorUserId, playlist.creatorUserName, playlist.songs)
  )
}

export interface PlaylistInputDTO {
  name:string,
  image:string
}

export interface PlaylistDTO {
  id:string,
  name:string,
  image:string,
  isPrivate:boolean,
  creatorUserId:string
}

export interface PlaylistUserDTO {
  id:string,
  creatorUserId:string
}

export interface PlaylistSongDTO {
  id:string,
  songId:string
}

export interface PlaylistResponseDTO {
  id:string,
  name:string,
  image:string,
  creatorUserId:string,
  creatorUserName:string,
}

export interface AllPlaylistInputDTO {
  userId:string,
  page:number,
  limit?:number
}
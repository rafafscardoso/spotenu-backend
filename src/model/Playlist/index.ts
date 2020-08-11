import { SongAlbumDTO } from "../Song";

export class Playlist {
  constructor (
    private id:string,
    private name:string,
    private isPrivate:boolean,
    private creatorUserId:string,
    private creatorUserName:string,
    private songs:SongAlbumDTO[]
  ) {}

  public getId = ():string => this.id;

  public getName = ():string => this.name;

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
    new Playlist(playlist.id, playlist.name, playlist.isPrivate, playlist.creatorUserId, playlist.creatorUserName, playlist.songs)
  )
}

export interface PlaylistDTO {
  id:string,
  name:string,
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
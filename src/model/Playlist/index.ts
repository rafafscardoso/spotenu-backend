import { Song } from "../Song";

export class Playlist {
  constructor (
    private id:string,
    private name:string,
    private isPrivate:boolean,
    private userId:string,
    private userName:string,
    private quantity:number,
    private songs:Song[]
  ) {}

  public getId = ():string => this.id;

  public getName = ():string => this.name;

  public getIsPrivate = ():boolean => this.isPrivate;

  public getUserId = ():string => this.userId;

  public getUserName = ():string => this.userName;

  public getQuantity = ():number => this.quantity;

  public getSongs = ():Song[] => this.songs;

  public setId = (id:string):void => {
    this.id = id;
  }

  public setName = (name:string):void => {
    this.name = name;
  }

  public setIsPrivate = (isPrivate:boolean):void => {
    this.isPrivate = isPrivate;
  }

  public setUserId = (userId:string):void => {
    this.userId = userId;
  }

  public setUserName = (userName:string):void => {
    this.userName = userName;
  }

  public setQuantity = (quantity:number):void => {
    this.quantity = quantity;
  }

  public setSongs = (songs:Song[]):void => {
    this.songs = songs;
  }

  public static toPlaylistModel = (playlist:any):Playlist => (
    new Playlist(playlist.id, playlist.name, playlist.isPrivate, playlist.userId, playlist.userName, playlist.quantity, playlist.songs)
  )
}

export interface PlaylistInputDTO {
  name:string;
}

export interface PlaylistDTO {
  id:string;
  name:string;
  isPrivate:boolean;
  userId:string;
}

export interface PlaylistUserDTO {
  id:string;
  userId:string;
}

export interface PlaylistSongDTO {
  id:string;
  songId:string;
}

export interface PlaylistResponseDTO {
  id:string;
  name:string;
  isPrivate?:boolean;
  userId?:string;
  userName?:string;
  isFollowed?:boolean;
}

export interface GetPlaylistResponseDTO {
  playlists:PlaylistResponseDTO[];
  quantity?:number;
}

export interface GetPlaylistInputDTO {
  id?:string;
  userId?:string;
  page:number;
  limit?:number;
}

export interface EditPlaylistDTO {
  id:string;
  name:string;
}
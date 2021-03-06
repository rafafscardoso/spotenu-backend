import { MusicGenre } from "../Band";
import { SongAlbumDTO } from "../Song";

export class Album {
  constructor (
    private id:string,
    private name:string,
    private creatorBandId:string,
    private creatorBandName:string,
    private musicGenres:MusicGenre[],
    private songs:SongAlbumDTO[]
  ) {}

  public getId = ():string => this.id;

  public getName = ():string => this.name;

  public getCreatorBandId = ():string => this.creatorBandId;

  public getCreatorBandName = ():string => this.creatorBandName;

  public getMusicGenres = ():MusicGenre[] => this.musicGenres;

  public getSongs = ():SongAlbumDTO[] => this.songs;

  public setId = (id:string):void => {
    this.id = id;
  }

  public setName = (name:string):void => {
    this.name = name;
  }

  public setCreatorBandId = (creatorBandId:string):void => {
    this.creatorBandId = creatorBandId;
  }

  public setCreatorBandName = (creatorBAndName:string):void => {
    this.creatorBandName = creatorBAndName;
  }

  public setMusicGenres = (musicGenres:MusicGenre[]): void => {
    this.musicGenres = musicGenres;
  }

  public setSongs = (songs:SongAlbumDTO[]):void => {
    this.songs = songs;
  }

  public static toAlbumModel = (album:any):Album => (
    new Album(album.id, album.name, album.creatorBandId, album.creatorBandName, album.musicGenres, album.songs)
  )
}

export interface AlbumDTO {
  id:string;
  name:string;
  creatorBandId:string;
}

export interface AlbumInputDTO {
  name:string;
  musicGenres:MusicGenre[];
}

export interface AlbumGenreDTO {
  id?:string;
  musicGenres:MusicGenre[];
}

export interface AlbumResponseDTO {
  id:string;
  name:string; 
  creatorBandId:string;
  creatorBandName:string;
}

export interface AlbumBandDTO {
  id:string;
  creatorBandId:string;
}
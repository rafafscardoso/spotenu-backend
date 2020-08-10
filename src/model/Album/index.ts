import { MusicGenre } from "../Band";

export class Album {
  constructor (
    private id:string,
    private name:string,
    private image:string,
    private creatorBandId:string,
    private musicGenres:MusicGenre[]
  ) {}

  public getId = ():string => this.id;

  public getName = ():string => this.name;

  public getImage = ():string => this.image;

  public getCreatorBandId = ():string => this.creatorBandId;

  public getMusicGenres = ():MusicGenre[] => this.musicGenres;

  public setId = (id:string):void => {
    this.id = id;
  }

  public setName = (name:string):void => {
    this.name = name;
  }

  public setImage = (image:string):void => {
    this.image = image;
  }

  public setCreatorBandId = (creatorBandId:string):void => {
    this.creatorBandId = creatorBandId;
  }

  public setMusicGenres = (musicGenres:MusicGenre[]): void => {
    this.musicGenres = musicGenres;
  }

  public static toAlbumModel = (album:any):Album => (
    new Album(album.id, album.name, album.image, album.creatorBandId, album.musicGenres)
  )
}

export interface AlbumDTO {
  id:string,
  name:string,
  image:string,
  creatorBandId:string
}

export interface AlbumInputDTO {
  name:string,
  image:string,
  musicGenres:MusicGenre[]
}
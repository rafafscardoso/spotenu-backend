export class Song {
  constructor (
    private id:string,
    private name:string, 
    private albumId:string,
    private albumName:string,
    private creatorBandId:string,
    private creatorBandName:string
  ) {}

  public getId = ():string => this.id;

  public getName = ():string => this.name;

  public getAlbumId = ():string => this.albumId;

  public getAlbumName = ():string => this.albumName;

  public getCreatorBandId = ():string => this.creatorBandId;

  public getCreatorBandName = ():string => this.creatorBandName;

  public setId = (id:string):void => {
    this.id = id;
  }

  public setName = (name:string):void => {
    this.name = name;
  }

  public setAlbumId = (albumId:string):void => {
    this.albumId = albumId;
  }

  public setAlbumName = (albumName:string):void => {
    this.albumName = albumName;
  }

  public setCreatorBandId = (creatorBandId:string):void => {
    this.creatorBandId = creatorBandId;
  }

  public setCreatorBandName = (creatorBandName:string):void => {
    this.creatorBandName = creatorBandName;
  }

  public static toSongModel = (song:any):Song => (
    new Song(song.id, song.name, song.albumId, song.albumName, song.creatorBandId, song.creatorBandName)
  )
}

export interface SongDTO {
  id:string,
  name:string,
  albumId:string
}

export interface SongInputDTO {
  name:string,
  albumId:string
}

export interface SongAlbumDTO {
  id:string,
  name:string
}

export interface SongQueryDTO {
  query:string,
  page:number,
  limit?:number
}
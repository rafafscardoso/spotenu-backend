import { AlbumDatabase } from "../../data/AlbumDatabase";
import { AlbumGenreDatabase } from "../../data/AlbumGenreDatabase";
import { MusicGenreDatabase } from "../../data/MusicGenreDatabase";
import { SongDatabase } from "../../data/SongDatabase";
import { PlaylistSongDatabase } from "../../data/PlaylistSongDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator, AuthenticationData } from "../../service/Authenticator";

import { Album, AlbumInputDTO, AlbumDTO, AlbumGenreDTO, AlbumResponseDTO, AlbumBandDTO } from "../../model/Album";
import { User, MessageResponseDTO, USER_ROLES } from "../../model/User";
import { MusicGenre } from "../../model/Band";
import { SongAlbumDTO } from "../../model/Song";

import { UnauthorizedError } from "../../error/UnauthorizedError";
import { InvalidParameterError } from "../../error/InvalidParameterError";
import { NotFoundError } from "../../error/NotFoundError";

export class AlbumBusiness {
  constructor (
    private albumDatabase:AlbumDatabase,
    private albumGenreDatabase:AlbumGenreDatabase,
    private musicGenreDatabase:MusicGenreDatabase,
    private songDatabase:SongDatabase,
    private playlistSongDatabase:PlaylistSongDatabase,
    private idGenerator:IdGenerator,
    private authenticator:Authenticator
  ) {}

  public createAlbum = async (token:string, input:AlbumInputDTO):Promise<MessageResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.BAND) {
      throw new UnauthorizedError('Only accessible for band');
    }

    const { name, musicGenres } = input;
    const creatorBandId = authData.id;

    if (!name || !creatorBandId || !musicGenres.length) {
      throw new InvalidParameterError('Missing parameters');
    }

    for (let item of musicGenres) {
      const musicGenre = await this.musicGenreDatabase.getMusicGenreById(item.id);

      if (!musicGenre) {
        throw new InvalidParameterError('Music genre invalid');
      }
    }

    const id = this.idGenerator.generateId();
    const albumInput:AlbumDTO = { id, name, creatorBandId };

    await this.albumDatabase.createAlbum(albumInput);

    const albumGenreInput:AlbumGenreDTO = { id, musicGenres };

    await this.albumGenreDatabase.createAlbum(albumGenreInput);

    return { message: 'Album created successfully' };
  }

  public getAlbumById = async (token:string, albumId:string):Promise<Album> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) === USER_ROLES.ADMIN) {
      throw new UnauthorizedError('Only accessible for listener or band');
    }

    const checkAlbumExist = await this.albumDatabase.checkAlbumById(albumId);

    if (!checkAlbumExist) {
      throw new NotFoundError('Album not found');
    }

    const albumResponse:AlbumResponseDTO = await this.albumDatabase.getAlbumById(albumId);

    const musicGenres:MusicGenre[] = await this.albumGenreDatabase.getAlbumGenreByAlbumId(albumId);

    const songs:SongAlbumDTO[] = await this.songDatabase.getSongsByAlbumId(albumId);

    const albumInput = { ...albumResponse, musicGenres, songs };

    const album = Album.toAlbumModel(albumInput);

    return album;
  }

  public getAlbumsByBandId = async (token:string):Promise<AlbumResponseDTO[]> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.BAND) {
      throw new UnauthorizedError('Only accessible for band');
    }

    const albums:AlbumResponseDTO[] = await this.albumDatabase.getAlbumsByBandId(authData.id);

    return albums;
  }

  public deleteAlbum = async (token:string, albumId:string):Promise<MessageResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.BAND) {
      throw new UnauthorizedError('Only accessible for band');
    }

    const checkAlbumExist = await this.albumDatabase.checkAlbumById(albumId);

    if (!checkAlbumExist) {
      throw new NotFoundError('Album not found');
    }

    const checkAlbumByBandInput:AlbumBandDTO = { id: albumId, creatorBandId: authData.id };
    
    const checkAlbumByBand:boolean = await this.albumDatabase.checkAlbumByIdAndBandId(checkAlbumByBandInput);
    
    if (!checkAlbumByBand) {
      throw new InvalidParameterError('Album was not created by this band');
    }

    await this.playlistSongDatabase.deleteAlbum(albumId);

    await this.songDatabase.deleteAlbum(albumId);

    await this.albumGenreDatabase.deleteAlbum(albumId);

    await this.albumDatabase.deleteAlbum(albumId);

    return { message: 'Album deleted successfully' };
  }
}
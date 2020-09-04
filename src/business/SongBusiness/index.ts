import { SongDatabase } from "../../data/SongDatabase";
import { AlbumDatabase } from "../../data/AlbumDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator, AuthenticationData } from "../../service/Authenticator";

import { Song, SongDTO, SongInputDTO, SongQueryDTO, SongAlbumDTO, SongBandDTO, SongQueryResponseDTO, SongMusicGenreDTO } from "../../model/Song";
import { User, MessageResponseDTO, USER_ROLES } from "../../model/User";
import { AlbumBandDTO } from "../../model/Album";

import { UnauthorizedError } from "../../error/UnauthorizedError";
import { InvalidParameterError } from "../../error/InvalidParameterError";
import { NotFoundError } from "../../error/NotFoundError";

export class SongBusiness {
  constructor (
    private songDatabase:SongDatabase,
    private albumDatabase:AlbumDatabase,
    private idGenerator:IdGenerator,
    private authenticator:Authenticator
  ) {}

  public createSong = async (token:string, input:SongInputDTO):Promise<MessageResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.BAND) {
      throw new UnauthorizedError('Only accessible for band');
    }

    const { name, albumId } = input;

    if (!name || !albumId) {
      throw new InvalidParameterError('Missing parameters');
    }

    const checkAlbumExist = await this.albumDatabase.checkAlbumById(albumId);

    if (!checkAlbumExist) {
      throw new NotFoundError('Album not found');
    }

    const checkAlbumByBandInput:AlbumBandDTO = { id: albumId, creatorBandId: authData.id };

    const checkAlbumByBand = await this.albumDatabase.checkAlbumByIdAndBandId(checkAlbumByBandInput);

    if (!checkAlbumByBand) {
      throw new InvalidParameterError('Album was not created by this band');
    }

    const checkSongExist = await this.songDatabase.checkSongByNameAndAlbum(input);

    if (checkSongExist) {
      throw new InvalidParameterError('Song already exists in this album');
    }

    const id = this.idGenerator.generateId();
    const albumTrack = 1 + await this.songDatabase.countSongsByAlbumId(albumId);
    const songInput:SongDTO = { id, name, albumId, albumTrack };

    await this.songDatabase.createSong(songInput);

    return { message: 'Song created successfully' };
  }

  public getSongsByQuery = async (token:string, input:SongQueryDTO):Promise<SongQueryResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    const userRole = User.stringToUserRole(authData.role);

    if (userRole !== USER_ROLES.FREE && userRole !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for listener, free or premium');
    }

    const { query, page } = input;

    if (!query || !page) {
      throw new InvalidParameterError('Missing parameters');
    }

    const limit = 10;

    const queryInput:SongQueryDTO = { ...input, limit };

    const songs:SongAlbumDTO[] = await this.songDatabase.getSongsByQuery(queryInput);

    const quantity:number = await this.songDatabase.countSongsByQuery(query);

    const response:SongQueryResponseDTO = { songs, quantity };

    return response;
  }

  public getSongsByMusicGenre = async (token:string, input:SongMusicGenreDTO):Promise<any> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    const userRole = User.stringToUserRole(authData.role);

    if (userRole !== USER_ROLES.FREE && userRole !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for listener, free or premium');
    }

    const { musicGenreId, page } = input;

    if (!musicGenreId || !page) {
      throw new InvalidParameterError('Missing parameters');
    }

    const limit = 10;

    const musicGenreInput:SongMusicGenreDTO = { ...input, limit };

    const songs:SongAlbumDTO[] = await this.songDatabase.getSongsByMusicGenre(musicGenreInput);

    const quantity:number = await this.songDatabase.countSongsByMusicGenre(musicGenreId);

    const response:SongQueryResponseDTO = { songs, quantity };

    return response;
  }

  public getSongById = async (token:string, songId:string):Promise<Song> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    const userRole = User.stringToUserRole(authData.role);

    if (userRole === USER_ROLES.ADMIN) {
      throw new UnauthorizedError('Not accessible for admin');
    }

    if (userRole === USER_ROLES.BAND) {
      const checkSongByBandIdInput:SongBandDTO = { id: songId, bandId: authData.id };
  
      const checkSongByBandId:boolean = await this.songDatabase.checkSongByBandId(checkSongByBandIdInput);
  
      if (!checkSongByBandId) {
        throw new UnauthorizedError('Only accessible for the creator band')
      }
    }

    const song:Song = await this.songDatabase.getSongById(songId);

    if (!song) {
      throw new NotFoundError('Song not found');
    }

    return song;
  }

  public editSong = async (token:string, input:SongDTO):Promise<MessageResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.BAND) {
      throw new UnauthorizedError('Only accessible for band');
    }

    const { id, albumId } = input;

    if (!id) {
      throw new InvalidParameterError('Missing parameters');
    }

    if (albumId) {

      const checkAlbumExist = await this.albumDatabase.checkAlbumById(albumId);

      if (!checkAlbumExist) {
        throw new NotFoundError('Album not found');
      }

      const checkAlbumByBandInput:AlbumBandDTO = { id: albumId, creatorBandId: authData.id };
      
      const checkAlbumByBand = await this.albumDatabase.checkAlbumByIdAndBandId(checkAlbumByBandInput);
      
      if (!checkAlbumByBand) {
        throw new InvalidParameterError('Album was not created by this band');
      }
    }

    await this.songDatabase.editSong(input);

    return { message: 'Song edited successfully' };
  }
}
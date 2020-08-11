import { SongDatabase } from "../../data/SongDatabase";
import { AlbumDatabase } from "../../data/AlbumDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator, AuthenticationData } from "../../service/Authenticator";

import { Song, SongDTO, SongInputDTO, SongQueryDTO, SongAlbumDTO } from "../../model/Song";
import { User, SignUpResponseDTO, USER_ROLES } from "../../model/User";

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

  public createSong = async (token:string, input:SongInputDTO):Promise<SignUpResponseDTO> => {
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

    const checkSongExist = await this.songDatabase.checkSongByNameAndAlbum(input);

    if (checkSongExist) {
      throw new InvalidParameterError('Song already exists in this album');
    }

    const id = this.idGenerator.generateId();
    const songInput:SongDTO = { id, name, albumId };

    await this.songDatabase.createSong(songInput);

    return { message: 'Song created successfully' };
  }

  public getSongsByQuery = async (token:string, input:SongQueryDTO):Promise<SongAlbumDTO[]> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    const userRole = User.stringToUserRole(authData.role);

    if (userRole !== USER_ROLES.FREE && userRole !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for listener, free or premium');
    }

    const { query } = input;

    if (!query) {
      throw new InvalidParameterError('Missing parameters');
    }

    const limit = 10;

    const queryInput:SongQueryDTO = { ...input, limit };

    const songs:SongAlbumDTO[] = await this.songDatabase.getSongsByQuery(queryInput);

    return songs;
  }

  public getSongById = async (token:string, songId:string):Promise<Song> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    const userRole = User.stringToUserRole(authData.role);

    if (userRole !== USER_ROLES.FREE && userRole !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for listener, free or premium');
    }

    const song:Song = await this.songDatabase.getSongById(songId);

    if (!song) {
      throw new NotFoundError('Song not found');
    }

    return song;
  }
}
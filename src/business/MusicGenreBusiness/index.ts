import { MusicGenreDatabase } from "../../data/MusicGenreDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator, AuthenticationData } from "../../service/Authenticator";

import { User, USER_ROLES, MessageResponseDTO } from "../../model/User";
import { MusicGenre } from "../../model/Band";

import { InvalidParameterError } from "../../error/InvalidParameterError";
import { UnauthorizedError } from "../../error/UnauthorizedError";

export class MusicGenreBusiness {
  constructor (
    private musicGenreDataBase:MusicGenreDatabase,
    private idGenerator:IdGenerator,
    private authenticator:Authenticator
  ) {}

  public createMusicGenre = async (token:string, name:string):Promise<MessageResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError('Only accessible for admin');
    }

    if (!name) {
      throw new InvalidParameterError('Missing parameters');
    }

    const musicGenre:MusicGenre = await this.musicGenreDataBase.getMusicGenreByName(name);

    if (musicGenre) {
      throw new InvalidParameterError('Music genre has already been created');
    }

    const id = this.idGenerator.generateId();
    const musicGenreInput:MusicGenre = { id, name };

    await this.musicGenreDataBase.createMusicGenre(musicGenreInput);

    return { message: 'Music genre created successfully' };
  }

  public getAllMusicGenres = async (token:string):Promise<MusicGenre[]> => {
    this.authenticator.getData(token);

    const musicGenres:MusicGenre[] = await this.musicGenreDataBase.getAllMusicGenres();

    return musicGenres;
  }
}
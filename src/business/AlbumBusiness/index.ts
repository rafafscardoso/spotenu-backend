import { AlbumDatabase } from "../../data/AlbumDatabase";
import { AlbumGenreDatabase } from "../../data/AlbumGenreDatabase";
import { MusicGenreDatabase } from "../../data/MusicGenreDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator, AuthenticationData } from "../../service/Authenticator";

import { Album, AlbumInputDTO, AlbumDTO } from "../../model/Album";
import { User, SignUpResponseDTO, USER_ROLES } from "../../model/User";

import { UnauthorizedError } from "../../error/UnauthorizedError";
import { InvalidParameterError } from "../../error/InvalidParameterError";

export class AlbumBusiness {
  constructor (
    private albumDatabase:AlbumDatabase,
    private albumGenreDatabase:AlbumGenreDatabase,
    private musicGenreDatabase:MusicGenreDatabase,
    private idGenerator:IdGenerator,
    private authenticator:Authenticator
  ) {}

  public createAlbum = async (token:string, input:AlbumInputDTO):Promise<SignUpResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.BAND) {
      throw new UnauthorizedError('Only accessible for band');
    }

    const { name, image, musicGenres } = input;
    const creatorBandId = authData.id;

    if (!name || !image || !creatorBandId || !musicGenres.length) {
      throw new InvalidParameterError('Missing parameters');
    }

    for (let item of musicGenres) {
      const musicGenre = await this.musicGenreDatabase.getMusicGenreById(item.id);

      if (!musicGenre) {
        throw new InvalidParameterError('Music genre invalid');
      }
    }

    const id = this.idGenerator.generateId();
    const albumInput:AlbumDTO = { id, name, image, creatorBandId };

    await this.albumDatabase.createAlbum(albumInput);

    const albumGenreInput = { ...albumInput, musicGenres };

    await this.albumGenreDatabase.createAlbum(Album.toAlbumModel(albumGenreInput));

    return { message: 'Album created successfully' };
  }
}
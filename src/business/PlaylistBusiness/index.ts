import { PlaylistDatabase } from "../../data/PlaylistDatabase";
import { PlaylistUserDatabase } from "../../data/PlaylistUserDatabase";
import { PlaylistSongDatabase } from "../../data/PlaylistSongDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator, AuthenticationData } from "../../service/Authenticator";

import { User, SignUpResponseDTO, USER_ROLES } from "../../model/User";
import { PlaylistDTO, PlaylistUserDTO } from "../../model/Playlist";

import { UnauthorizedError } from "../../error/UnauthorizedError";
import { InvalidParameterError } from "../../error/InvalidParameterError";

export class PlaylistBusiness {
  constructor (
    private playlistDatabase:PlaylistDatabase,
    private playlistUserDatabase:PlaylistUserDatabase,
    private playlistSongDatabase:PlaylistSongDatabase,
    private idGenerator:IdGenerator,
    private authenticator:Authenticator
  ) {}

  public createPlaylist = async (token:string, name:string):Promise<SignUpResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for premium user');
    }

    if (!name) {
      throw new InvalidParameterError('Missing parameters');
    }

    const id = this.idGenerator.generateId();
    const isPrivate = true;
    const creatorUserId = authData.id;
    const playlistInput:PlaylistDTO = { id, name, isPrivate, creatorUserId };

    await this.playlistDatabase.createPlaylist(playlistInput);

    const playlistUserInput:PlaylistUserDTO = { id, creatorUserId };

    await this.playlistUserDatabase.followPlaylist(playlistUserInput);

    return { message: 'Playlist created successfully' };
  }
}
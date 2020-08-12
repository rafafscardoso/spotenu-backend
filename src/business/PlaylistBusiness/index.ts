import { PlaylistDatabase } from "../../data/PlaylistDatabase";
import { PlaylistUserDatabase } from "../../data/PlaylistUserDatabase";
import { PlaylistSongDatabase } from "../../data/PlaylistSongDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator, AuthenticationData } from "../../service/Authenticator";

import { User, SignUpResponseDTO, USER_ROLES } from "../../model/User";
import { PlaylistDTO, PlaylistUserDTO, PlaylistSongDTO, PlaylistInputDTO, PlaylistResponseDTO, AllPlaylistInputDTO } from "../../model/Playlist";

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

  public createPlaylist = async (token:string, input:PlaylistInputDTO):Promise<SignUpResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for premium user');
    }

    const { name, image } = input;

    if (!name || !image) {
      throw new InvalidParameterError('Missing parameters');
    }

    const id = this.idGenerator.generateId();
    const isPrivate = true;
    const creatorUserId = authData.id;
    const playlistInput:PlaylistDTO = { id, name, image, isPrivate, creatorUserId };

    await this.playlistDatabase.createPlaylist(playlistInput);

    const playlistUserInput:PlaylistUserDTO = { id, creatorUserId };

    await this.playlistUserDatabase.followPlaylist(playlistUserInput);

    return { message: 'Playlist created successfully' };
  }

  public addSongToPlaylist = async (token:string, input:PlaylistSongDTO):Promise<SignUpResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    const { id, songId } = input;

    if (!id || !songId) {
      throw new InvalidParameterError('Missing parameters');
    }

    const creatorUserId = authData.id;
    const playlistUserInput:PlaylistUserDTO = { id, creatorUserId };

    const checkPlaylistFollowed = await this.playlistUserDatabase.checkPlaylistFollowed(playlistUserInput);

    if (!checkPlaylistFollowed) {
      throw new InvalidParameterError('Playlist is not followed by user');
    }

    await this.playlistSongDatabase.addSongToPlaylist(input);

    return { message: 'Song added to playlist successfully' };
  }

  public removeSongFromPlaylist = async (token:string, input:PlaylistSongDTO):Promise<SignUpResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    const { id, songId } = input;

    if (!id || !songId) {
      throw new InvalidParameterError('Missing parameters');
    }

    const creatorUserId = authData.id;
    const playlistUserInput:PlaylistUserDTO = { id, creatorUserId };

    const checkPlaylistFollowed = await this.playlistUserDatabase.checkPlaylistFollowed(playlistUserInput);

    if (!checkPlaylistFollowed) {
      throw new InvalidParameterError('Playlist is not followed by user');
    }

    const checkSongInPlaylist = await this.playlistSongDatabase.checkSongInPlaylist(input);

    if (!checkSongInPlaylist) {
      throw new InvalidParameterError('Song is not is this playlist');
    }

    await this.playlistSongDatabase.removeSongFromPlaylist(input);

    return { message: 'Song removed from playlist successfully' };
  }

  public getAllPlaylistsByUserId = async (token:string, page:number):Promise<PlaylistResponseDTO[]> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    const userRole = User.stringToUserRole(authData.role);

    if (userRole !== USER_ROLES.FREE && userRole !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for listener, free or premium');
    }

    const userId = authData.id;

    const limit = 10;

    const getAllPlaylistInput:AllPlaylistInputDTO = { userId, page, limit };

    const playlists:PlaylistResponseDTO[] = await this.playlistDatabase.getAllPlaylistsByUserId(getAllPlaylistInput);

    return playlists;
  }
}
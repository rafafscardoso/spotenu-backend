import { PlaylistDatabase } from "../../data/PlaylistDatabase";
import { PlaylistUserDatabase } from "../../data/PlaylistUserDatabase";
import { PlaylistSongDatabase } from "../../data/PlaylistSongDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator, AuthenticationData } from "../../service/Authenticator";

import { User, SignUpResponseDTO, USER_ROLES } from "../../model/User";
import { SongQueryDTO } from "../../model/Song";
import { Playlist, PlaylistDTO, PlaylistUserDTO, PlaylistSongDTO, PlaylistInputDTO, PlaylistResponseDTO, AllPlaylistInputDTO, PlaylistByIdInputDTO } from "../../model/Playlist";

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
    const userId = authData.id;
    const playlistInput:PlaylistDTO = { id, name, image, isPrivate, userId };

    await this.playlistDatabase.createPlaylist(playlistInput);

    const playlistUserInput:PlaylistUserDTO = { id, userId };

    await this.playlistUserDatabase.followPlaylist(playlistUserInput);

    return { message: 'Playlist created successfully' };
  }

  public addSongToPlaylist = async (token:string, input:PlaylistSongDTO):Promise<SignUpResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for premium user');
    }

    const { id, songId } = input;

    if (!id || !songId) {
      throw new InvalidParameterError('Missing parameters');
    }

    const userId = authData.id;
    const playlistUserInput:PlaylistUserDTO = { id, userId };

    const checkPlaylistFollowed = await this.playlistUserDatabase.checkPlaylistFollowed(playlistUserInput);

    if (!checkPlaylistFollowed) {
      throw new InvalidParameterError('Playlist is not followed by user');
    }

    await this.playlistSongDatabase.addSongToPlaylist(input);

    return { message: 'Song added to playlist successfully' };
  }

  public removeSongFromPlaylist = async (token:string, input:PlaylistSongDTO):Promise<SignUpResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for premium user');
    }

    const { id, songId } = input;

    if (!id || !songId) {
      throw new InvalidParameterError('Missing parameters');
    }

    const userId = authData.id;
    const playlistUserInput:PlaylistUserDTO = { id, userId };

    const checkPlaylistFollowed = await this.playlistUserDatabase.checkPlaylistFollowed(playlistUserInput);

    if (!checkPlaylistFollowed) {
      throw new InvalidParameterError('Playlist is not followed by user');
    }

    const checkSongInPlaylist = await this.playlistSongDatabase.checkSongInPlaylist(input);

    if (!checkSongInPlaylist) {
      throw new InvalidParameterError('Song is not in this playlist');
    }

    await this.playlistSongDatabase.removeSongFromPlaylist(input);

    return { message: 'Song removed from playlist successfully' };
  }

  public getAllPlaylistsByUserId = async (token:string, page:number):Promise<PlaylistResponseDTO[]> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for premium user');
    }

    const userId = authData.id;

    const limit = 10;

    const getAllPlaylistInput:AllPlaylistInputDTO = { userId, page, limit };

    const playlists:PlaylistResponseDTO[] = await this.playlistDatabase.getAllPlaylistsByUserId(getAllPlaylistInput);

    return playlists;
  }

  public publishPlaylist = async (token:string, id:string):Promise<SignUpResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for premium user');
    }

    if (!id) {
      throw new InvalidParameterError('Missing parameters');
    }

    const userId = authData.id;

    const playlistUserInput:PlaylistUserDTO = { id, userId };

    const checkPlaylistCreatedByUser = await this.playlistDatabase.checkPlaylistCreatedByUser(playlistUserInput);

    if (!checkPlaylistCreatedByUser) {
      throw new InvalidParameterError('Playlist not created by user');
    }

    const checkPlaylistPrivate = await this.playlistDatabase.checkPlaylistPrivate(id);

    if (!checkPlaylistPrivate) {
      throw new InvalidParameterError('Playlist has already been published');
    }

    await this.playlistDatabase.publishPlaylist(id);

    return { message: 'Playlist published successfully' };
  }

  public followPlaylist = async (token:string, id:string):Promise<SignUpResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for premium user');
    }

    if (!id) {
      throw new InvalidParameterError('Missing parameters');
    }

    const userId = authData.id;

    const checkPlaylistPrivate = await this.playlistDatabase.checkPlaylistPrivate(id);

    if (checkPlaylistPrivate) {
      throw new InvalidParameterError('Playlist has not been published yet');
    }

    const playlistUserInput:PlaylistUserDTO = { id, userId };

    await this.playlistUserDatabase.followPlaylist(playlistUserInput);

    return { message: 'Playlist followed successfully' };
  }

  public getPlaylistById = async (token:string, input:PlaylistByIdInputDTO):Promise<Playlist> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for premium user');
    }

    const { id } = input;

    if (!id) {
      throw new InvalidParameterError('Missing parameters');
    }

    const playlistResponse:PlaylistResponseDTO = await this.playlistDatabase.getPlaylistById(id);

    const limit = 10;

    const playlistSongInput:PlaylistByIdInputDTO = { ...input, limit };

    const songs = await this.playlistSongDatabase.getSongsByPlaylistId(playlistSongInput);

    const playlistInput = { ...playlistResponse, songs };

    const playlist = Playlist.toPlaylistModel(playlistInput);

    return playlist;
  }

  public getPlaylistsByQuery = async (token:string, input:SongQueryDTO):Promise<PlaylistResponseDTO[]> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for premium user');
    }

    const { query } = input;

    if (!query) {
      throw new InvalidParameterError('Missing parameters');
    }

    const limit = 10;

    const queryInput:SongQueryDTO = { ...input, limit };

    const playlists:PlaylistResponseDTO[] = await this.playlistDatabase.getPlaylistsByQuery(queryInput);

    return playlists;
  }
}
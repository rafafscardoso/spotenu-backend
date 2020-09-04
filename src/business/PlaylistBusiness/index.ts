import { PlaylistDatabase } from "../../data/PlaylistDatabase";
import { PlaylistUserDatabase } from "../../data/PlaylistUserDatabase";
import { PlaylistSongDatabase } from "../../data/PlaylistSongDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator, AuthenticationData } from "../../service/Authenticator";

import { User, MessageResponseDTO, USER_ROLES } from "../../model/User";
import { 
  Playlist, 
  PlaylistDTO, 
  PlaylistUserDTO, 
  PlaylistSongDTO, 
  PlaylistInputDTO, 
  PlaylistResponseDTO, 
  GetPlaylistInputDTO, 
  EditPlaylistDTO, 
  GetPlaylistResponseDTO
} from "../../model/Playlist";

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

  public createPlaylist = async (token:string, input:PlaylistInputDTO):Promise<MessageResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for premium user');
    }

    const { name } = input;

    if (!name) {
      throw new InvalidParameterError('Missing parameters');
    }

    const id = this.idGenerator.generateId();
    const isPrivate = true;
    const userId = authData.id;
    const playlistInput:PlaylistDTO = { id, name, isPrivate, userId };

    await this.playlistDatabase.createPlaylist(playlistInput);

    const playlistUserInput:PlaylistUserDTO = { id, userId };

    await this.playlistUserDatabase.followPlaylist(playlistUserInput);

    return { message: 'Playlist created successfully' };
  }

  public addSongToPlaylist = async (token:string, input:PlaylistSongDTO):Promise<MessageResponseDTO> => {
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

  public removeSongFromPlaylist = async (token:string, input:PlaylistSongDTO):Promise<MessageResponseDTO> => {
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

  public getAllPlaylistsByUserId = async (token:string, page:number):Promise<GetPlaylistResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for premium user');
    }

    const userId = authData.id;

    if (!page) {
      const playlists:PlaylistResponseDTO[] = await this.playlistUserDatabase.getAllPlaylistsByUserId(userId);

      return { playlists };
    }

    const limit = 10;

    const getPlaylistInput:GetPlaylistInputDTO = { userId, page, limit };

    const playlists:PlaylistResponseDTO[] = await this.playlistDatabase.getAllPlaylistsByUserId(getPlaylistInput);

    const quantity:number = await this.playlistDatabase.countPlaylistsByUserId(userId);

    const response = { playlists, quantity };

    return response;
  }

  public getAllPublicPlaylists = async (token:string, page:number):Promise<GetPlaylistResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.PREMIUM) {
      throw new UnauthorizedError('Only accessible for premium user');
    }

    if (!page) {
      throw new InvalidParameterError('Missing parameters');
    }

    const limit = 10;

    const getPlaylistInput:GetPlaylistInputDTO = { page, limit };

    const playlistsResponse:PlaylistResponseDTO[] = await this.playlistDatabase.getAllPublicPlaylists(getPlaylistInput);

    const userId = authData.id;

    let playlists:PlaylistResponseDTO[] = [];

    for (const item of playlistsResponse) {
      const { id } = item;
      const playlistUserInput:PlaylistUserDTO = { id, userId };
      const isFollowed = await this.playlistUserDatabase.checkPlaylistFollowed(playlistUserInput);
      playlists.push({ ...item, isFollowed });
    }

    const quantity:number = await this.playlistDatabase.countPublicPlaylist();

    const response:GetPlaylistResponseDTO = { playlists, quantity };

    return response;
  }

  public publishPlaylist = async (token:string, id:string):Promise<MessageResponseDTO> => {
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

  public followPlaylist = async (token:string, id:string):Promise<MessageResponseDTO> => {
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

  public getPlaylistById = async (token:string, input:GetPlaylistInputDTO):Promise<Playlist> => {
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

    const playlistSongInput:GetPlaylistInputDTO = { ...input, limit };

    const songs = await this.playlistSongDatabase.getSongsByPlaylistId(playlistSongInput);

    const playlistInput = { ...playlistResponse, songs };

    const playlist = Playlist.toPlaylistModel(playlistInput);

    return playlist;
  }

  public editPlaylist = async (token:string, input:EditPlaylistDTO):Promise<MessageResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    const { id } = input;

    if (!id) {
      throw new InvalidParameterError('Missing parameters');
    }

    const userId = authData.id;
    const playlistUserInput:PlaylistUserDTO = { id, userId };

    const checkPlaylistFollowed = await this.playlistUserDatabase.checkPlaylistFollowed(playlistUserInput);

    if (!checkPlaylistFollowed) {
      throw new InvalidParameterError('Playlist is not followed by user');
    }

    await this.playlistDatabase.editPlaylist(input);

    return { message: 'Playlist edited successfully' };
  }
}
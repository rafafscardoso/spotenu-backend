import { BaseDatabase } from "../BaseDatabase";

import { PlaylistSongDTO } from "../../model/Playlist";

import { InternalServerError } from "../../error/InternalServerError";

export class PlaylistSongDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuPlaylistSong';

  public static getTableName = ():string => PlaylistSongDatabase.TABLE_NAME;

  public addSongToPlaylist = async (input:PlaylistSongDTO):Promise<void> => {
    const playlist_id = input.id;
    const song_id = input.songId;
    try {
      await this.getConnection()
        .insert({ playlist_id, song_id })
        .into(PlaylistSongDatabase.TABLE_NAME)
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
import { BaseDatabase } from "../BaseDatabase";
import { SongDatabase } from "../SongDatabase";
import { AlbumDatabase } from "../AlbumDatabase";
import { UserDatase } from "../UserDatabase";

import { PlaylistSongDTO, PlaylistByIdInputDTO } from "../../model/Playlist";
import { Song } from "../../model/Song";

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

  public checkSongInPlaylist = async (input:PlaylistSongDTO):Promise<boolean> => {
    const playlist_id = input.id;
    const song_id = input.songId;
    try {
      const result = await this.getConnection()
        .select('playlist_id as id', 'song_id as songId')
        .from(PlaylistSongDatabase.TABLE_NAME)
        .where({ playlist_id, song_id });
      if (result.length) {
        return true;
      }
      return false;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public removeSongFromPlaylist = async (input:PlaylistSongDTO):Promise<void> => {
    const playlist_id = input.id;
    const song_id = input.songId;
    try {
      await this.getConnection()
        .delete()
        .from(PlaylistSongDatabase.TABLE_NAME)
        .where({ playlist_id, song_id });
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getSongsByPlaylistId = async (input:PlaylistByIdInputDTO):Promise<Song[]> => {
    const playlist_id = input.id;
    const limit = input.limit;
    const offset = limit * (input.page - 1);
    const ps = PlaylistSongDatabase.TABLE_NAME;
    const s = SongDatabase.getTableName();
    const a = AlbumDatabase.getTableName();
    const u = UserDatase.getTableName();
    try {
      const result = await this.getConnection()
        .select(
          `${s}.id`,
          `${s}.name`,
          `${a}.id as albumId`,
          `${a}.name as albumName`,
          `${a}.image as albumImage`,
          `${u}.id as creatorBandId`,
          `${u}.name as creatorBandName`,
        )
        .from(s)
        .join(a, `${a}.id`, `${s}.album_id`)
        .join(u, `${u}.id`, `${a}.band_id`)
        .join(ps, `${ps}.song_id`, `${s}.id`)
        .where(`${ps}.playlist_id`, playlist_id)
        .limit(limit)
        .offset(offset);
      return result.map(item => (
        Song.toSongModel(item)
      ));
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
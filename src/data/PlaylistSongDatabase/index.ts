import { BaseDatabase } from "../BaseDatabase";
import { SongDatabase } from "../SongDatabase";
import { AlbumDatabase } from "../AlbumDatabase";
import { UserDatabase } from "../UserDatabase";

import { PlaylistSongDTO, GetPlaylistInputDTO } from "../../model/Playlist";
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

  public getSongsByPlaylistId = async (input:GetPlaylistInputDTO):Promise<Song[]> => {
    const playlist_id = input.id;
    const limit = input.limit;
    const offset = limit * (input.page - 1);
    const ps = PlaylistSongDatabase.TABLE_NAME;
    const s = SongDatabase.getTableName();
    const a = AlbumDatabase.getTableName();
    const u = UserDatabase.getTableName();
    try {
      const result = await this.getConnection()
        .select(
          `${s}.id`,
          `${s}.name`,
          `${a}.id as albumId`,
          `${a}.name as albumName`,
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
      return result.map(item => Song.toSongModel(item));
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public countSongsByPlaylistId = async (playlistId:string):Promise<number> => {
    const playlist_id = playlistId;
    try {
      const result = await this.getConnection()
        .select()
        .from(PlaylistSongDatabase.TABLE_NAME)
        .where({ playlist_id });
      return result.length;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public deleteSong = async (songId:string):Promise<void> => {
    const song_id = songId;
    try {
      await this.getConnection()
        .delete()
        .from(PlaylistSongDatabase.TABLE_NAME)
        .where({ song_id });
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public deleteAlbum = async (albumId:string):Promise<void> => {
    const album_id = albumId;
    try {
      const result = await this.getConnection()
        .select('id')
        .from(SongDatabase.getTableName())
        .where({ album_id });
      for (let item of result) {
        const { id } = item;
        this.deleteSong(id);
      }
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
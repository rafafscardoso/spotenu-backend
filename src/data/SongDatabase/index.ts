import { BaseDatabase } from "../BaseDatabase";
import { AlbumDatabase } from "../AlbumDatabase";
import { UserDatabase } from "../UserDatabase";

import { Song, SongDTO, SongInputDTO, SongAlbumDTO, SongQueryDTO } from "../../model/Song";

import { InternalServerError } from "../../error/InternalServerError";

export class SongDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuSong';

  public static getTableName = ():string => SongDatabase.TABLE_NAME;

  public createSong = async (input:SongDTO):Promise<void> => {
    const id = input.id;
    const name = input.name;
    const album_id = input.albumId;
    try {
      await this.getConnection()
        .insert({ id, name, album_id })
        .into(SongDatabase.TABLE_NAME);
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public checkSongByNameAndAlbum = async (input:SongInputDTO):Promise<boolean> => {
    const name = input.name;
    const album_id = input.albumId;
    try {
      const result = await this.getConnection()
        .select('id', 'name', 'album_id as albumId')
        .from(SongDatabase.TABLE_NAME)
        .where({ name })
        .andWhere({ album_id });
      if (result.length) {
        return true;
      }
      return false;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getSongsByAlbumId = async (albumId:string):Promise<SongAlbumDTO[]> => {
    const album_id = albumId;
    try {
      const result = await this.getConnection()
        .select('id', 'name')
        .from(SongDatabase.TABLE_NAME)
        .where({ album_id });
      return result;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getSongsByQuery = async (input:SongQueryDTO):Promise<SongAlbumDTO[]> => {
    const query = input.query;
    const limit = input.limit;
    const offset = limit * (input.page - 1);
    try {
      const result = await this.getConnection()
        .select('id', 'name')
        .from(SongDatabase.TABLE_NAME)
        .where({ name: query })
        .limit(limit)
        .offset(offset)
      return result;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getSongById = async (id:string):Promise<Song> => {
    const s = SongDatabase.TABLE_NAME;
    const a = AlbumDatabase.getTableName();
    const u = UserDatabase.getTableName();
    try {
      const result = await this.getConnection()
        .select(
          `${s}.id`,
          `${s}.name`,
          `${a}.id as albumId`,
          `${a}.name as albumName`,
          `${a}.image as albumImage`,
          `${u}.id as creatorBandId`,
          `${u}.name as creatorBandName`
        )
        .from(s)
        .join(a, `${s}.album_id`, `${a}.id`)
        .join(u, `${a}.band_id`, `${u}.id`)
        .where(`${s}.id`, id);
      return Song.toSongModel(result[0]);
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public editSong = async (input:SongDTO):Promise<void> => {
    const id = input.id;
    const name = input.name;
    const album_id = input.albumId;
    let editInput:any = {};
    if (name) {
      editInput = { ...editInput, name };
    }
    if (album_id) {
      editInput = { ...editInput, album_id };
    }
    try {
      await this.getConnection()
        .update(editInput)
        .from(SongDatabase.TABLE_NAME)
        .where({ id });
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
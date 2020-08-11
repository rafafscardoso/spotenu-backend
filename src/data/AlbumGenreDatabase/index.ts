import { BaseDatabase } from '../BaseDatabase';
import { MusicGenreDatabase } from '../MusicGenreDatabase';

import { AlbumGenreDTO } from '../../model/Album';
import { MusicGenre } from '../../model/Band';

import { InternalServerError } from "../../error/InternalServerError";

export class AlbumGenreDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuAlbumGenre';

  public static getTableName = ():string => AlbumGenreDatabase.TABLE_NAME;

  public createAlbum = async (input:AlbumGenreDTO):Promise<void> => {
    const album_id = input.id;
    const musicGenres = input.musicGenres;
    try {
      for (let item of musicGenres) {
        const genre_id = item.id;
        await this.getConnection()
          .insert({ album_id, genre_id })
          .into(AlbumGenreDatabase.TABLE_NAME);
      }
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getAlbumGenreByAlbumId = async (albumId:string):Promise<MusicGenre[]> => {
    const ag = AlbumGenreDatabase.TABLE_NAME;
    const mg = MusicGenreDatabase.getTableName();
    try {
      const result = await this.getConnection()
        .select(`${mg}.id`, `${mg}.name`)
        .from(ag)
        .join(mg, `${ag}.genre_id`, `${mg}.id`)
        .where(`${ag}.album_id`, albumId);
      return result;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
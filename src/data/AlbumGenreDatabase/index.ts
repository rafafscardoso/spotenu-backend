import { BaseDatabase } from '../BaseDatabase';

import { Album } from '../../model/Album';

import { InternalServerError } from "../../error/InternalServerError";

export class AlbumGenreDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuAlbumGenre';

  public static getTableName = ():string => AlbumGenreDatabase.TABLE_NAME;

  public createAlbum = async (input:Album):Promise<void> => {
    const album_id = input.getId();
    const musicGenres = input.getMusicGenres();
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
}
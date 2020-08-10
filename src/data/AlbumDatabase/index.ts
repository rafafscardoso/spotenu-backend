import { BaseDatabase } from '../BaseDatabase';

import { AlbumDTO } from '../../model/Album';

import { InternalServerError } from "../../error/InternalServerError";

export class AlbumDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuAlbum';

  public static getTableName = ():string => AlbumDatabase.TABLE_NAME;

  public createAlbum = async (input:AlbumDTO):Promise<void> => {
    const id = input.id;
    const name = input.name;
    const image = input.image;
    const band_id = input.creatorBandId;
    try {
      await this.getConnection()
        .insert({ id, name, image, band_id })
        .into(AlbumDatabase.TABLE_NAME);
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
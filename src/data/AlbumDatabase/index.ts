import { BaseDatabase } from '../BaseDatabase';
import { UserDatase } from '../UserDatabase';

import { AlbumDTO, AlbumResponseDTO } from '../../model/Album';
import { SongQueryDTO } from '../../model/Song';

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

  public checkAlbumById = async (id:string):Promise<boolean> => {
    try {
      const result = await this.getConnection()
        .select('id', 'name', 'image', 'band_id as creatorBandId')
        .from(AlbumDatabase.TABLE_NAME)
        .where({ id });
      if (result.length) {
        return true;
      }
      return false;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getAlbumById = async (id:string):Promise<AlbumResponseDTO> => {
    const a = AlbumDatabase.TABLE_NAME;
    const u = UserDatase.getTableName();
    try {
      const result = await this.getConnection()
        .select(
          `${a}.id`,
          `${a}.name`,
          `${a}.image`,
          `${u}.id as creatorBandId`,
          `${u}.name as creatorBandName`
        )
        .from(a)
        .join(u, `${a}.band_id`, `${u}.id`)
        .where(`${a}.id`, id);
      return result[0];
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getAlbumsByQuery = async (input:SongQueryDTO):Promise<AlbumResponseDTO[]> => {
    const query = input.query;
    const limit = input.limit;
    const offset = limit * (input.page - 1);
    const a = AlbumDatabase.TABLE_NAME;
    const u = UserDatase.getTableName();
    try {
      const result = await this.getConnection()
        .select(
          `${a}.id`,
          `${a}.name`,
          `${a}.image`,
          `${u}.id as creatorBandId`,
          `${u}.name as creatorBandName`
        )
        .from(a)
        .join(u, `${u}.id`, `${a}.creatorBandId`)
        .where(`${a}.name`, query)
        .limit(limit)
        .offset(offset);
      return result;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
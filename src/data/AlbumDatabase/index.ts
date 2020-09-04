import { BaseDatabase } from '../BaseDatabase';
import { UserDatabase } from '../UserDatabase';

import { AlbumDTO, AlbumResponseDTO, AlbumBandDTO } from '../../model/Album';

import { InternalServerError } from "../../error/InternalServerError";

export class AlbumDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuAlbum';

  public static getTableName = ():string => AlbumDatabase.TABLE_NAME;

  public createAlbum = async (input:AlbumDTO):Promise<void> => {
    const id = input.id;
    const name = input.name;
    const band_id = input.creatorBandId;
    try {
      await this.getConnection()
        .insert({ id, name, band_id })
        .into(AlbumDatabase.TABLE_NAME);
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public checkAlbumById = async (id:string):Promise<boolean> => {
    try {
      const result = await this.getConnection()
        .select('id', 'name', 'band_id as creatorBandId')
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

  public checkAlbumByIdAndBandId = async (input:AlbumBandDTO):Promise<boolean> => {
    const id = input.id;
    const band_id = input.creatorBandId;
    try {
      const result = await this.getConnection()
        .select('id', 'name', 'band_id as creatorBandId')
        .from(AlbumDatabase.TABLE_NAME)
        .where({ id, band_id });
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
    const u = UserDatabase.getTableName();
    try {
      const result = await this.getConnection()
        .select(
          `${a}.id`,
          `${a}.name`,
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

  public getAlbumsByBandId = async (bandId:string):Promise<AlbumResponseDTO[]> => {
    const a = AlbumDatabase.TABLE_NAME;
    const u = UserDatabase.getTableName();
    try {
      const result = await this.getConnection()
        .select(
          `${a}.id`,
          `${a}.name`,
          `${u}.id as creatorBandId`,
          `${u}.name as creatorBandName`
        )
        .from(a)
        .join(u, `${a}.band_id`, `${u}.id`)
        .where(`${u}.id`, bandId);
      return result;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
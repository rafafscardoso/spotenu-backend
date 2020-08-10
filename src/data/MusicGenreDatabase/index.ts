import { BaseDatabase } from "../BaseDatabase";

import { MusicGenre } from "../../model/Band";

import { InternalServerError } from "../../error/InternalServerError";

export class MusicGenreDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuMusicGenre';

  public static getTableName = ():string => MusicGenreDatabase.TABLE_NAME;

  public createMusicGenre = async (input:MusicGenre):Promise<void> => {
    const { id, name } = input;
    try {
      await this.getConnection()
        .insert({ id, name })
        .into(MusicGenreDatabase.TABLE_NAME);
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getMusicGenreByName = async (name:string):Promise<MusicGenre|undefined> => {
    try {
      const result = await this.getConnection()
        .select('*')
        .from(MusicGenreDatabase.TABLE_NAME)
        .where({ name });
      if (!result[0]) {
        return undefined;
      }
      return result[0];
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getMusicGenreById = async (id:string):Promise<MusicGenre|undefined> => {
    try {
      const result = await this.getConnection()
        .select('*')
        .from(MusicGenreDatabase.TABLE_NAME)
        .where({ id });
      if (!result[0]) {
        return undefined;
      }
      return result[0];
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getAllMusicGenres = async ():Promise<MusicGenre[]> => {
    try {
      const result = await this.getConnection()
        .select('*')
        .from(MusicGenreDatabase.TABLE_NAME);
      return result;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
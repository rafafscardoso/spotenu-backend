import { BaseDatabase } from "../BaseDatabase";

import { PlaylistDTO } from "../../model/Playlist";

import { InternalServerError } from "../../error/InternalServerError";

export class PlaylistDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuPlaylist';

  public static getTableName = ():string => PlaylistDatabase.TABLE_NAME;

  public createPlaylist = async (input:PlaylistDTO):Promise<void> => {
    const id = input.id;
    const name = input.name;
    const is_private = input.isPrivate ? 1 : 0;
    const user_id = input.creatorUserId;
    try {
      await this.getConnection()
        .insert({ id, name, is_private, user_id })
        .into(PlaylistDatabase.TABLE_NAME);
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
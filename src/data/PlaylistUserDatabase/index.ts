import { BaseDatabase } from "../BaseDatabase";
import { PlaylistDatabase } from "../PlaylistDatabase";

import { PlaylistUserDTO, PlaylistResponseDTO } from "../../model/Playlist";

import { InternalServerError } from "../../error/InternalServerError";

export class PlaylistUserDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuPlaylistUser';

  public static getTableName = ():string => PlaylistUserDatabase.TABLE_NAME;

  public followPlaylist = async (input:PlaylistUserDTO):Promise<void> => {
    const playlist_id = input.id;
    const user_id = input.userId;
    try {
      await this.getConnection()
        .insert({ playlist_id, user_id })
        .into(PlaylistUserDatabase.TABLE_NAME)
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public checkPlaylistFollowed = async (input:PlaylistUserDTO):Promise<boolean> => {
    const playlist_id = input.id;
    const user_id = input.userId;
    try {
      const result = await this.getConnection()
        .select('playlist_id as id', 'user_id as userId')
        .from(PlaylistUserDatabase.TABLE_NAME)
        .where({ playlist_id, user_id });
      if (result.length) {
        return true;
      }
      return false;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getAllPlaylistsByUserId = async (userId:string):Promise<PlaylistResponseDTO[]> => {
    const user_id = userId;
    const pu = PlaylistUserDatabase.TABLE_NAME;
    const p = PlaylistDatabase.getTableName();
    try {
      const result = await this.getConnection()
        .select(
          `${p}.id`,
          `${p}.name`
        )
        .from(p)
        .join(pu, `${p}.id`, `${pu}.playlist_id`)
        .where(`${pu}.user_id`, user_id);
      return result;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
import { BaseDatabase } from "../BaseDatabase";
import { UserDatase } from "../UserDatabase";
import { PlaylistUserDatabase } from "../PlaylistUserDatabase";
import { PlaylistSongDatabase } from "../PlaylistSongDatabase";

import { PlaylistDTO, PlaylistResponseDTO, AllPlaylistInputDTO } from "../../model/Playlist";

import { InternalServerError } from "../../error/InternalServerError";

export class PlaylistDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuPlaylist';

  public static getTableName = ():string => PlaylistDatabase.TABLE_NAME;

  public createPlaylist = async (input:PlaylistDTO):Promise<void> => {
    const id = input.id;
    const name = input.name;
    const image = input.image;
    const is_private = input.isPrivate ? 1 : 0;
    const user_id = input.creatorUserId;
    try {
      await this.getConnection()
        .insert({ id, name, image, is_private, user_id })
        .into(PlaylistDatabase.TABLE_NAME);
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getAllPlaylistsByUserId = async (input:AllPlaylistInputDTO):Promise<PlaylistResponseDTO[]> => {
    const user_id = input.userId;
    const limit = input.limit;
    const offset = limit * (input.page - 1);
    const p = PlaylistDatabase.TABLE_NAME;
    const pu = PlaylistUserDatabase.getTableName();
    const ps = PlaylistSongDatabase.getTableName();
    const u = UserDatase.getTableName();
    try {
      const result = await this.getConnection()
        .select(
          `${p}.id`,
          `${p}.name`,
          `${p}.image`,
          `${u}.id as creatorUserId`,
          `${u}.name as creatorUserName`
        )
        .from(p)
        .join(pu, `${p}.id`, `${pu}.playlist_id`)
        .join(ps, `${p}.id`, `${ps}.playlist_id`)
        .join(u, `${u}.id`, `${p}.user_id`)
        .where(`${u}.id`, user_id)
        .limit(limit)
        .offset(offset);
      return result;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
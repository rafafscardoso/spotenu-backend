import { BaseDatabase } from "../BaseDatabase";

import { PlaylistUserDTO } from "../../model/Playlist";

import { InternalServerError } from "../../error/InternalServerError";

export class PlaylistUserDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuPlaylistUser';

  public static getTableName = ():string => PlaylistUserDatabase.TABLE_NAME;

  public followPlaylist = async (input:PlaylistUserDTO):Promise<void> => {
    const playlist_id = input.id;
    const user_id = input.creatorUserId;
    try {
      await this.getConnection()
        .insert({ playlist_id, user_id })
        .into(PlaylistUserDatabase.TABLE_NAME)
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
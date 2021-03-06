import { BaseDatabase } from "../BaseDatabase";
import { UserDatabase } from "../UserDatabase";
import { PlaylistUserDatabase } from "../PlaylistUserDatabase";

import { PlaylistDTO, PlaylistResponseDTO, GetPlaylistInputDTO, PlaylistUserDTO, EditPlaylistDTO } from "../../model/Playlist";

import { InternalServerError } from "../../error/InternalServerError";

export class PlaylistDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuPlaylist';

  public static getTableName = ():string => PlaylistDatabase.TABLE_NAME;

  public createPlaylist = async (input:PlaylistDTO):Promise<void> => {
    const id = input.id;
    const name = input.name;
    const is_private = input.isPrivate ? 1 : 0;
    const user_id = input.userId;
    try {
      await this.getConnection()
        .insert({ id, name, is_private, user_id })
        .into(PlaylistDatabase.TABLE_NAME);
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getAllPlaylistsByUserId = async (input:GetPlaylistInputDTO):Promise<PlaylistResponseDTO[]> => {
    const user_id = input.userId;
    const limit = input.limit;
    const offset = limit * (input.page - 1);
    const p = PlaylistDatabase.TABLE_NAME;
    const pu = PlaylistUserDatabase.getTableName();
    const u = UserDatabase.getTableName();
    try {
      const result = await this.getConnection()
        .select(
          `${p}.id`,
          `${p}.name`,
          `${u}.id as userId`,
          `${u}.name as userName`
        )
        .from(p)
        .join(pu, `${p}.id`, `${pu}.playlist_id`)
        .join(u, `${u}.id`, `${p}.user_id`)
        .where(`${pu}.user_id`, user_id)
        .limit(limit)
        .offset(offset);
      return result;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public countPlaylistsByUserId = async (userId:string):Promise<number> => {
    const user_id = userId;
    const p = PlaylistDatabase.TABLE_NAME;
    const pu = PlaylistUserDatabase.getTableName();
    try {
      const result = await this.getConnection()
        .select(`${p}.id`)
        .from(p)
        .join(pu, `${p}.id`, `${pu}.playlist_id`)
        .where(`${pu}.user_id`, user_id);
      return result.length;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getAllPublicPlaylists = async (input:GetPlaylistInputDTO):Promise<PlaylistResponseDTO[]> => {
    const limit = input.limit;
    const offset = limit * (input.page - 1);
    const p = PlaylistDatabase.TABLE_NAME;
    const u = UserDatabase.getTableName();
    try {
      const result = await this.getConnection()
        .select(
          `${p}.id`,
          `${p}.name`,
          `${u}.id as userId`,
          `${u}.name as userName`
        )
        .from(p)
        .join(u, `${u}.id`, `${p}.user_id`)
        .where(`${p}.is_private`, 0)
        .limit(limit)
        .offset(offset);
      return result;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public countPublicPlaylist = async ():Promise<number> => {
    try {
      const result = await this.getConnection()
        .select(`id`)
        .from(PlaylistDatabase.TABLE_NAME)
        .where(`is_private`, 0);
      return result.length;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public checkPlaylistCreatedByUser = async (input:PlaylistUserDTO):Promise<boolean> => {
    const id = input.id;
    const user_id = input.userId;
    try {
      const result = await this.getConnection()
        .select('id', 'user_id as userId')
        .from(PlaylistDatabase.TABLE_NAME)
        .where({ id, user_id });
      if (result.length) {
        return true;
      }
      return false;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public checkPlaylistPrivate = async (id:string):Promise<boolean> => {
    const is_private = true ? 1 : 0;
    try {
      const result = await this.getConnection()
        .select('id', 'user_id as userId')
        .from(PlaylistDatabase.TABLE_NAME)
        .where({ id, is_private });
      if (result.length) {
        return true;
      }
      return false;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public publishPlaylist = async (id:string):Promise<void> => {
    const is_private = false ? 1 : 0;
    try {
      await this.getConnection()
        .update({ is_private })
        .from(PlaylistDatabase.TABLE_NAME)
        .where({ id });
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getPlaylistById = async (id:string):Promise<PlaylistResponseDTO> => {
    const p = PlaylistDatabase.TABLE_NAME;
    const u = UserDatabase.getTableName();
    try {
      const result = await this.getConnection()
        .select(
          `${p}.id`,
          `${p}.name`,
          `${p}.is_private as isPrivate`,
          `${u}.id as userId`,
          `${u}.name as userName`
        )
        .from(p)
        .join(u, `${p}.user_id`, `${u}.id`)
        .where(`${p}.id`, id);
      return { ...result[0], isPrivate: result[0].isPrivate ? true : false };
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public editPlaylist = async (input:EditPlaylistDTO):Promise<void> => {
    const id = input.id;
    const name = input.name;
    let editInput:any = {};
    if (name) {
      editInput = { ...editInput, name };
    }
    try {
      await this.getConnection()
        .update(editInput)
        .from(PlaylistDatabase.TABLE_NAME)
        .where({ id });
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
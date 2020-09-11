import { BaseDatabase } from "../BaseDatabase";

import { User, USER_ROLES, EditProfileDTO } from "../../model/User";
import { Band, ProfileResponseDTO, ListInputDTO } from "../../model/Band";

import { InternalServerError } from "../../error/InternalServerError";

export class UserDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuUser';

  public static getTableName = ():string => UserDatabase.TABLE_NAME;

  public createUser = async (input:User):Promise<void> => {
    const id = input.getId();
    const name = input.getName();
    const nickname = input.getNickname();
    const email = input.getEmail();
    const password = input.getPassword();
    const role = input.getRole();
    try {
      await this.getConnection()
        .insert({ id, name, nickname, email, password, role })
        .into(UserDatabase.TABLE_NAME);
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public createBand = async (input:Band):Promise<void> => {
    const id = input.getId();
    const name = input.getName();
    const nickname = input.getNickname();
    const email = input.getEmail();
    const password = input.getPassword();
    const role = input.getRole();
    const description = input.getDescription();
    const is_approved = input.getIsApproved() ? 1 : 0;
    try {
      await this.getConnection()
        .insert({ id, name, nickname, email, password, role, description, is_approved })
        .into(UserDatabase.TABLE_NAME);
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getUserByQuery = async (query:string):Promise<User|Band|undefined> => {
    try {
      const result = await this.getConnection()
        .select('id', 'name', 'nickname', 'email', 'password', 'role', 'description', 'is_approved as isApproved')
        .from(UserDatabase.TABLE_NAME)
        .where({ nickname: query })
        .orWhere({ email: query });
      if (!result.length) {
        return undefined;
      }
      if (User.stringToUserRole(result[0].role) === USER_ROLES.BAND) {
        return Band.toBandModel({ ...result[0], role: USER_ROLES.BAND, isApproved: result[0].isApproved ? true : false });
      }
      return User.toUserModel({ ...result[0], role: User.stringToUserRole(result[0].role) });
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getUserById = async (id:string):Promise<ProfileResponseDTO|undefined> => {
    try {
      const result = await this.getConnection()
        .select('id', 'name', 'nickname', 'email', 'role', 'description', 'is_approved as isApproved')
        .from(UserDatabase.TABLE_NAME)
        .where({ id });
      if (!result.length) {
        return undefined;
      }
      if (User.stringToUserRole(result[0].role) === USER_ROLES.BAND) {
        return { ...result[0], role: USER_ROLES.BAND, isApproved: result[0].isApproved ? true : false };
      }
      const { name, nickname, email, role } = result[0];
      return { id, name, nickname, email, role: User.stringToUserRole(role) };
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getAllBandsToApprove = async (input:ListInputDTO):Promise<ProfileResponseDTO[]> => {
    const limit = input.limit;
    const offset = limit * (input.page - 1);
    const role = User.stringToUserRole('band');
    const is_approved = false ? 1 : 0;
    try {
      const result = await this.getConnection()
        .select('id', 'name', 'nickname', 'email', 'is_approved as isApproved')
        .from(UserDatabase.TABLE_NAME)
        .where({ role, is_approved })
        .limit(limit)
        .offset(offset);
      return result.map((item:any) => {
        return { ...item, isApproved: item.isApproved ? true : false };
      });
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public countBandsToApprove = async ():Promise<number> => {
    const role = User.stringToUserRole('band');
    const is_approved = false ? 1 : 0;
    try {
      const result = await this.getConnection()
        .select('id')
        .from(UserDatabase.TABLE_NAME)
        .where({ role, is_approved });
      return result.length;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public approveBand = async (id:string):Promise<void> => {
    const is_approved = true ? 1 : 0;
    try {
      await this.getConnection()
        .update({ is_approved })
        .from(UserDatabase.TABLE_NAME)
        .where({ id });
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public upgradeFreeToPremium = async (id:string):Promise<void> => {
    const role = User.stringToUserRole('premium');
    try {
      await this.getConnection()
        .update({ role })
        .from(UserDatabase.TABLE_NAME)
        .where({ id });
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public editProfile = async (input:EditProfileDTO):Promise<void> => {
    const id = input.id;
    const name = input.name;
    let editInput:any = {}
    if (name) {
      editInput = { ...editInput, name };
    }
    try {
      await this.getConnection()
        .update(editInput)
        .from(UserDatabase.TABLE_NAME)
        .where({ id });
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public getAllFree = async (input:ListInputDTO):Promise<ProfileResponseDTO[]> => {
    const limit = input.limit;
    const offset = limit * (input.page - 1);
    const role = User.stringToUserRole('free');
    try {
      const result = await this.getConnection()
        .select('id', 'name', 'nickname', 'email', 'role')
        .from(UserDatabase.TABLE_NAME)
        .where({ role })
        .limit(limit)
        .offset(offset);
      return result;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }

  public countFree = async():Promise<number> => {
    const role = User.stringToUserRole('free');
    try {
      const result = await this.getConnection()
        .select('id')
        .from(UserDatabase.TABLE_NAME)
        .where({ role });
      return result.length;
    } catch (error) {
      throw new InternalServerError(error.sqlMessage || error.message);
    }
  }
}
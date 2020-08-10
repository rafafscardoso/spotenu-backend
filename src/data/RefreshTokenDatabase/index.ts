import { BaseDatabase } from "../BaseDatabase";
import { RefreshToken } from "../../model/RefreshToken";

export class RefreshTokenDatabase extends BaseDatabase {

  private static TABLE_NAME:string = 'spotenuRefreshToken';

  public static getTableName = ():string => RefreshTokenDatabase.TABLE_NAME;

  public createRefreshToken = async (input:RefreshToken):Promise<void> => {
    const refresh_token = input.getToken();
    const device = input.getDevice();
    const is_active = input.getIsActive() ? 1 : 0;
    const user_id = input.getUserId();
    await this.getConnection()
      .insert({ refresh_token, device, is_active, user_id })
      .into(RefreshTokenDatabase.TABLE_NAME);
  }

  public getRefreshTokenByToken = async (token:string):Promise<RefreshToken> => {
    const refresh_token = token;
    const result = await this.getConnection()
      .select('refresh_token as token', 'device', 'is_active as isActive', 'user_id as userId')
      .from(RefreshTokenDatabase.TABLE_NAME)
      .where({ refresh_token });

    return RefreshToken.toRefreshTokenModel({ ...result[0], isActive: result[0].isActive ? true : false });
  }

  public getRefreshTokenByIdAndDevice = async (id:string, device:string):Promise<RefreshToken|undefined> => {
    const user_id = id;
    const result = await this.getConnection()
      .select('refresh_token as token', 'device', 'is_active as isActive', 'user_id as userId')
      .from(RefreshTokenDatabase.TABLE_NAME)
      .where({ user_id, device });
    if (!result[0]) {
      return undefined;
    }
    return RefreshToken.toRefreshTokenModel({ ...result[0], isActive: result[0].isActive ? true : false });
  }

  public deleteRefreshTokenByToken = async (token:string):Promise<void> => {
    const refresh_token = token;
    await this.getConnection()
      .delete()
      .from(RefreshTokenDatabase.TABLE_NAME)
      .where({ refresh_token });
  }
}
import knex from 'knex';
import Knex from 'knex';

export abstract class BaseDatabase {
  private static CONNECTION:Knex|null = null;

  protected getConnection = ():Knex => {
    if (BaseDatabase.CONNECTION === null) {
      BaseDatabase.CONNECTION = knex({
        client: "mysql",
        connection: {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT || "3306"),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME
        }
      });
    }
    return BaseDatabase.CONNECTION;
  }

  public static destroyConnection = async ():Promise<void> => {
    if (BaseDatabase.CONNECTION) {
      await BaseDatabase.CONNECTION.destroy();
      BaseDatabase.CONNECTION = null;
    }
  }
}
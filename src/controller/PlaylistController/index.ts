import { Request, Response } from 'express';

import { PlaylistBusiness } from '../../business/PlaylistBusiness';

import { BaseDatabase } from '../../data/BaseDatabase';
import { PlaylistDatabase } from '../../data/PlaylistDatabase';
import { PlaylistUserDatabase } from '../../data/PlaylistUserDatabase';
import { PlaylistSongDatabase } from '../../data/PlaylistSongDatabase';

import { IdGenerator } from '../../service/IdGenerator';
import { Authenticator } from '../../service/Authenticator';

export class PlaylistController {
  private static playlistBusiness = new PlaylistBusiness(
    new PlaylistDatabase(),
    new PlaylistUserDatabase(),
    new PlaylistSongDatabase(),
    new IdGenerator(),
    new Authenticator()
  );

  public createPlaylist = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const { name } = req.body;

      const message = await PlaylistController.playlistBusiness.createPlaylist(token, name);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
}
import { Request, Response } from 'express';

import { MusicGenreBusiness } from '../../business/MusicGenreBusiness';

import { BaseDatabase } from '../../data/BaseDatabase';
import { MusicGenreDatabase } from "../../data/MusicGenreDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator } from '../../service/Authenticator';

import { MusicGenre } from '../../model/Band';
import { MessageResponseDTO } from '../../model/User';

export class MusicGenreController {
  private static musicGenreBusiness = new MusicGenreBusiness(
    new MusicGenreDatabase(),
    new IdGenerator(),
    new Authenticator()
  )

  public createMusicGenre = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const name = req.body.name.toUpperCase();

      const message:MessageResponseDTO = await MusicGenreController.musicGenreBusiness.createMusicGenre(token, name);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public getAllMusicGenres = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const musicGenres:MusicGenre[] = await MusicGenreController.musicGenreBusiness.getAllMusicGenres(token);

      res.status(200).send({ musicGenres });
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
}
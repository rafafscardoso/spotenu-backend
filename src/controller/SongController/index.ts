import { Request, Response } from 'express';

import { SongBusiness } from "../../business/SongBusiness";

import { BaseDatabase } from '../../data/BaseDatabase';
import { SongDatabase } from "../../data/SongDatabase";
import { AlbumDatabase } from "../../data/AlbumDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator } from "../../service/Authenticator";

import { Song, SongInputDTO, SongAlbumDTO, SongQueryDTO } from '../../model/Song';
import { SignUpResponseDTO } from '../../model/User';

export class SongController {
  private static songBusiness = new SongBusiness(
    new SongDatabase(),
    new AlbumDatabase(),
    new IdGenerator(),
    new Authenticator()
  );

  public createSong = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const input:SongInputDTO = req.body;

      const message:SignUpResponseDTO = await SongController.songBusiness.createSong(token, input);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public getSongsByQuery = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const query = req.query.query as string;

      const page = Number(req.query.page);

      const input:SongQueryDTO = { query, page };

      const songs:SongAlbumDTO[] = await SongController.songBusiness.getSongsByQuery(token, input);

      res.status(200).send({ songs });
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public getSongById = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const songId = req.params.id!;

      const song:Song = await SongController.songBusiness.getSongById(token, songId);

      res.status(200).send(song);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
}
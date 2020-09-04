import { Request, Response } from 'express';

import { SongBusiness } from "../../business/SongBusiness";

import { BaseDatabase } from '../../data/BaseDatabase';
import { SongDatabase } from "../../data/SongDatabase";
import { AlbumDatabase } from "../../data/AlbumDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator } from "../../service/Authenticator";

import { Song, SongInputDTO, SongQueryDTO, SongDTO, SongQueryResponseDTO, SongMusicGenreDTO } from '../../model/Song';
import { MessageResponseDTO } from '../../model/User';

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

      const message:MessageResponseDTO = await SongController.songBusiness.createSong(token, input);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public getSongsByQuery = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const query = req.query.query as string;

      const page = Number(req.query.page);

      const input:SongQueryDTO = { query, page };

      const songs:SongQueryResponseDTO = await SongController.songBusiness.getSongsByQuery(token, input);

      await BaseDatabase.destroyConnection();
      res.status(200).send(songs);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public getSongsByMusicGenre = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const musicGenreId = req.params.id as string;

      const page = Number(req.query.page);

      const input:SongMusicGenreDTO = { musicGenreId, page };

      const songs:SongQueryResponseDTO = await SongController.songBusiness.getSongsByMusicGenre(token, input);

      await BaseDatabase.destroyConnection();
      res.status(200).send(songs);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public getSongById = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const songId = req.params.id!;

      const song:Song = await SongController.songBusiness.getSongById(token, songId);

      await BaseDatabase.destroyConnection();
      res.status(200).send({ song });
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public editSong = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const id = req.params.id as string;

      const { name, albumId } = req.body;

      const input:SongDTO = { id, name, albumId };

      const message = await SongController.songBusiness.editSong(token, input);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }
}
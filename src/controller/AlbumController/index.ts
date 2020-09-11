import { Request, Response } from 'express';

import { AlbumBusiness } from '../../business/AlbumBusiness';

import { BaseDatabase } from '../../data/BaseDatabase';
import { AlbumDatabase } from "../../data/AlbumDatabase";
import { AlbumGenreDatabase } from "../../data/AlbumGenreDatabase";
import { MusicGenreDatabase } from "../../data/MusicGenreDatabase";
import { SongDatabase } from '../../data/SongDatabase';
import { PlaylistSongDatabase } from '../../data/PlaylistSongDatabase';

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator } from '../../service/Authenticator';

import { Album, AlbumInputDTO, AlbumResponseDTO } from '../../model/Album';
import { MessageResponseDTO } from '../../model/User';

export class AlbumController {
  private static albumBusiness = new AlbumBusiness(
    new AlbumDatabase(),
    new AlbumGenreDatabase(),
    new MusicGenreDatabase(),
    new SongDatabase(),
    new PlaylistSongDatabase(),
    new IdGenerator(),
    new Authenticator()
  );

  public createAlbum = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const input:AlbumInputDTO = req.body;

      const message:MessageResponseDTO = await AlbumController.albumBusiness.createAlbum(token, input);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public getAlbumById = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const albumId = req.params.id!;

      const album:Album = await AlbumController.albumBusiness.getAlbumById(token, albumId);

      await BaseDatabase.destroyConnection();
      res.status(200).send({ album });
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public getAlbumsByBandId = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const albums:AlbumResponseDTO[] = await AlbumController.albumBusiness.getAlbumsByBandId(token);

      await BaseDatabase.destroyConnection();
      res.status(200).send({ albums });
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public deleteAlbum = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const id = req.params.id as string;

      const message = await AlbumController.albumBusiness.deleteAlbum(token, id);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }
}
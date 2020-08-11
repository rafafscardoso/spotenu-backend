import { Request, Response } from 'express';

import { AlbumBusiness } from '../../business/AlbumBusiness';

import { BaseDatabase } from '../../data/BaseDatabase';
import { AlbumDatabase } from "../../data/AlbumDatabase";
import { AlbumGenreDatabase } from "../../data/AlbumGenreDatabase";
import { MusicGenreDatabase } from "../../data/MusicGenreDatabase";
import { SongDatabase } from '../../data/SongDatabase';

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator } from '../../service/Authenticator';

import { Album, AlbumInputDTO } from '../../model/Album';
import { SignUpResponseDTO } from '../../model/User';

export class AlbumController {
  private static albumBusiness = new AlbumBusiness(
    new AlbumDatabase(),
    new AlbumGenreDatabase(),
    new MusicGenreDatabase(),
    new SongDatabase(),
    new IdGenerator(),
    new Authenticator()
  );

  public createAlbum = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const input:AlbumInputDTO = req.body;

      const message:SignUpResponseDTO = await AlbumController.albumBusiness.createAlbum(token, input);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public getAlbumById = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const albumId = req.params.id!;

      const album:Album = await AlbumController.albumBusiness.getAlbumById(token, albumId);

      res.status(200).send(album);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
}
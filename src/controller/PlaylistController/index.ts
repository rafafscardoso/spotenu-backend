import { Request, Response } from 'express';

import { PlaylistBusiness } from '../../business/PlaylistBusiness';

import { BaseDatabase } from '../../data/BaseDatabase';
import { PlaylistDatabase } from '../../data/PlaylistDatabase';
import { PlaylistUserDatabase } from '../../data/PlaylistUserDatabase';
import { PlaylistSongDatabase } from '../../data/PlaylistSongDatabase';

import { IdGenerator } from '../../service/IdGenerator';
import { Authenticator } from '../../service/Authenticator';

import { Playlist, PlaylistInputDTO, PlaylistSongDTO, PlaylistResponseDTO, PlaylistByIdInputDTO, EditPlaylistDTO } from '../../model/Playlist';
import { MessageResponseDTO } from '../../model/User';
import { SongQueryDTO } from '../../model/Song';

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

      const input:PlaylistInputDTO = req.body;

      const message:MessageResponseDTO = await PlaylistController.playlistBusiness.createPlaylist(token, input);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public addSongToPlaylist = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const input:PlaylistSongDTO = req.body;

      const message:MessageResponseDTO = await PlaylistController.playlistBusiness.addSongToPlaylist(token, input);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public removeSongFromPlaylist = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const input:PlaylistSongDTO = req.body;

      const message:MessageResponseDTO = await PlaylistController.playlistBusiness.removeSongFromPlaylist(token, input);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public getAllPlaylistsByUserId = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const page = Number(req.query.page);

      const playlists:PlaylistResponseDTO[] = await PlaylistController.playlistBusiness.getAllPlaylistsByUserId(token, page);

      res.status(200).send({ playlists });
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public publishPlaylist = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const id = req.params.id as string;

      const message:MessageResponseDTO = await PlaylistController.playlistBusiness.publishPlaylist(token, id);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public followPlaylist = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const id = req.params.id as string;

      const message:MessageResponseDTO = await PlaylistController.playlistBusiness.followPlaylist(token, id);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public getPlaylistById = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const id = req.params.id as string;

      const page = Number(req.query.page);

      const input:PlaylistByIdInputDTO = { id, page };

      const playlist:Playlist = await PlaylistController.playlistBusiness.getPlaylistById(token, input);

      res.status(200).send(playlist);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public getPlaylistsByQuery = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const query = req.query.query as string;

      const page = Number(req.query.page);

      const input:SongQueryDTO = { query, page };

      const playlists:PlaylistResponseDTO[] = await PlaylistController.playlistBusiness.getPlaylistsByQuery(token,input);

      res.status(200).send({ playlists });
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public editPlaylist = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const id = req.params.id as string;

      const { name } = req.body;

      const input:EditPlaylistDTO = { id, name };

      const message = await PlaylistController.playlistBusiness.editPlaylist(token,input);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
}
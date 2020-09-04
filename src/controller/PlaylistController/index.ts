import { Request, Response } from 'express';

import { PlaylistBusiness } from '../../business/PlaylistBusiness';

import { BaseDatabase } from '../../data/BaseDatabase';
import { PlaylistDatabase } from '../../data/PlaylistDatabase';
import { PlaylistUserDatabase } from '../../data/PlaylistUserDatabase';
import { PlaylistSongDatabase } from '../../data/PlaylistSongDatabase';

import { IdGenerator } from '../../service/IdGenerator';
import { Authenticator } from '../../service/Authenticator';

import { Playlist, PlaylistInputDTO, PlaylistSongDTO, PlaylistResponseDTO, GetPlaylistInputDTO, EditPlaylistDTO, GetPlaylistResponseDTO } from '../../model/Playlist';
import { MessageResponseDTO } from '../../model/User';

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

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public addSongToPlaylist = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const input:PlaylistSongDTO = req.body;

      const message:MessageResponseDTO = await PlaylistController.playlistBusiness.addSongToPlaylist(token, input);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public removeSongFromPlaylist = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const id = req.params.id as string;

      const songId = req.params.songId as string;

      const input:PlaylistSongDTO = { id, songId };

      const message:MessageResponseDTO = await PlaylistController.playlistBusiness.removeSongFromPlaylist(token, input);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public getAllPlaylistsByUserId = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const page = Number(req.query.page);

      const playlists:GetPlaylistResponseDTO = await PlaylistController.playlistBusiness.getAllPlaylistsByUserId(token, page);

      await BaseDatabase.destroyConnection();
      res.status(200).send(playlists);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public getAllPublicPlaylists = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const page = Number(req.query.page);

      const playlists:GetPlaylistResponseDTO = await PlaylistController.playlistBusiness.getAllPublicPlaylists(token, page);

      await BaseDatabase.destroyConnection();
      res.status(200).send(playlists);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public publishPlaylist = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const id = req.params.id as string;

      const message:MessageResponseDTO = await PlaylistController.playlistBusiness.publishPlaylist(token, id);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public followPlaylist = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const id = req.params.id as string;

      const message:MessageResponseDTO = await PlaylistController.playlistBusiness.followPlaylist(token, id);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public getPlaylistById = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const id = req.params.id as string;

      const page = Number(req.query.page);

      const input:GetPlaylistInputDTO = { id, page };

      const playlist:Playlist = await PlaylistController.playlistBusiness.getPlaylistById(token, input);

      await BaseDatabase.destroyConnection();
      res.status(200).send({ playlist });
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public editPlaylist = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const id = req.params.id as string;

      const { name } = req.body;

      const input:EditPlaylistDTO = { id, name };

      const message = await PlaylistController.playlistBusiness.editPlaylist(token,input);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }
}
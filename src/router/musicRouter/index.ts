import express from 'express';

import { MusicGenreController } from '../../controller/MusicGenreController';
import { AlbumController } from '../../controller/AlbumController';
import { SongController } from '../../controller/SongController';

export const musicRouter = express.Router();

const musicGenreController = new MusicGenreController();

const albumController = new AlbumController();

const songController = new SongController();

musicRouter.put('/genre/create', musicGenreController.createMusicGenre);

musicRouter.get('/genre/all', musicGenreController.getAllMusicGenres);

musicRouter.put('/album/create', albumController.createAlbum);

musicRouter.put('/song/create', songController.createSong);

musicRouter.get('/album/:id', albumController.getAlbumById);

musicRouter.get('/song/query', songController.getSongsByQuery);

musicRouter.get('/song/:id', songController.getSongById);
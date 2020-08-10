import express from 'express';

import { MusicGenreController } from '../../controller/MusicGenreController';
import { AlbumController } from '../../controller/AlbumController';

export const musicRouter = express.Router();

const musicGenreController = new MusicGenreController();

const albumController = new AlbumController();

musicRouter.put('/genre/create', musicGenreController.createMusicGenre);

musicRouter.get('/genre/all', musicGenreController.getAllMusicGenres);

musicRouter.put('/album/create', albumController.createAlbum);
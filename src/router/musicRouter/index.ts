import express from 'express';

import { MusicGenreController } from '../../controller/MusicGenreController';
import { AlbumController } from '../../controller/AlbumController';
import { SongController } from '../../controller/SongController';
import { PlaylistController } from '../../controller/PlaylistController';

export const musicRouter = express.Router();

const musicGenreController = new MusicGenreController();

const albumController = new AlbumController();

const songController = new SongController();

const playlistController = new PlaylistController();

musicRouter.put('/genre/create', musicGenreController.createMusicGenre);

musicRouter.get('/genre/all', musicGenreController.getAllMusicGenres);

musicRouter.put('/album/create', albumController.createAlbum);

musicRouter.put('/song/create', songController.createSong);

musicRouter.get('/album/band/all', albumController.getAlbumsByBandId);

musicRouter.get('/album/:id', albumController.getAlbumById);

musicRouter.get('/song/query', songController.getSongsByQuery);

musicRouter.get('/song/genre/:id', songController.getSongsByMusicGenre);

musicRouter.get('/song/:id', songController.getSongById);

musicRouter.put('/playlist/create', playlistController.createPlaylist);

musicRouter.put('/playlist/song', playlistController.addSongToPlaylist);

musicRouter.delete('/playlist/:id/song/:songId', playlistController.removeSongFromPlaylist);

musicRouter.get('/playlist/all', playlistController.getAllPlaylistsByUserId);

musicRouter.get('/playlist/public', playlistController.getAllPublicPlaylists);

musicRouter.put('/playlist/publish/:id', playlistController.publishPlaylist);

musicRouter.put('/playlist/follow/:id', playlistController.followPlaylist);

musicRouter.get('/playlist/:id', playlistController.getPlaylistById);

musicRouter.put('/playlist/edit/:id', playlistController.editPlaylist);

musicRouter.put('/song/edit/:id', songController.editSong);

musicRouter.delete('/song/:id', songController.deleteSong);

musicRouter.delete('/album/:id', albumController.deleteAlbum);
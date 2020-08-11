import { Request, Response } from 'express';

import { UserBusiness } from "../../business/UserBusiness";

import { BaseDatabase } from '../../data/BaseDatabase';
import { UserDatase } from "../../data/UserDatabase";
import { RefreshTokenDatabase } from "../../data/RefreshTokenDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator } from "../../service/Authenticator";
import { HashManager } from "../../service/HashManager";

import { SignUpInputDTO, SignUpResponseDTO, LoginInputDTO } from '../../model/User';
import { TokenResponseDTO } from '../../model/RefreshToken';
import { GetAllBandsResponseDTO } from '../../model/Band';

export class UserController {
  private static userBusiness = new UserBusiness(
    new UserDatase(),
    new RefreshTokenDatabase(),
    new IdGenerator(),
    new Authenticator(),
    new HashManager()
  );

  public signUp = async (req:Request, res:Response) => {
    try {
      const input:SignUpInputDTO = req.body;

      const token:TokenResponseDTO = await UserController.userBusiness.signUp(input);

      res.status(200).send(token);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public createAdmin = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const input:SignUpInputDTO = req.body;

      const message:SignUpResponseDTO = await UserController.userBusiness.createAdmin(token, input);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public createBand = async (req:Request, res:Response) => {
    try {
      const input:SignUpInputDTO = req.body;

      const message:SignUpResponseDTO = await UserController.userBusiness.createBand(input);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public login = async (req:Request, res:Response) => {
    try {
      const input:LoginInputDTO = req.body;

      const token:TokenResponseDTO = await UserController.userBusiness.login(input);

      res.status(200).send(token);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public getAllBands = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const bands:GetAllBandsResponseDTO[] = await UserController.userBusiness.getAllBands(token);

      res.status(200).send({ bands });
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public approveBand = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const bandId = req.params.id!;

      const message:SignUpResponseDTO = await UserController.userBusiness.approveBand(token, bandId);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public updateFreeToPremium = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const userId = req.params.id!;

      const message:SignUpResponseDTO = await UserController.userBusiness.updateFreeToPremium(token, userId);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public getAccessTokenByRefreshToken = async (req:Request, res:Response) => {
    try {
      const refreshToken = req.headers.authorization!;

      const { device } = req.body;

      const input = { refreshToken, device };

      const token:TokenResponseDTO = await UserController.userBusiness.getAccessTokenByRefreshToken(input);

      res.status(200).send(token);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
}
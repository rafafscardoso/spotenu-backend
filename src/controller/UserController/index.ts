import { Request, Response } from 'express';

import { UserBusiness } from "../../business/UserBusiness";

import { BaseDatabase } from '../../data/BaseDatabase';
import { UserDatabase } from "../../data/UserDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator } from "../../service/Authenticator";
import { HashManager } from "../../service/HashManager";

import { SignUpInputDTO, MessageResponseDTO, LoginInputDTO, EditProfileDTO, TokenResponseDTO } from '../../model/User';
import { GetAllBandsResponseDTO, ProfileResponseDTO } from '../../model/Band';

export class UserController {
  private static userBusiness = new UserBusiness(
    new UserDatabase(),
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

      const message:MessageResponseDTO = await UserController.userBusiness.createAdmin(token, input);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public createBand = async (req:Request, res:Response) => {
    try {
      const input:SignUpInputDTO = req.body;

      const message:MessageResponseDTO = await UserController.userBusiness.createBand(input);

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

      const bandId = req.params.id as string;

      const message:MessageResponseDTO = await UserController.userBusiness.approveBand(token, bandId);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public updateFreeToPremium = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const userId = req.params.id as string;

      const message:MessageResponseDTO = await UserController.userBusiness.updateFreeToPremium(token, userId);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public getProfile = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const user:ProfileResponseDTO = await UserController.userBusiness.getProfile(token);

      res.status(200).send(user);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }

  public editProfile = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const input:EditProfileDTO = req.body;

      const message = await UserController.userBusiness.editProfile(token, input);

      res.status(200).send(message);
    } catch (error) {
      res.status(error.statusCode || 400).send({ message: error.message });
    }

    await BaseDatabase.destroyConnection();
  }
}
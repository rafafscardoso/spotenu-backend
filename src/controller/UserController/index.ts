import { Request, Response } from 'express';

import { UserBusiness } from "../../business/UserBusiness";

import { BaseDatabase } from '../../data/BaseDatabase';
import { UserDatabase } from "../../data/UserDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator } from "../../service/Authenticator";
import { HashManager } from "../../service/HashManager";

import { SignUpInputDTO, MessageResponseDTO, LoginInputDTO, EditProfileDTO, TokenResponseDTO, GetAllListenersResponseDTO } from '../../model/User';
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

      await BaseDatabase.destroyConnection();
      res.status(200).send(token);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public createAdmin = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const input:SignUpInputDTO = req.body;

      const message:MessageResponseDTO = await UserController.userBusiness.createAdmin(token, input);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public createBand = async (req:Request, res:Response) => {
    try {
      const input:SignUpInputDTO = req.body;

      const message:MessageResponseDTO = await UserController.userBusiness.createBand(input);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public login = async (req:Request, res:Response) => {
    try {
      const input:LoginInputDTO = req.body;

      const token:TokenResponseDTO = await UserController.userBusiness.login(input);

      await BaseDatabase.destroyConnection();
      res.status(200).send(token);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public getAllBands = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const bands:GetAllBandsResponseDTO[] = await UserController.userBusiness.getAllBands(token);

      await BaseDatabase.destroyConnection();
      res.status(200).send({ bands });
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public approveBand = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const bandId = req.params.id as string;

      const message:MessageResponseDTO = await UserController.userBusiness.approveBand(token, bandId);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public upgradeFreeToPremium = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const userId = req.params.id as string;

      const message:MessageResponseDTO = await UserController.userBusiness.upgradeFreeToPremium(token, userId);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public getProfile = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const user:ProfileResponseDTO = await UserController.userBusiness.getProfile(token);

      await BaseDatabase.destroyConnection();
      res.status(200).send({ user });
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public editProfile = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const input:EditProfileDTO = req.body;

      const message = await UserController.userBusiness.editProfile(token, input);

      await BaseDatabase.destroyConnection();
      res.status(200).send(message);
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }

  public getAllListeners = async (req:Request, res:Response) => {
    try {
      const token = req.headers.authorization!;

      const listeners:GetAllListenersResponseDTO[] = await UserController.userBusiness.getAllListeners(token);
      
      await BaseDatabase.destroyConnection();
      res.status(200).send({ listeners });
    } catch (error) {
      await BaseDatabase.destroyConnection();
      res.status(error.statusCode || 400).send({ message: error.message });
    }
  }
}
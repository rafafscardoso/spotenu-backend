import { UserDatabase } from "../../data/UserDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator, AuthenticationData } from "../../service/Authenticator";
import { HashManager } from "../../service/HashManager";

import { User, SignUpInputDTO, LoginInputDTO, MessageResponseDTO, USER_ROLES, EditProfileDTO, TokenResponseDTO } from '../../model/User';
import { Band, GetAllBandsResponseDTO, ProfileResponseDTO } from "../../model/Band";

import { InvalidParameterError } from "../../error/InvalidParameterError";
import { UnauthorizedError } from "../../error/UnauthorizedError";
import { NotFoundError } from "../../error/NotFoundError";

export class UserBusiness {
  constructor (
    private userDatabase:UserDatabase,
    private idGenerator:IdGenerator,
    private authenticator:Authenticator,
    private hashManager:HashManager
  ) {}

  public signUp = async (input:SignUpInputDTO):Promise<TokenResponseDTO> => {
    const { name, nickname, email, password } = input;

    if (!name || !nickname || !email || !password) {
      throw new InvalidParameterError('Missing parameters');
    }
    if (email.indexOf('@') === -1) {
      throw new InvalidParameterError('Invalid email');
    }
    if (password.length < 6) {
      throw new InvalidParameterError('Invalid password');
    }

    const id:string = this.idGenerator.generateId();
    const hashPassword:string = await this.hashManager.hash(password);
    const role:USER_ROLES = User.stringToUserRole('free');
    const userInput = { id, name, nickname, email, password: hashPassword, role };

    await this.userDatabase.createUser(User.toUserModel(userInput));

    const token = this.authenticator.generateToken({ id, role }, process.env.ACCESS_TOKEN_EXPIRES_IN);

    return { token };
  }

  public createAdmin = async (token:string, input:SignUpInputDTO):Promise<MessageResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError('Only accessible for admin');
    }

    const { name, nickname, email, password } = input;

    if (!name || !nickname || !email || !password) {
      throw new InvalidParameterError('Missing parameters');
    }
    if (email.indexOf('@') === -1) {
      throw new InvalidParameterError('Invalid email');
    }
    if (password.length < 10) {
      throw new InvalidParameterError('Invalid password');
    }

    const id:string = this.idGenerator.generateId();
    const hashPassword:string = await this.hashManager.hash(password);
    const role:USER_ROLES = User.stringToUserRole('admin');
    const userInput = { id, name, nickname, email, password: hashPassword, role };

    await this.userDatabase.createUser(User.toUserModel(userInput));

    return { message: 'Admin created successfully' };
  }

  public createBand = async (input:SignUpInputDTO):Promise<MessageResponseDTO> => {
    const { name, nickname, email, password, description } = input;

    if (!name || !nickname || !email || !password || !description) {
      throw new InvalidParameterError('Missing parameters');
    }
    if (email.indexOf('@') === -1) {
      throw new InvalidParameterError('Invalid email');
    }
    if (password.length < 6) {
      throw new InvalidParameterError('Invalid password');
    }

    const id:string = this.idGenerator.generateId();
    const hashPassword:string = await this.hashManager.hash(password);
    const role:USER_ROLES = User.stringToUserRole('band');
    const isApproved:boolean = false;
    const bandInput = { id, name, nickname, email, password: hashPassword, role, description, isApproved };

    await this.userDatabase.createBand(Band.toBandModel(bandInput));

    return { message: 'Band created successfully' };
  }

  public login = async (input:LoginInputDTO):Promise<TokenResponseDTO> => {
    const { username, password } = input;

    if (!username || !password) {
      throw new InvalidParameterError('Missing parameters');
    }

    const user:User = await this.userDatabase.getUserByQuery(username);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.getRole() === USER_ROLES.BAND) {
      const band = Band.toBandModel(user);
      if (!band.getIsApproved()) {
        throw new UnauthorizedError('Band must be approved to get logged in');
      }
    }

    const isPasswordCorrect = await this.hashManager.compare(password, user.getPassword());
    if (!isPasswordCorrect) {
      throw new InvalidParameterError('Incorrect password');
    }
    const id = user.getId();
    const role = user.getRole();

    const token = this.authenticator.generateToken({ id, role }, process.env.ACCESS_TOKEN_EXPIRES_IN);

    return { token };
  }

  public getAllBands = async (token:string):Promise<GetAllBandsResponseDTO[]> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError('Only accessible for admin');
    }

    const bands:GetAllBandsResponseDTO[] = await this.userDatabase.getAllBands()

    return bands;
  }

  public approveBand = async (token:string, bandId:string):Promise<MessageResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError('Only accessible for admin');
    }

    const user = await this.userDatabase.getUserById(bandId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (User.stringToUserRole(user.role) === USER_ROLES.BAND) {
      if (user.isApproved) {
        throw new InvalidParameterError('Band has already been approved');
      }
    }

    await this.userDatabase.approveBand(bandId);

    return { message: 'Band approved successfully' };
  }

  public updateFreeToPremium = async (token:string, userId:string):Promise<MessageResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError('Only accessible for admin');
    }

    const user:ProfileResponseDTO = await this.userDatabase.getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (User.stringToUserRole(user.role) === USER_ROLES.PREMIUM) {
      throw new InvalidParameterError('User has already been premium');
    }

    await this.userDatabase.updateFreeToPremium(userId);

    return { message: 'Updated to premium successfully' };
  }

  public getProfile = async (token:string):Promise<ProfileResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    const user:ProfileResponseDTO = await this.userDatabase.getUserById(authData.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  public editProfile = async (token:string, input:EditProfileDTO):Promise<MessageResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    const id = authData.id;

    const editInput:EditProfileDTO = { ...input, id };

    await this.userDatabase.editProfile(editInput);

    return { message: 'Profile edited successfully' };
  }
}
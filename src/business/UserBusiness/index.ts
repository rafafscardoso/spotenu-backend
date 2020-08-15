import { UserDatabase } from "../../data/UserDatabase";
import { RefreshTokenDatabase } from "../../data/RefreshTokenDatabase";

import { IdGenerator } from "../../service/IdGenerator";
import { Authenticator, AuthenticationData } from "../../service/Authenticator";
import { HashManager } from "../../service/HashManager";

import { User, SignUpInputDTO, LoginInputDTO, SignUpResponseDTO, USER_ROLES, EditProfileDTO } from '../../model/User';
import { Band, GetAllBandsResponseDTO, ProfileResponseDTO } from "../../model/Band";
import { RefreshToken, TokenResponseDTO, RefreshTokenInputDTO } from "../../model/RefreshToken";

import { InvalidParameterError } from "../../error/InvalidParameterError";
import { UnauthorizedError } from "../../error/UnauthorizedError";
import { NotFoundError } from "../../error/NotFoundError";

export class UserBusiness {
  constructor (
    private userDatabase:UserDatabase,
    private refreshTokenDatabase:RefreshTokenDatabase,
    private idGenerator:IdGenerator,
    private authenticator:Authenticator,
    private hashManager:HashManager
  ) {}

  public signUp = async (input:SignUpInputDTO):Promise<TokenResponseDTO> => {
    const { name, nickname, email, password, device, image } = input;

    if (!name || !nickname || !email || !password || !device || !image) {
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
    const userInput = { id, name, nickname, email, password: hashPassword, role, image };

    await this.userDatabase.createUser(User.toUserModel(userInput));

    const accessToken = this.authenticator.generateToken({ id, role }, process.env.ACCESS_TOKEN_EXPIRES_IN);
    const refreshToken = this.authenticator.generateToken({ id, device }, process.env.REFRESH_TOKEN_EXPIRES_IN);
    const refreshTokenInput = { token: refreshToken, device, isActive: true, userId: id };

    await this.refreshTokenDatabase.createRefreshToken(RefreshToken.toRefreshTokenModel(refreshTokenInput));

    return { accessToken, refreshToken };
  }

  public createAdmin = async (token:string, input:SignUpInputDTO):Promise<SignUpResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError('Only accessible for admin');
    }

    const { name, nickname, email, password, device, image } = input;

    if (!name || !nickname || !email || !password || !device || !image) {
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
    const userInput = { id, name, nickname, email, password: hashPassword, role, image };

    await this.userDatabase.createUser(User.toUserModel(userInput));

    return { message: 'Admin created successfully' };
  }

  public createBand = async (input:SignUpInputDTO):Promise<SignUpResponseDTO> => {
    const { name, nickname, email, password, description, device, image } = input;

    if (!name || !nickname || !email || !password || !description || !device|| !image) {
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
    const bandInput = { id, name, nickname, email, password: hashPassword, role, image, description, isApproved };

    await this.userDatabase.createBand(Band.toBandModel(bandInput));

    return { message: 'Band created successfully' };
  }

  public login = async (input:LoginInputDTO):Promise<TokenResponseDTO> => {
    const { username, password, device } = input;

    if (!username || !password || !device) {
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

    const accessToken = this.authenticator.generateToken({ id, role }, process.env.ACCESS_TOKEN_EXPIRES_IN);
    const refreshToken = this.authenticator.generateToken({ id, device }, process.env.REFRESH_TOKEN_EXPIRES_IN);

    const refreshTokenFromDb = await this.refreshTokenDatabase.getRefreshTokenByIdAndDevice(id, device);
    if (refreshTokenFromDb) {
      await this.refreshTokenDatabase.deleteRefreshTokenByToken(refreshTokenFromDb.getToken());
    }

    const refreshTokenInput = { token: refreshToken, device, isActive: true, userId: id };

    await this.refreshTokenDatabase.createRefreshToken(RefreshToken.toRefreshTokenModel(refreshTokenInput));

    return { accessToken, refreshToken };
  }

  public getAllBands = async (token:string):Promise<GetAllBandsResponseDTO[]> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    if (User.stringToUserRole(authData.role) !== USER_ROLES.ADMIN) {
      throw new UnauthorizedError('Only accessible for admin');
    }

    const bands:GetAllBandsResponseDTO[] = await this.userDatabase.getAllBands()

    return bands;
  }

  public approveBand = async (token:string, bandId:string):Promise<SignUpResponseDTO> => {
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

  public updateFreeToPremium = async (token:string, userId:string):Promise<SignUpResponseDTO> => {
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

  public editProfile = async (token:string, input:EditProfileDTO):Promise<SignUpResponseDTO> => {
    const authData:AuthenticationData = this.authenticator.getData(token);

    const id = authData.id;

    const editInput:EditProfileDTO = { ...input, id };

    await this.userDatabase.editProfile(editInput);

    return { message: 'Profile edited successfully' };
  }

  public getAccessTokenByRefreshToken = async (input:RefreshTokenInputDTO):Promise<TokenResponseDTO> => {
    const { refreshToken, device } = input;

    if (!refreshToken || !device) {
      throw new InvalidParameterError('Missing parameters');
    }

    const refreshTokenData = this.authenticator.getData(refreshToken);
    if (refreshTokenData.device !== device) { 
      throw new InvalidParameterError('Refresh token has no device');
    }

    const user = await this.userDatabase.getUserById(refreshTokenData.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const id = user.id;
    const role = user.role;
    
    const accessToken = this.authenticator.generateToken({ id, role }, process.env.ACCESS_TOKEN_EXPIRES_IN);

    return { accessToken };
  }
}
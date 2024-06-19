import { string } from 'joi';
import TagPostModel, { ITagPostAttributes } from '../models/TagPost';
import { ICategoryAttributes } from '../models/Category';
import { IMetaDataAttributes } from '../models/metaData';
declare global {
  namespace Express {
    export interface Request {
      fileValidationError: string;
    }
    export interface User {
      id: number;
      role_id: number;
    }
  }
}

export interface IId {
  id: number;
}
export interface IEmailPassword {
  email: string;
  password: string;
}

export interface IErrorRes {
  message: string[];
  path: (string | number)[];
}

export interface IGeneralJsonResponse {
  data: any;
  message: string;
  toast: boolean;
  response_type: string;
}

export interface IRegisterAvailabity {
  usernameAvailabity: number;
  emailAvailabity: number;
}

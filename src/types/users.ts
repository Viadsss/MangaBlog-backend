export interface CreateUserBody {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateUsernameParams {
  id: string;
}

export interface UpdateUsernameBody {
  username: string;
}

export interface UpdatePasswordParams {
  id: string;
}

export interface UpdatePasswordBody {
  oldPassword: string;
  newPassword: string;
}

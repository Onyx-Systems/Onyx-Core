import Interfacer from "../../interfacer";
import { generateRefreshToken, generateToken } from "../tokens/jwt";

const interfacer = new Interfacer();
const { datasource } = interfacer;
const tokenQueries = datasource.useQueries().token;

export const loginUser = async (username: string, password: string) => {
  try {
    const user = await datasource
      .useManager()
      .findOne(datasource.useEntities().User, {
        where: {
          username: username,
        },
      });
    if (!user) {
      return {
        data: null,
        error: "User not found",
        message: "User not found",
      };
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      return {
        data: null,
        error: "Password does not match",
        message: "Password does not match",
      };
    }

    const accessToken = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    tokenQueries.deleteRefreshToken(user.username);
    const refreshToken = generateRefreshToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    tokenQueries.addRefreshToken(user.username, refreshToken);

    return {
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: user.getPublic(),
      },
      error: null,
      message: "Login successful",
    };
  } catch (error) {
    return {
      data: null,
      error: error,
      message: "Login failed",
    };
  }
};

export const getMe = async (username: string) => {
  try {
    const user = await datasource
      .useManager()
      .findOne(datasource.useEntities().User, {
        where: {
          username: username,
        },
      });
    if (!user) {
      return {
        data: null,
        error: "User not found",
        message: "User not found",
      };
    }
    return {
      data: user.getPublic(),
      error: null,
      message: "User found",
    };
  } catch (error) {
    return {
      data: null,
      error: error,
      message: "User not found",
    };
  }
};

export const logoutUser = async (username: string) => {
  try {
    const user = await datasource
      .useManager()
      .findOne(datasource.useEntities().User, {
        where: {
          username: username,
        },
      });
    if (!user) {
      return {
        data: null,
        error: "User not found",
        message: "User not found",
      };
    }
    tokenQueries.deleteRefreshToken(user.username);
    return {
      data: null,
      error: null,
      message: "Logout successful",
    };
  } catch (error) {
    return {
      data: null,
      error: error,
      message: "Logout failed",
    };
  }
};

export const refreshUser = async (username: string, refresh_token: string) => {
  try {
    const user = await datasource
      .useManager()
      .findOne(datasource.useEntities().User, {
        where: {
          username: username,
        },
      });
    if (!user) {
      return {
        data: null,
        error: "User not found",
        message: "User not found",
      };
    }
    const token = await tokenQueries.getRefreshToken(user.username);
    if (!token) {
      return {
        data: null,
        error: "Refresh token not found",
        message: "Refresh token not found",
      };
    }
    if (token.value !== refresh_token) {
      return {
        data: null,
        error: "Refresh token does not match",
        message: "Refresh token does not match",
      };
    }
    const accessToken = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    tokenQueries.deleteRefreshToken(user.username);

    const refreshToken = generateRefreshToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    tokenQueries.addRefreshToken(user.username, refreshToken);

    return {
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: user.getPublic(),
      },
      error: null,
      message: "Refresh successful",
    };
  } catch (error) {
    return {
      data: null,
      error: error,
      message: "Refresh failed",
    };
  }
};

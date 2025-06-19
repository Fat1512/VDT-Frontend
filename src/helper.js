export const getAccessToken = () => {
  const token = window.localStorage.getItem("auth_token");
  if (token == null) return null;
  return JSON.parse(token);
};

export const getRefreshToken = () => {
  const token = window.localStorage.getItem("auth_token");
  if (token == null) return null;
  return JSON.parse(token).refreshToken;
};

export const AuthenticationHeader = function () {
  return {
    Authorization: `Bearer ${getAccessToken()}`,
  };
};

export const setLocalStorageToken = (token) => {
  window.localStorage.setItem("auth_token", JSON.stringify(token));
};

export const removeLocalStorageToken = () => {
  window.localStorage.removeItem("auth_token");
};
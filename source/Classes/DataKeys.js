const DataKeys = {
    Email : '',
    Token : ''
};

export const setEmail = (email) => {
    DataKeys.Email = email;
};

export const setToken = (token) => {
    DataKeys.Token = token;
};

export const getData = () => {
    return DataKeys;
};
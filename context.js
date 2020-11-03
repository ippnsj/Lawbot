import React from 'react';

export const LOCAL_URL = 'http://localhost:8080';
export const PRODUCTION_URL = `https://api.lawbotc.kr`;

export const MyContext = React.createContext({
    API_URL: PRODUCTION_URL,
    token: '',
    updateToken: () => {},
});
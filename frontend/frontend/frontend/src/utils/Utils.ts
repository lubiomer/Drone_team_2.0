export const getToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

export const getUserData = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
};

export const removeToken = (): void => {
    localStorage.removeItem('accessToken');
};

export const setToken = (val: string): void => {
    localStorage.setItem('accessToken', val);
};

export const setUserData = (val: string) => {
    localStorage.setItem('userData', val);
};

export const removeUserData = () => {
    localStorage.removeItem('userData');
};

export const isObjEmpty = (obj: Record<string, unknown>): boolean => Object.keys(obj).length === 0;

export const isUserLoggedIn = (): boolean => !!localStorage.getItem('userData');

export const removeCookie = (cookieName: string) => {
    document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const getHomeRouteForLoggedInUser = (userRole: string): string => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'user') return '/profile';
    return '/login';
};

export const getGoogleUrl = (from: string) => {
    const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

    const options = {
        redirect_uri: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT as string,
        client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID as string,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
        state: from,
    };

    const qs = new URLSearchParams(options);

    return `${rootUrl}?${qs.toString()}`;
};

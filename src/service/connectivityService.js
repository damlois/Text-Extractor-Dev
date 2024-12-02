import keycloakService from './keycloakService';
import { capitalize } from '../utils';

const constructRequest = async (method, payload, accessToken, userAgent, withAuth) => {
    try {
        let request;
        let resolvedAccessToken = accessToken;

        if (withAuth) {
            await keycloakService.updateToken(600);
            resolvedAccessToken = keycloakService.getToken();
        }

        const headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resolvedAccessToken}`,
            'Dufuna-User-Agent': userAgent,
        });
        if (method === 'post' || method === 'put') {
            request = {
                method,
                body: JSON.stringify(payload),
                headers,
            };
        } else {
            request = {
                method,
                headers,
            };
        }
        return request;
    } catch (err) {
        throw 'sessionExpired';
    }
};

export const makeApiCall = async (method, url, payload, accessToken, userAgent) => {
    try {
        if (!accessToken && !keycloakService.getToken()) {
            return keycloakService.doLogin();
        }
        const urlParam = await constructRequest(method, payload, accessToken, userAgent, true);
        const response = await fetch(url, urlParam);

        return response.json();
    } catch (err) {
        if (err === 'sessionExpired') {
            return keycloakService.doLogin();
        }
        return {
            Error: err,
            msg: 'Failed to fetch. Please check your internet connection',
        };
    }
};

export const makeApiCallWithoutToken = async (method, url, payload, userAgent) => {
    try {
        if (method !== 'post' && method !== 'get') {
            return {
                Error: 'Can only make post and get request without token',
                msg: 'This request cannot be completed unless you are logged in.',
            };
        }
        const urlParam = await constructRequest(method, payload, '', userAgent);
        const response = await fetch(url, urlParam);

        return response.json();
    } catch (err) {
        if (err === 'sessionExpired') {
            return keycloakService.doLogin();
        }
        return {
            Error: err,
            msg: 'Failed to fetch. Please check your internet connection',
        };
    }
};

export const makeApiCallWithFormData = async (method, url, formData, accessToken, userAgent) => {
    try {
        if (method !== 'post' && method !== 'put') {
            return {
                Error: 'Can only make post and post request with form data',
                msg: 'This request cannot be completed.',
            };
        }

        await keycloakService.updateToken(600);

        const resolvedAccessToken = keycloakService.getToken();

        const response = await fetch(url, {
            method,
            body: formData,
            headers: {
                Authorization: `Bearer ${resolvedAccessToken}`,
                'Dufuna-User-Agent': userAgent,
            },
        });

        return response.json();
    } catch (err) {
        return {
            Error: err,
            msg: 'Failed to fetch. Please check your internet connection',
        };
    }
};

export const isOkResponse = (response) => [200, 201].includes(response?.code);

export const handleErrors = (response, msgHandler, customMsg) => {
    if (response.status === 'failed' || response?.error) {
        if (
            response?.error?.message?.replaceAll("'", '') ===
            'Unexpected token A, "Access denied" is not valid JSON'
        ) {
            return 'AccessDenied';
        }
        if (response.message === 'An account already exists with the credentials provided.') {
            return 'AccountExists';
        }
        const message =
            customMsg ||
            response.message ||
            'Something went wrong while trying to process your request. Please try again.';
        msgHandler('error', capitalize(message, true));
    } else if (Array.isArray(response)) {
        msgHandler('error', capitalize(response[0].message, true));
    } else if (
        response.subErrors &&
        Array.isArray(response.subErrors) &&
        response.subErrors.length
    ) {
        msgHandler('error', capitalize(response.subErrors[0].message, true));
    } else if (!isOkResponse(response) && response.message) {
        msgHandler('error', capitalize(response.message, true));
    } else if ((response.status && response.status === 'success') || isOkResponse(response)) {
        msgHandler('success', customMsg || response.message || 'Successful!');
        return response;
    } else {
        msgHandler(
            'error',
            'Something went wrong while trying to process your request. Please try again.',
        );
    }
};

export const handleErrorsReturnData = (response, msgHandler) => {
    if (response.status === 'failed' || response?.Error || response?.error) {
        if (
            response?.Error?.message?.replaceAll("'", '') ===
            'Unexpected token A, "Access denied" is not valid JSON'
        ) {
            return 'AccessDenied';
        }
        if (response.message === 'An account already exists with the credentials provided.') {
            return 'AccountExists';
        }
        msgHandler('error', response.message);
    } else if (Array.isArray(response)) {
        msgHandler('error', response[0].message);
    } else if (response.status && response.status === 'success') {
        return response.data ?? 'success';
    } else {
        msgHandler(
            'error',
            'Something went wrong while trying to process your request. Please try again.',
        );
    }
};

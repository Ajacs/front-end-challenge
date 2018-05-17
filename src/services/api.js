import config from 'config/configuration';
import _ from 'lodash';
import { Storage } from 'services/storage';
import service from 'superagent';
/**
 * It adds a trailing slash if there isn't one
 */
const normalizeHost = host => {
    if( host.substr(-1) !== '/' ){
        return host + '/';
    }
    return host;
};

/**
 * It removes the slash in the front of the endpoint if there is one
 */
const normalizeEndpoint = endpoint => {
    if( endpoint.substr(0,1) === '/' ){
        return endpoint.substr(1);
    }
    return endpoint;
};

const buildUrl = (path, params) => {
    const { api: { endpoints }, baseHost } = config;
    const url = `${normalizeHost(baseHost)}${normalizeEndpoint(endpoints[path])}`;
    if( !params || _.isEmpty(params) ){
        return url;
    }

    let urlWithParams = url;

    _.forOwn(params, (paramValue, paramName) => {
        urlWithParams = urlWithParams.replace(`{${paramName}}`, paramValue);
    });
    return urlWithParams;
};

const baseRequest = (path, method, params) => {
    const url = buildUrl(path, params);
    return fetch(url, {
        method,
        headers: params.headers || {},
        body: JSON.stringify(params.data)
    }).then(response => response);
};

export const createIssue = (data) => {
    const { title, body, user, repository } = data;
    const params = {
        headers: {
            'Authorization': Storage.localStorage.get('hash'),
            'Content-Type': 'application/json'
        },
        data: {
            'title': title,
            'body': body
        },
        user,
        repository
    };
    return baseRequest('issuesCreate', 'POST', params);
};

// I need to change this part to something more generic like ApiPost, ApiGet

export const listRepositoryIssues = params => {
    return baseRequest('repositoryIssues', 'GET', params);
};

export const getUserData = params => {
    return baseRequest('users', 'GET', params);
};

export const listUserRepositories = params => {
    return baseRequest('userRepositories', 'GET', params);
};

export const listRepositories = params => {
    return baseRequest('repositoriesSearch', 'GET', params);
};


export const authenticate = hash => {
    const params = {
        headers: {
            'Authorization': hash,
            'Content-Type': 'application/json'
        },
        data: {
            'scopes': ['user:email'],
            'note': 'Gissues App'
        }
    };
    return baseRequest('authorization', 'POST', params)
};

export const deleteAuthorization = authorizationId => {
    const params = {
        headers: {
            'Authorization': `${Storage.localStorage.get('hash')}`
        },
        authorizationId
    };
    return baseRequest('authorizationDelete', 'DELETE', params);
};
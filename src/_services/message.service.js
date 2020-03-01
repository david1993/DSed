import config from 'config';
import {authHeader} from '../_helpers';

export const messageService = {
    getAll,
    add
};

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/message/all`, requestOptions).then(handleResponse);
}


function add(message) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(message)
    };

    return fetch(`${config.apiUrl}/message/add`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        console.log('response', text);
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

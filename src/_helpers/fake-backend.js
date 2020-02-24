// array in local storage for registered users

let orgs = null

try {
    orgs = JSON.parse(localStorage.orgs)
} catch (e) {

}
if (!orgs) {
    orgs = [
        {id: 1, name: 'Аптека 36.6'},
        {id: 2, name: 'Аптека 36.7'},
        {id: 3, name: 'Аптека 36.8'},
        {id: 4, name: 'Мыл строй',}
    ]
}
let users = null;
try {
     users = JSON.parse(localStorage.users)
} catch (e) {
}
if (!users ||!users.length) {
    users = [
        {id: 1, name: 'Миша', orgId: 1},
        {id: 2, name: 'Саша', orgId: 1},
        {id: 3, name: 'Даша', orgId: 1},
        {id: 4, name: 'Андрей', orgId: 2},
        {id: 5, name: 'Алена', orgId: 2},
        {id: 6, name: 'Кирилл', orgId: 2},
        {id: 7, name: 'Дина', orgId: 3},
        {id: 8, name: 'Диана', orgId: 3},
        {id: 9, name: 'Мирослав', orgId: 3},
        {id: 20, name: 'Катя', orgId: 3},
        {id: 21, name: 'Филипп', orgId: 1},
        {id: 22, name: 'Даша', orgId: 4},
    ];
    users = users.map((user) => {
        user.email = user.id + '@tatar.ru'
        user.password = '123456'
        return user;
    });
}
console.log({users, orgs});

export function configureFakeBackend() {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {
                //get orgs
                if (url.endsWith('/org/list') && opts.method === 'GET') {

                    let responseJson = {
                        orgs: orgs,
                    };
                    resolve({ok: true, text: () => Promise.resolve(JSON.stringify(responseJson))});
                    return;
                }
                // get users
                if (url.match(/\/users\/list\/\d+$/) && opts.method === 'GET') {
                    let urlParts = url.split('/');
                    let orgId = parseInt(urlParts[urlParts.length - 1]);

                    let responseJson = {
                        users: users.filter(user => {
                            console.log(user.orgId, orgId)
                            return user.orgId === orgId
                        }),
                    };
                    resolve({ok: true, text: () => Promise.resolve(JSON.stringify(responseJson))});
                    return;
                }
                // authenticate
                if (url.endsWith('/users/authenticate') && opts.method === 'POST') {
                    // get parameters from post request
                    let params = JSON.parse(opts.body);
                    // find if any user matches login credentials
                    let filteredUsers = users.filter(user => {
                        return user.id === params.user_id && user.password === params.password;
                    });

                    if (filteredUsers.length) {
                        // if login details are valid return user details and fake jwt token
                        let user = filteredUsers[0];
                        let responseJson = {
                            id: user.id,
                            name: user.name,
                            orgId: user.orgId,
                            email: user.email,
                            token: 'fake-jwt-token'
                        };
                        resolve({ok: true, text: () => Promise.resolve(JSON.stringify(responseJson))});
                    } else {
                        // else return error
                        reject('Неверный пароль');
                    }

                    return;
                }

                // get users
                if (url.endsWith('/users') && opts.method === 'GET') {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        resolve({ok: true, text: () => Promise.resolve(JSON.stringify(users))});
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }

                    return;
                }

                // get user by id
                if (url.match(/\/users\/\d+$/) && opts.method === 'GET') {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedUsers = users.filter(user => {
                            return user.id === id;
                        });
                        let user = matchedUsers.length ? matchedUsers[0] : null;

                        // respond 200 OK with user
                        resolve({ok: true, text: () => JSON.stringify(user)});
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }

                    return;
                }

                // forgot_pass user
                if (url.endsWith('/users/recover') && opts.method === 'POST') {
                    let email = JSON.parse(opts.body);
                    let user = users.filter(user => {
                        return user.email === email;
                    }).length;
                    if (!user) {
                        reject('User not found');
                        return;
                    }
                    //sending email

                    // respond 200 OK
                    resolve({ok: true, text: () => Promise.resolve()});

                    return;
                }

                // delete user
                if (url.match(/\/users\/\d+$/) && opts.method === 'DELETE') {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Bearer fake-jwt-token') {
                        // find user by id in users array
                        let urlParts = url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        for (let i = 0; i < users.length; i++) {
                            let user = users[i];
                            if (user.id === id) {
                                // delete user
                                users.splice(i, 1);
                                localStorage.setItem('users', JSON.stringify(users));
                                break;
                            }
                        }

                        // respond 200 OK
                        resolve({ok: true, text: () => Promise.resolve()});
                    } else {
                        // return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }

                    return;
                }

                // pass through any requests not handled above
                realFetch(url, opts).then(response => resolve(response));

            }, 500);
        });
    }
}

import { auth0Client, clientId, handleLogin } from './auth'

const elements = {
    loginOrLogout: document.querySelector('#login-or-logout'),
    data: document.querySelector('#data')
};
const backendDomain = 'http://localhost:3001';

//ascertain login status
const loggedIn = await handleLogin();

//add login or logout button
const btn = document.createElement('button');
btn.textContent = !loggedIn ? 'Login' : 'Logout';
elements.loginOrLogout.appendChild(btn);

btn.onclick = async () => !loggedIn ?
    (await auth0Client).loginWithRedirect() :
    (await auth0Client).logout({
        clientId,
        logoutParams: {returnTo: location.protocol+'//'+location.host}
    });

//get public and private data (the latter will fail if not logged in!)
const data = loggedIn ?
    await fetch(backendDomain+'/private', {
        headers: {
            Authorization: 'Bearer '+loggedIn?.token
        }
    }) :
    await fetch(backendDomain+'/public');
if (data.status == 401) alert('Not authorised!');
else {
    elements.data.textContent = JSON.stringify(await data.json());
}
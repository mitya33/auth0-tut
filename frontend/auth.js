//import Auth0's SPA SDK
import { createAuth0Client } from '@auth0/auth0-spa-js'
const domain = 'dev-fj8lnvgbifxqjkdb.us.auth0.com'
export const clientId = 'alukNh20QMoRshMCz2k7P0PJipHuKIcy'
const audience = 'https://auth0-tut'

//Auth0 client
export const auth0Client = createAuth0Client({
    domain: domain,
    clientId: clientId,
    cacheLocation: 'localstorage',
    authorizationParams: {
        redirect_uri: window.location.origin,
        audience: audience
    }
})

export const handleLogin = async () => {

    const client = await auth0Client;

    //handle login callback
    if (location.search.includes('state=') && (
        location.search.includes('code=') || 
        location.search.includes('error='))
    ) {
        try {
            await client.handleRedirectCallback();
        } catch(e) {
        } finally {
            window.history.replaceState(null, document.title, '/');
        }
    }

    //logged in? Get and decode auth token
    const isAuthenticated = await client.isAuthenticated();
    let token;
    if (isAuthenticated) {
        try {
            token = await client.getTokenSilently({aud: audience});
            return {
                token,
                header: JSON.parse(window.atob(token.split('.')[0])),
                payload: JSON.parse(window.atob(token.split('.')[1]))
            }
        } catch(e) { window.location.reload(); }
    }

}
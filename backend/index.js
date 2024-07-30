//bring in itty and jose
import { AutoRouter, StatusError, cors } from 'itty-router'
import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose'

//create router, listening on port 3001 (Bun's default port) and with
//CORS enabled
const { preflight, corsify } = cors();
const router = AutoRouter({
    port: 3001,
    before: [preflight],
    finally: [corsify]
});

const withAuth = async (req, env) => {
    try {
        const getJwksUrl = process.env.AUTH0_DOMAIN+process.env.AUTH0_JWKS_URI;
        const jwks = createRemoteJWKSet(new URL(getJwksUrl));
        const header = req.headers.get('authorization');
        if (!header) throw 'missing token';
        const tkn = header.replace(/^Bearer\s/i, '');
        const options = {
            algorithms: ['RS256'],
            issuer: process.env.AUTH0_DOMAIN,
            audience: process.env.AUTH0_API_AUDIENCE
        };
       const result = await jwtVerify(tkn, jwks, options);
    } catch(e) {
        throw new StatusError(401, e);
    }
}

//public route
router.get('/public', () => ({
    Austria: 'Vienna',
    Indonesia: 'Jakarta',
    Slovenia: 'Ljubljana'
}));

//private route
router.get('/private', withAuth, () => ({
    balance: '£4,591',
    overdraft: '£500',
    accountNum: '95130012',
    sortCode: '416668'
}));

//export router
export default router
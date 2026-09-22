import crypto from 'crypto'; import { cookies } from 'next/headers';
export type Session={id:string;username:string};
const secret=()=>process.env.SESSION_SECRET||'dev-only-change-me';
function sig(s:string){return crypto.createHmac('sha256',secret()).update(s).digest('hex')}
export function encodeSession(x:Session){const b=Buffer.from(JSON.stringify(x)).toString('base64url');return `${b}.${sig(b)}`}
export function decodeSession(v?:string):Session|null{if(!v)return null;const [b,s]=v.split('.');if(!b||!s||sig(b)!==s)return null;try{return JSON.parse(Buffer.from(b,'base64url').toString())}catch{return null}}
export async function session(){return decodeSession((await cookies()).get('session')?.value)}
export function voterHash(id:string){return crypto.createHmac('sha256',secret()).update(`voter:${id}`).digest('hex')}
export function isAdmin(id?:string){return !!id && (process.env.ADMIN_DISCORD_IDS||'').split(',').map(x=>x.trim()).includes(id)}

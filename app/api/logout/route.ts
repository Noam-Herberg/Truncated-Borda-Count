import {NextResponse} from 'next/server'; export async function GET(){const r=NextResponse.redirect(process.env.APP_URL!);r.cookies.delete('session');return r}

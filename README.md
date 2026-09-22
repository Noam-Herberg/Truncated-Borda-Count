# Role Voting Tool

A small secret 3–2–1 truncated Borda voting app using Discord for voter eligibility.

## Properties
- Discord OAuth login.
- Restrict voting to one Discord server and optionally one Discord role.
- One vote per Discord account per election.
- Rank up to 3 candidates: 1st = 3 points, 2nd = 2, 3rd = 1.
- Ballots and voter identity are stored separately. `Participation` stores a keyed hash of the Discord ID; `Ballot` contains no voter identifier.
- Results are unavailable through the app until the closing time.
- Admin can create elections and see turnout, but not interim scores.

## Important security limitation
This is an anonymous application design, not a cryptographic election system. Anyone with unrestricted production database access can inspect raw ballots and calculate interim totals. For a small trusted group this is usually a reasonable trade-off. Do not describe it as cryptographically secret.

## Setup
1. Install Node 20+.
2. Copy `.env.example` to `.env` and fill it in.
3. In the Discord Developer Portal create an OAuth2 application. Add redirect URI: `http://localhost:3000/api/auth/callback` (and your production equivalent).
4. The OAuth scopes used are `identify` and `guilds.members.read`.
5. Set `DISCORD_GUILD_ID` to your server ID. Optionally set `DISCORD_VOTER_ROLE_ID`.
6. Put the Discord IDs of election administrators in `ADMIN_DISCORD_IDS`.
7. Generate `SESSION_SECRET`, e.g. `openssl rand -hex 32`.
8. Run:

```bash
npm install
npx prisma db push
npm run dev
```

Visit http://localhost:3000.

## Production
SQLite is convenient locally. For a Vercel deployment, switch Prisma to a production database such as Postgres before relying on the app for a real election. Keep `SESSION_SECRET` and Discord credentials in deployment environment variables.

## Privacy model
When a voter submits, a single database transaction creates:
- a `Participation` row containing only a keyed hash derived from their Discord ID, which prevents a second vote; and
- a separate `Ballot` row containing their rankings but no user/Discord ID.

There is deliberately no foreign key between participation and ballot, so ordinary application queries cannot reconstruct who cast which ballot.

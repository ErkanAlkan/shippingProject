declare module 'connect-pg-simple' {
  import { Store } from 'express-session';
  import { Pool } from 'pg';
  
  interface PGStoreOptions {
    pool: Pool;
    tableName?: string;
  }

  function connectPgSimple(session: typeof import('express-session')): new (options: PGStoreOptions) => Store;

  export default connectPgSimple;
}

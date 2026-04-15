import pg from 'pg';
const { Client } = pg;

const DB_URL = process.env.SUPABASE_DB_URL ||
  'postgresql://postgres:9001708366%40neokart@db.cnhvmkhnquwilsntzhat.supabase.co:5432/postgres';

const SQL = `
-- Drop it just in case
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;

-- Re-create the policy using the safe helper function we deployed earlier
CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT USING (public.get_my_role() = 'admin');
`;

async function main() {
  console.log('🔧 Connecting to Supabase to fix missing Admin Users policy...');
  const client = new Client({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected!');
    console.log('🛠️  Adding "Admins can view all profiles" policy...');
    await client.query(SQL);
    console.log('✅ RLS policy restored securely!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

main();

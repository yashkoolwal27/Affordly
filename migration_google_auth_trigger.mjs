import pg from 'pg';
const { Client } = pg;

const DB_URL = process.env.SUPABASE_DB_URL || 'postgresql://postgres:9001708366%40neokart@db.cnhvmkhnquwilsntzhat.supabase.co:5432/postgres';

// This trigger auto-creates a row in public.users whenever a new auth.users entry is created.
// This handles both email signups AND Google OAuth sign-ins.
// For email signups the profile is already created by the app, so we use ON CONFLICT DO NOTHING.
const SQL = `
-- Create a function that will auto-insert a profile for new auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, seller_category)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'customer',
    NULL
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
`;

async function main() {
  console.log('🚀 Connecting to Supabase...');
  const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('✅ Connected!');
    console.log('⚙️  Creating auto-profile trigger for OAuth users...');
    await client.query(SQL);
    console.log('✅ Trigger created! Google OAuth users will now auto-get a profile row.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

main();

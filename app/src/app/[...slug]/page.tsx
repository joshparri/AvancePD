import { Dashboard } from '@/components/Dashboard';
import { Layout } from '@/components/Layout';

/**
 * Catch-all route for client-side routing.
 * This allows direct navigation to any route path by rendering the main app,
 * which handles route resolution on the client side.
 */
export default function CatchAllPage() {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

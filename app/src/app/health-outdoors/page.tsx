'use client';

import { Layout } from '@/components/Layout';

export default function HealthOutdoorsPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Health & Outdoors
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Gentle practices to support sustainable MSP work. Local data only.
        </p>

        {/* Placeholder content - will be expanded in Phase 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Health & Outdoors
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Module initialized. Additional features coming in next phases.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

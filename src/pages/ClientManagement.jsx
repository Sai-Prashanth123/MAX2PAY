import { useState } from 'react';
import Clients from './Clients';
import ClientUsers from './ClientUsers';

const ClientManagement = () => {
  const [activeTab, setActiveTab] = useState('companies');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
        <p className="text-gray-600 mt-1">Manage client companies and their user accounts</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('companies')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'companies'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Companies
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            User Accounts
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'companies' ? <Clients /> : <ClientUsers />}
      </div>
    </div>
  );
};

export default ClientManagement;

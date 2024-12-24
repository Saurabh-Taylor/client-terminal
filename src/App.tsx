import React, { useState } from 'react';
import { TerminalIcon, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import Terminal from './components/Terminal';

function App() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  console.log(import.meta.env);
  

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Content Area */}
      <div className="bg-white p-8 shadow-sm border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-gray-800">5G - Level 1 / Learning Challenges</h2>
          </div>
          <div className="mt-6 space-y-4 text-gray-600">
            <p className="text-lg font-medium">In order to configure the NRF we need to:</p>
            <ul className="list-none pl-6 space-y-3">
              {[
                'Configure which IP address to listen to',
                'Which port is it supposed to use?',
                'Which PLMN does it belong to (which MCC and MNC)?'
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <ChevronRight className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content + Sidebar Layout */}
      <div className="flex-1 flex">
        {/* Main Content Area */}
        <div className="flex-1 p-8 relative">
          <div className="prose max-w-none">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pro tips:</h3>
              <p className="text-gray-600 mb-4">For the NRF config file:</p>
              <pre className="bg-slate-900 text-slate-50 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                $ vi ~/free5gc/config/nrfcfg.yaml ## (when using vi, hit "i" to enter insert mode and write, once finished hit "esc"+wq to save)
              </pre>
            </div>
          </div>

          {/* Terminal Launch Button - Positioned at bottom left */}
          <div className="absolute bottom-8 left-8">
            <button
              onClick={() => setIsTerminalOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              <TerminalIcon className="h-5 w-5 mr-2" />
              Launch Terminal
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-72 bg-white shadow-sm p-6 border-l">
          <h3 className="font-semibold text-lg text-gray-800 mb-6">5G nodes</h3>
          <ul className="space-y-4">
            {[
              '5G architecture',
              '5G Nodes Configuration',
              'NRF',
              'UDM & UDR',
              'AUSF',
              'NSSF',
              'AMF',
              'PCF',
              // 'UPF',
              // 'SMF'
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Terminal Component */}
      <Terminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </div>
  );
}

export default App;


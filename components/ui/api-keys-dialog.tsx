
import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"

interface ApiKeys {
  COINBASE_API_KEY?: string;
  COINBASE_API_SECRET?: string;
}

export function ApiKeysDialog() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});

  useEffect(() => {
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  }, []);

  const handleSaveKeys = () => {
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    window.location.reload(); // Reload to apply new keys
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <span className="text-sm">🔑</span>
          <span className="sr-only">Configure API Keys</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px] p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">API Key</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={apiKeys.COINBASE_API_KEY || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, COINBASE_API_KEY: e.target.value }))}
              placeholder="Enter API Key"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">API Secret</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={apiKeys.COINBASE_API_SECRET || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, COINBASE_API_SECRET: e.target.value }))}
              placeholder="Enter API Secret"
            />
          </div>
          <Button className="w-full" onClick={handleSaveKeys}>
            Save Keys
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

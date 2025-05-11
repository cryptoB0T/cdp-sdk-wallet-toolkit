
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
  CDP_API_KEY_ID?: string;
  CDP_API_KEY_SECRET?: string;
  CDP_WALLET_SECRET?: string;
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
            <label className="block text-sm mb-1">CDP API Key ID</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={apiKeys.CDP_API_KEY_ID || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, CDP_API_KEY_ID: e.target.value }))}
              placeholder="Enter CDP API Key ID"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">CDP API Key Secret</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={apiKeys.CDP_API_KEY_SECRET || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, CDP_API_KEY_SECRET: e.target.value }))}
              placeholder="Enter CDP API Key Secret"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">CDP Wallet Secret</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={apiKeys.CDP_WALLET_SECRET || ''}
              onChange={(e) => setApiKeys(prev => ({ ...prev, CDP_WALLET_SECRET: e.target.value }))}
              placeholder="Enter CDP Wallet Secret"
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

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SnowprintLogo } from './SnowprintLogo';
import { ConnectButton } from "thirdweb/react";
import { client } from "@/app/client";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/bridge', label: 'Token Bridge' },
    { path: '/launchpad', label: 'Launchpad' },
    { path: '/explore', label: 'Explore' }
  ];

  return (
    <div className="navbar">
      <div className="navbar-content">
        <div className="flex items-center">
          <SnowprintLogo />
        </div>
        <div className="flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-4 py-2 rounded-lg transition-colors ${
                pathname === item.path
                  ? 'bg-zinc-800 text-white'
                  : 'text-white-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Snowprint",
              url: "https://example.com",
            }}
          />
        </div>
      </div>
    </div>
  );
} 
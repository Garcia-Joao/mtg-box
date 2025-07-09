// src/components/Layout.tsx
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
} from '@heroui/react';

import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <Navbar isBordered>
        <NavbarBrand>
          <h1 className="text-2xl font-bold">MTG-BOX</h1>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button as={Link} href="/" color="primary" variant="light">
              Home
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} href="/sets" color="primary" variant="solid">
              Sets
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} href="/signIn" color="primary" variant="solid">
              Login
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="theme-Blue min-h-screen bg-gradient-to-br from-blue-800 via-blue-600 to-purple-800 text-foreground">
        <Outlet />
      </main>
    </>
  );
}

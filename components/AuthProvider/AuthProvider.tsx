"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const isSessionActive = await checkSession();

        if (isSessionActive) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [pathname, setUser, clearIsAuthenticated]);

  useEffect(() => {
    if (loading) return;

    const isPrivateRoute = privateRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isPrivateRoute && !isAuthenticated) {
      clearIsAuthenticated();
      router.push("/sign-in");
    }
  }, [pathname, isAuthenticated, loading, router, clearIsAuthenticated]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        Loading...
      </div>
    );
  }

  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateRoute && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

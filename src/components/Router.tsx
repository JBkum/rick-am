import React, { useEffect, useState } from "react";
import { EVENTS } from "./const";

type Route = { path: string; Component: React.ComponentType<Record<string, unknown>> };
type RouterProps = { routes?: Route[]; defaultComponent?: React.ComponentType<Record<string, unknown>> };

function matchPath(def: string, actual: string): Record<string, string> | null {
  const defSeg = def.split("/").filter(Boolean);
  const actSeg = actual.split("/").filter(Boolean);

  if (defSeg.length !== actSeg.length) {
    if (defSeg.length === 0 && actSeg.length === 0) return {};
    return null;
  }

  const params: Record<string, string> = {};
  for (let i = 0; i < defSeg.length; i++) {
    const d = defSeg[i];
    const a = actSeg[i];
    if (d.startsWith(":")) {
      params[d.slice(1)] = decodeURIComponent(a);
    } else if (d !== a) {
      return null;
    }
  }
  return params;
}

export function Router({
  routes = [],
  defaultComponent: DefaultComponent = () => <h1>404</h1>
}: RouterProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname + window.location.search);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };

    window.addEventListener(EVENTS.PUSHSTATE, onLocationChange);
    window.addEventListener(EVENTS.POPSTATE, onLocationChange);
    window.addEventListener("popstate", onLocationChange);

    return () => {
      window.removeEventListener(EVENTS.PUSHSTATE, onLocationChange);
      window.removeEventListener(EVENTS.POPSTATE, onLocationChange);
      window.removeEventListener("popstate", onLocationChange);
    };
  }, []);

  const pathname = currentPath.split("?")[0];
  const search = currentPath.includes("?") ? currentPath.split("?")[1] : "";
  const query = Object.fromEntries(new URLSearchParams(search));

  for (const r of routes) {
    const params = matchPath(r.path, pathname);
    if (params !== null) {
      const Page = r.Component;
      return <Page params={params} query={query} />;
    }
  }

  return <DefaultComponent />;
}
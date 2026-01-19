import type { MouseEvent } from "react";
import { EVENTS } from "./const";

export function navigate(href: string | URL | null | undefined) {
  if (!href) return;
  window.history.pushState({}, "", href);
  const navigationEvent = new Event(EVENTS.PUSHSTATE);
  window.dispatchEvent(navigationEvent);
}

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, children, ...props }: LinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const isPrimary = event.button === 0;
    const isModified = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
    const shouldHandle = !props.target || props.target === "_self";
    if (isPrimary && shouldHandle && !isModified) {
      event.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
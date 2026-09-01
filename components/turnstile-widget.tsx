"use client";

import { useEffect, useRef } from "react";

type TurnstileTheme = "dark" | "light";

type TurnstileOptions = {
  sitekey: string;
  theme: TurnstileTheme;
  language: "en" | "pl";
  size: "flexible";
  action: string;
  "response-field": boolean;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => boolean;
  "unsupported-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileWidgetProps = {
  siteKey: string;
  theme: TurnstileTheme;
  language: "en" | "pl";
  resetSignal: number;
  onToken: (token: string) => void;
  onError: () => void;
};

const TURNSTILE_SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<void> | null = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SCRIPT_URL}"]`,
    );
    const script = existing ?? document.createElement("script");

    const loaded = () => {
      if (window.turnstile) resolve();
      else reject(new Error("Turnstile API unavailable"));
    };
    const failed = () => reject(new Error("Turnstile script failed to load"));

    script.addEventListener("load", loaded, { once: true });
    script.addEventListener("error", failed, { once: true });

    if (!existing) {
      script.src = TURNSTILE_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }).catch((error) => {
    scriptPromise = null;
    throw error;
  });

  return scriptPromise;
}

export function TurnstileWidget({
  siteKey,
  theme,
  language,
  resetSignal,
  onToken,
  onError,
}: TurnstileWidgetProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const onTokenRef = useRef(onToken);
    const onErrorRef = useRef(onError);

    useEffect(() => {
      onTokenRef.current = onToken;
      onErrorRef.current = onError;
    }, [onError, onToken]);

    useEffect(() => {
      onTokenRef.current("");
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }, [resetSignal]);

    useEffect(() => {
      let cancelled = false;
      onTokenRef.current("");

      void loadTurnstile()
        .then(() => {
          if (cancelled || !containerRef.current || !window.turnstile) return;

          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            language,
            size: "flexible",
            action: "contact",
            "response-field": false,
            callback: (token) => onTokenRef.current(token),
            "expired-callback": () => onTokenRef.current(""),
            "error-callback": () => {
              onTokenRef.current("");
              onErrorRef.current();
              return true;
            },
            "unsupported-callback": () => {
              onTokenRef.current("");
              onErrorRef.current();
            },
          });
        })
        .catch(() => {
          if (!cancelled) onErrorRef.current();
        });

      return () => {
        cancelled = true;
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
        }
        widgetIdRef.current = null;
      };
    }, [language, siteKey, theme]);

    return <div className="turnstile-widget" ref={containerRef} />;
}

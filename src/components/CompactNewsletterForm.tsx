"use client";

import Script from "next/script";
import { FormEvent, useEffect, useRef, useState } from "react";

type CompactNewsletterFormProps = {
  buttonLabel?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  helperTextClassName?: string;
  successClassName?: string;
  errorClassName?: string;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        }
      ) => string;
      remove?: (widgetId: string) => void;
      reset?: (widgetId: string) => void;
    };
  }
}

const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? "";

export function CompactNewsletterForm({
  buttonLabel = "Subscribe Now",
  className = "flex flex-col gap-4 sm:flex-row",
  inputClassName = "h-12 w-full border border-border bg-transparent px-4 text-[0.9rem] text-primary-text placeholder:text-muted-text focus:border-primary-green focus:outline-none",
  buttonClassName = "inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-primary-green px-7 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90",
  helperTextClassName = "text-[0.8rem] text-muted-text",
  successClassName = "text-[0.84rem] text-primary-green",
  errorClassName = "text-[0.84rem] text-[#b91c1c] dark:text-[#fca5a5]",
}: CompactNewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileActivated, setTurnstileActivated] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const turnstileRequired = Boolean(turnstileSiteKey);
  const hasEmail = email.trim().length > 0;
  const submitLocked = isSubmitting || !hasEmail || (turnstileRequired && !turnstileToken);

  useEffect(() => {
    if (window.turnstile) {
      setTurnstileActivated(true);
      setTurnstileReady(true);
    }
  }, []);

  useEffect(() => {
    if (!turnstileRequired || !turnstileActivated || !turnstileReady) return;
    if (!window.turnstile || !turnstileContainerRef.current) return;

    if (turnstileWidgetIdRef.current && window.turnstile?.remove) {
      window.turnstile.remove(turnstileWidgetIdRef.current);
      turnstileWidgetIdRef.current = null;
      turnstileContainerRef.current.innerHTML = "";
    }

    turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: turnstileSiteKey,
      callback: (token) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken(""),
      theme: "auto",
      size: "compact",
    });

    return () => {
      if (turnstileWidgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [turnstileActivated, turnstileReady, turnstileRequired]);

  const activateTurnstile = () => {
    if (turnstileRequired && !turnstileActivated) {
      setTurnstileActivated(true);
    }
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    activateTurnstile();
    if (submitLocked) return;

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          channels: ["gizpulse-weekly"],
          turnstileToken,
        }),
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setStatus({
          type: "error",
          message: payload.error ?? "We could not subscribe you right now. Please try again shortly.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: payload.message ?? "Subscription successful. Check your inbox.",
      });
      setEmail("");
      setTurnstileToken("");
      if (turnstileWidgetIdRef.current && window.turnstile?.reset) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    } catch {
      setStatus({
        type: "error",
        message: "We could not subscribe you right now. Please try again shortly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      {turnstileRequired && turnstileActivated ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setTurnstileReady(true)}
        />
      ) : null}
      <form className={className} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onFocus={activateTurnstile}
          placeholder="Email address"
          className={inputClassName}
          aria-label="Email address"
          required
        />
        <button
          type="submit"
          disabled={submitLocked}
          onMouseEnter={activateTurnstile}
          onFocus={activateTurnstile}
          className={`${buttonClassName} ${submitLocked ? "cursor-not-allowed opacity-45" : ""}`}
        >
          {isSubmitting ? "Subscribing..." : turnstileRequired && !turnstileToken ? "Complete Verification" : buttonLabel}
        </button>
      </form>

      {turnstileRequired && turnstileActivated ? (
        <div className="space-y-2">
          <div className="w-full overflow-hidden">
            <div className="newsletter-turnstile-wrap newsletter-turnstile-wrap--compact">
              <div ref={turnstileContainerRef} />
            </div>
          </div>
          <p className={helperTextClassName}>
            {turnstileToken ? "Verification complete." : "Please complete verification to subscribe."}
          </p>
        </div>
      ) : null}

      {status.type !== "idle" ? (
        <p className={status.type === "success" ? successClassName : errorClassName}>{status.message}</p>
      ) : null}
    </div>
  );
}

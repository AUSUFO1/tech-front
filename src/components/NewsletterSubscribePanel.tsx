"use client";

import Script from "next/script";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Channel = {
  id: string;
  title: string;
  description: string;
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

const channels: Channel[] = [
  {
    id: "techfront-weekly",
    title: "Techfront Weekly",
    description: "Top story, curated jobs, and practical growth signals every Sunday.",
  },
  {
    id: "jobs-alerts",
    title: "Jobs Alerts",
    description: "Remote and Nigeria-focused openings delivered as soon as they land.",
  },
  {
    id: "opportunity-radar",
    title: "Opportunity Radar",
    description: "Scholarships, fellowships, bootcamps, and deadline reminders that matter.",
  },
];

const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ?? "";

export function NewsletterSubscribePanel() {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    "techfront-weekly": true,
    "jobs-alerts": true,
    "opportunity-radar": true,
  });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileCompact, setTurnstileCompact] = useState(false);
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  const selectedCount = useMemo(() => Object.values(selected).filter(Boolean).length, [selected]);
  const hasEmail = email.trim().length > 0;
  const isDisabled = selectedCount === 0 || !hasEmail;
  const selectedChannels = useMemo(
    () => Object.entries(selected).filter(([, checked]) => checked).map(([id]) => id),
    [selected]
  );
  const turnstileRequired = Boolean(turnstileSiteKey);

  useEffect(() => {
    if (!turnstileRequired) return;

    const mediaQuery = window.matchMedia("(max-width: 480px)");
    const syncSize = () => setTurnstileCompact(mediaQuery.matches);

    syncSize();
    mediaQuery.addEventListener("change", syncSize);

    return () => {
      mediaQuery.removeEventListener("change", syncSize);
    };
  }, [turnstileRequired]);

  useEffect(() => {
    if (!turnstileRequired || !turnstileReady) return;
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
      size: turnstileCompact ? "compact" : "normal",
    });

    return () => {
      if (turnstileWidgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [turnstileCompact, turnstileReady, turnstileRequired]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isDisabled || isSubmitting || (turnstileRequired && !turnstileToken)) return;

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
          name,
          channels: selectedChannels,
          turnstileToken,
        }),
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setStatus({
          type: "error",
          message: payload.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setStatus({
        type: "success",
        message: payload.message ?? "Subscription successful. Check your inbox.",
      });
      setEmail("");
      setName("");
      setTurnstileToken("");
      if (turnstileWidgetIdRef.current && window.turnstile?.reset) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-8 border-t border-border pt-12 lg:mt-12 lg:pt-16">
      {turnstileRequired ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setTurnstileReady(true)}
        />
      ) : null}
      <h2 className="font-display text-[2.1rem] font-bold leading-[0.96] tracking-[-0.05em] text-primary-text sm:text-[3.35rem]">
        Your inbox, upgraded by Techfront.
      </h2>
      <p className="mt-4 max-w-[52rem] text-[1rem] leading-7 text-muted-text sm:text-[1.12rem] sm:leading-8">
        Tech, career growth, and opportunities. Choose your channels and let Techfront do the filtering.
      </p>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {channels.map((channel) => {
          const checked = Boolean(selected[channel.id]);

          return (
            <label
              key={channel.id}
              className={`block cursor-pointer border bg-card-background p-5 transition-colors ${
                checked
                  ? "border-gold-accent bg-gold-accent/10"
                  : "border-border hover:border-gold-accent/70 hover:bg-gold-accent/5"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) =>
                    setSelected((current) => ({ ...current, [channel.id]: event.target.checked }))
                  }
                  className="mt-1 h-4 w-4 shrink-0 accent-gold-accent"
                />
                <div>
                  <p className="font-display text-[1.55rem] font-bold leading-[0.95] tracking-[-0.04em] text-primary-text sm:text-[2rem]">
                    {channel.title}
                  </p>
                  <p className="mt-3 text-[0.95rem] leading-7 text-muted-text">{channel.description}</p>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <section className="mt-8 overflow-hidden border border-border bg-card-background p-7 sm:p-9">
        <h3 className="font-display text-[2rem] font-bold leading-[0.96] tracking-[-0.05em] text-primary-text sm:text-[2.9rem]">
          Subscribe Now
        </h3>
        <p className="mt-2 text-[0.98rem] text-muted-text">
          Select at least one newsletter above to continue.
        </p>
        <p className="mt-3 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-primary-green">
          {selectedCount} newsletter{selectedCount === 1 ? "" : "s"} selected
        </p>

        <form className="mt-7 max-w-[34rem] space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="newsletter-name"
              className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-text"
            >
              Name
            </label>
            <input
              id="newsletter-name"
              name="name"
              type="text"
              placeholder="Yusuf"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 h-12 w-full border border-border bg-background px-4 text-[0.92rem] text-primary-text placeholder:text-muted-text focus:border-gold-accent focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="newsletter-email"
              className="text-[0.74rem] font-bold uppercase tracking-[0.14em] text-primary-text"
            >
              Email Address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="john.doe@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-12 w-full border border-border bg-background px-4 text-[0.92rem] text-primary-text placeholder:text-muted-text focus:border-gold-accent focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isDisabled || isSubmitting || (turnstileRequired && !turnstileToken)}
            className={`inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-[0.72rem] font-bold uppercase tracking-[0.14em] transition-opacity sm:h-12 sm:w-auto sm:min-w-[18rem] sm:px-7 sm:text-[0.76rem] sm:tracking-[0.15em] ${
              isDisabled || isSubmitting || (turnstileRequired && !turnstileToken)
                ? "cursor-not-allowed bg-primary-green text-white opacity-45"
                : "bg-primary-green text-white hover:opacity-90"
            }`}
          >
            {isSubmitting
              ? "Subscribing..."
              : `Subscribe to ${selectedCount} Newsletter${selectedCount === 1 ? "" : "s"}`}
          </button>

          {turnstileRequired ? (
            <div className="space-y-3">
              <div className="w-full overflow-hidden">
                <div className={`newsletter-turnstile-wrap ${turnstileCompact ? "newsletter-turnstile-wrap--compact" : ""}`}>
                  <div ref={turnstileContainerRef} />
                </div>
              </div>
              <p className="text-[0.82rem] text-muted-text">
                {turnstileToken ? "Verification complete." : "Please complete the verification above."}
              </p>
            </div>
          ) : (
            <div className="inline-flex w-full max-w-[24rem] items-center gap-3 border border-border bg-background px-4 py-3 text-[0.84rem] text-primary-text">
              <span className="inline-block h-5 w-5 rounded-sm border border-gold-accent/80 bg-gold-accent/10" />
              Human verification will appear after Turnstile is connected
            </div>
          )}

          <p className="text-[0.82rem] text-muted-text">
            By subscribing, you agree to receive our newsletters. You can unsubscribe at any time.
          </p>

          {status.type !== "idle" ? (
            <p
              className={`text-[0.86rem] ${
                status.type === "success" ? "text-primary-green" : "text-[#b91c1c] dark:text-[#fca5a5]"
              }`}
            >
              {status.message}
            </p>
          ) : null}
        </form>
      </section>
    </section>
  );
}

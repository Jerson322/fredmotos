"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block">
        <span className="label text-white/60">Correo</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1.5 h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3 text-white outline-none focus:border-brand"
        />
      </label>
      <label className="block">
        <span className="label text-white/60">Contraseña</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 h-11 w-full rounded-lg border border-white/15 bg-white/5 px-3 text-white outline-none focus:border-brand"
        />
      </label>
      {state?.error && (
        <p role="alert" className="rounded-lg bg-brand/15 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="h-11 w-full rounded-lg bg-brand font-bold uppercase tracking-wide text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}

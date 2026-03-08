<script setup>
const clerk = useClerk();
const { signIn } = useSignIn();
const error = ref(null);

watchEffect(async () => {
  if (!clerk.value) return;

  try {
    await clerk.value.handleRedirectCallback({
      signUpForceRedirectUrl: "/",
      signInForceRedirectUrl: "/",
      continueSignUpUrl: "/sign-up/continue",
    });
  } catch (err) {
    const errCode = err?.errors?.[0]?.code;

    // Uživatel se pokusil zaregistrovat přes Google, ale účet už existuje
    // → přeneseme OAuth stav na přihlášení
    if (errCode === "external_account_exists" && signIn.value) {
      try {
        await signIn.value.create({ transfer: true });

        if (signIn.value.status === "complete") {
          await clerk.value.setActive({ session: signIn.value.createdSessionId });
          await navigateTo("/");
        }
      } catch (transferErr) {
        error.value = transferErr?.errors?.[0]?.message ?? transferErr?.message ?? String(transferErr);
        console.error("[SSO Transfer Error]", transferErr);
      }
    } else {
      error.value = err?.errors?.[0]?.message ?? err?.message ?? String(err);
      console.error("[SSO Callback Error]", err);
    }
  }
});
</script>

<template>
  <div class="min-h-screen bg-canvas flex items-center justify-center">
    <div v-if="error" class="text-center space-y-3">
      <p class="text-rose-500 font-medium">Chyba registrace: {{ error }}</p>
      <a href="/sign-up" class="text-sm text-ink-muted underline">Zkusit znovu</a>
    </div>
    <div v-else class="text-sm text-ink-muted">Dokončování registrace...</div>
  </div>
</template>

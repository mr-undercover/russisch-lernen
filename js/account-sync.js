(function () {
  const cfg = window.SUPABASE_CONFIG || {};
  const status = () => document.getElementById('accountStatus');
  const say = message => { if (status()) status().textContent = message; };
  const configured = /^https:\/\/.+/.test(cfg.url || '') && !!cfg.anonKey;
  if (!configured || !window.supabase?.createClient) {
    say('Konto-Sync ist noch nicht eingerichtet. Projekt-URL und öffentlichen anon-Key in js/supabase-config.js eintragen.');
    return;
  }
  const client = window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { persistSession: true, autoRefreshToken: true } });
  window.accountSync = { client, user: null, timer: 0, syncing: false };
  const merge = (cloud, local) => {
    if (Array.isArray(cloud) && Array.isArray(local)) return [...new Set([...cloud, ...local])];
    if (cloud && local && typeof cloud === 'object' && typeof local === 'object' && !Array.isArray(cloud) && !Array.isArray(local)) {
      const result = { ...cloud };
      Object.keys(local).forEach(key => { result[key] = key in cloud ? merge(cloud[key], local[key]) : local[key]; });
      return result;
    }
    return local === undefined ? cloud : local;
  };
  const sync = async () => {
    const s = window.accountSync;
    if (!s.user || s.syncing || storage.demoMode) return;
    s.syncing = true;
    try {
      const { data, error } = await s.client.rpc('sync_user_progress', { new_payload: storage.userData });
      if (error) throw error;
      if (data) {
        storage.userData = merge(data, storage.userData);
        localStorage.setItem(`russisch_progress_${s.user.id}`, JSON.stringify(storage.userData));
      }
      say(`Synchronisiert als ${s.user.email}`);
    } catch (error) { console.error('Progress sync failed', error); say('Synchronisierung fehlgeschlagen. Änderungen bleiben lokal gespeichert und werden später erneut gesendet.'); }
    finally { s.syncing = false; }
  };
  const schedule = () => {
    if (!window.accountSync?.user || storage.demoMode) return;
    clearTimeout(window.accountSync.timer);
    window.accountSync.timer = setTimeout(sync, 800);
  };
  window.scheduleAccountSync = schedule;
  const load = async user => {
    window.accountSync.user = user || null;
    get('accountImportLocal').hidden = !user;
    if (user) { get('accountEmail').value = user.email || ''; get('accountUsername').value = user.user_metadata?.username || ''; }
    if (!user) {
      try { storage.userData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || 'null') || JSON.parse(JSON.stringify(DEFAULT_USER_DATA)); } catch (_) {}
      storage.applySettingsToApp(); window.app?.renderAll(); say('Lokaler Lernstand aktiv'); return;
    }
    try {
      let cached = {};
      try { cached = JSON.parse(localStorage.getItem(`russisch_progress_${user.id}`) || '{}'); } catch (_) {}
      const { data, error } = await client.from('user_progress').select('payload').eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      storage.userData = data?.payload ? merge(data.payload, cached) : merge(storage.userData, cached);
      storage.saveUserData();
      await sync();
      window.app?.renderAll();
    } catch (error) { console.error(error); say('Konnte den Cloud-Lernstand nicht laden. Lokale Daten bleiben erhalten.'); }
  };
  const get = id => document.getElementById(id);
  get('accountImportLocal').onclick = async () => {
    if (!window.accountSync.user) return;
    try {
      const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA) || 'null');
      if (!local) return say('Auf diesem Gerät wurde kein lokaler Lernstand gefunden.');
      storage.userData = merge(storage.userData, local);
      storage.saveUserData();
      await sync();
      window.app?.renderAll();
      say('Lokaler Lernstand wurde mit diesem Konto zusammengeführt.');
    } catch (error) { say(`Import fehlgeschlagen: ${error.message}`); }
  };
  get('accountSignUp').onclick = async () => {
    const { data, error } = await client.auth.signUp({ email: get('accountEmail').value.trim(), password: get('accountPassword').value, options: { data: { username: get('accountUsername').value.trim() } } });
    if (error) return say(`Registrierung fehlgeschlagen: ${error.message}`);
    if (data.session) await load(data.user); else say('Bitte bestätige deine E-Mail. Danach kannst du dich anmelden.');
  };
  get('accountSignIn').onclick = async () => {
    const { data, error } = await client.auth.signInWithPassword({ email: get('accountEmail').value.trim(), password: get('accountPassword').value });
    if (error) return say(`Anmeldung fehlgeschlagen: ${error.message}`);
    await load(data.user);
  };
  get('accountSaveProfile').onclick = async () => {
    if (!window.accountSync.user) return say('Melde dich zuerst an.');
    const { data, error } = await client.auth.updateUser({ data: { username: get('accountUsername').value.trim() } });
    if (error) return say(`Profil konnte nicht gespeichert werden: ${error.message}`);
    window.accountSync.user = data.user; window.app?.renderProfile(); say('Benutzername gespeichert.');
  };
  get('accountSignOut').onclick = async () => { await client.auth.signOut(); await load(null); };
  get('accountResetPassword').onclick = async () => {
    const email = get('accountEmail').value.trim();
    if (!email) return say('Trage zuerst deine E-Mail-Adresse ein.');
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
    say(error ? `Zurücksetzen fehlgeschlagen: ${error.message}` : 'Falls ein Konto existiert, wurde ein Link zum Zurücksetzen gesendet.');
  };
  client.auth.onAuthStateChange((_event, session) => { setTimeout(() => { void load(session?.user || null); }, 0); });
  client.auth.getSession().then(({ data }) => load(data.session?.user || null));
  window.addEventListener('online', schedule);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });
})();

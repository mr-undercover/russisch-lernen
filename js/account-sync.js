(function () {
  const cfg = window.SUPABASE_CONFIG || {};
  const get = id => document.getElementById(id);
  const status = () => get('accountStatus');
  const say = message => { if (status()) status().textContent = message; };
  const configured = /^https:\/\/.+\.supabase\.co$/.test(cfg.url || '') && !!cfg.anonKey;
  if (!configured || !window.supabase?.createClient) {
    say('Supabase-Konfiguration oder Client-Bibliothek fehlt.');
    return;
  }
  const client = window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  const state = window.accountSync = { client, user:null, timer:0, syncing:false, loading:false };
  const userKey = id => `russisch_progress_${id}`;
  const pendingKey = id => `russisch_pending_${id}`;
  const merge = (cloud, local) => {
    if (Array.isArray(cloud) && Array.isArray(local)) return [...new Set([...cloud, ...local])];
    if (cloud && local && typeof cloud==='object' && typeof local==='object' && !Array.isArray(cloud) && !Array.isArray(local)) {
      const out={...cloud}; for (const key of Object.keys(local)) out[key]=key in cloud ? merge(cloud[key],local[key]) : local[key]; return out;
    }
    return local===undefined ? cloud : local;
  };
  const applyServer = (serverPayload, localPayload={}) => {
    storage.userData=merge(serverPayload||{},localPayload||{});
    if (serverPayload && Object.hasOwn(serverPayload,'xp')) storage.userData.xp=serverPayload.xp;
    if (serverPayload && serverPayload.inventory) storage.userData.inventory={...storage.userData.inventory,...serverPayload.inventory};
    if (serverPayload && Object.hasOwn(serverPayload,'hearts')) storage.userData.hearts=serverPayload.hearts;
    if (serverPayload?.stats?.totalXpEarned!==undefined) storage.userData.stats.totalXpEarned=serverPayload.stats.totalXpEarned;
    window.adaptiveLearning?.loadFromUserData();
    storage.applySettingsToApp();
  };
  const sync = async (overridePayload) => {
    if (!state.user || state.syncing || storage.demoMode) return null;
    state.syncing=true;
    const currentUser=state.user;
    const key=pendingKey(currentUser.id);
    let payload=overridePayload;
    if (payload===undefined) {
      try { payload=JSON.parse(localStorage.getItem(key)||'{}'); } catch (_) { payload={}; }
    }
    const snapshot=JSON.stringify(payload||{});
    try {
      const {data,error}=await client.rpc('sync_user_progress',{new_payload:payload||{}});
      if(error) throw error;
      if(state.user?.id!==currentUser.id) return null;
      const localOverlay=Object.keys(payload||{}).length ? storage.userData : {};
      applyServer(data,localOverlay);
      localStorage.setItem(userKey(currentUser.id),JSON.stringify(storage.userData));
      const pending=localStorage.getItem(key);
      if(pending===snapshot || !pending) localStorage.removeItem(key);
      else schedule();
      say(`Synchronisiert als ${currentUser.email||'Konto'}`);
      return data;
    } catch(error) {
      console.error('Progress sync failed',error);
      say('Synchronisierung fehlgeschlagen. Änderungen bleiben lokal vorgemerkt und werden bei Verbindung erneut gesendet.');
      throw error;
    } finally { state.syncing=false; }
  };
  const schedule = () => {
    if(!state.user||storage.demoMode) return;
    const key=pendingKey(state.user.id);
    try { localStorage.setItem(key,JSON.stringify(storage.userData)); } catch(error) { console.error('Could not queue progress',error); }
    clearTimeout(state.timer);
    state.timer=setTimeout(()=>sync().catch(()=>{}),700);
  };
  window.scheduleAccountSync=schedule;
  const load = async user => {
    if(user && state.loadingUserId===user.id) return;
    state.loadingUserId=user?.id||null;
    const epoch=(state.loadEpoch||0)+1; state.loadEpoch=epoch;
    state.user=user||null;
    get('accountImportLocal').hidden=!user;
    if(user) { get('accountEmail').value=user.email||''; get('accountUsername').value=user.user_metadata?.username||''; }
    if(!user) {
      state.loadingUserId=null;
      get('accountPassword').value='';
      try { storage.userData=JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA)||'null')||JSON.parse(JSON.stringify(DEFAULT_USER_DATA)); } catch (_) {}
      window.adaptiveLearning?.loadFromUserData();
      storage.applySettingsToApp(); window.app?.renderAll(); say('Lokaler Lernstand aktiv'); return;
    }
    try {
      let pending={}; try { pending=JSON.parse(localStorage.getItem(pendingKey(user.id))||'{}'); } catch (_) {}
      if(Object.keys(pending).length) storage.userData=pending;
      else { try { storage.userData=JSON.parse(localStorage.getItem(userKey(user.id))||'null')||JSON.parse(JSON.stringify(DEFAULT_USER_DATA)); } catch (_) { storage.userData=JSON.parse(JSON.stringify(DEFAULT_USER_DATA)); } }
      // Empty payload fetches cloud state; only queued, unsynced changes are merged into it.
      const result=await sync(pending);
      if(state.loadEpoch!==epoch||state.user?.id!==user.id) return;
      window.app?.renderAll();
      say(`Angemeldet als ${user.email||'Nutzer'}`);
      state.loadingUserId=null;
      return result;
    } catch (_) { if(state.loadEpoch===epoch) { say('Cloud-Lernstand konnte nicht geladen werden. Der lokale Zwischenstand bleibt erhalten.'); state.loadingUserId=null; } }
  };
  const beginSession = async (exercises, lessonId, mode='practice') => {
    if(!state.user||storage.demoMode) return null;
    const ids=exercises.flatMap(ex=>ex.learningQuestions?.map(q=>q.id)||[ex.id]);
    const unique=[...new Set(ids)];
    const {data,error}=await client.rpc('begin_learning_session',{p_question_ids:unique,p_mode:lessonId?'lesson':mode,p_lesson_id:lessonId||null});
    if(error) throw error;
    return data;
  };
  const submitAnswer = async (sessionId,exercise,answer) => {
    const submit=async(id,payload)=>{
      const {data,error}=await client.rpc('submit_learning_answer',{p_session_id:sessionId,p_question_id:id,p_answer:payload});
      if(error) throw error;
      if(data?.inventory) storage.userData.inventory={...storage.userData.inventory,...data.inventory};
      if(data?.hearts!==undefined) storage.userData.hearts=data.hearts;
      window.app?.updateHeaderStats();
      return !!data?.correct;
    };
    if(exercise.type==='matching'&&exercise.learningQuestions) {
      const results=[];
      for(const q of exercise.learningQuestions) {
        const pair=(answer?.pairs||[]).find(p=>p.left===q.left);
        results.push(await submit(q.id,{pairs:pair?[pair]:[]}));
      }
      return results.every(Boolean);
    }
    const payload=exercise.type==='matching'?{pairs:answer?.pairs||[]}:{value:answer?.value??''};
    return submit(exercise.id,payload);
  };
  const recordMistake=async(sessionId)=>{
    const {data,error}=await client.rpc('record_learning_mistake',{p_session_id:sessionId,p_attempt_id:crypto.randomUUID()});
    if(error)throw error;
    storage.userData.inventory={...storage.userData.inventory,...data.inventory}; storage.userData.hearts=data.hearts;
    window.app?.updateHeaderStats(); return data;
  };
  const finishSession = async sessionId => {
    const {data,error}=await client.rpc('finish_learning_session',{p_session_id:sessionId});
    if(error) throw error;
    storage.userData.xp=data.xp_balance;
    storage.userData.inventory={...storage.userData.inventory,...data.inventory};
    storage.userData.hearts=data.inventory?.hearts??storage.userData.hearts;
    storage.userData.stats.totalXpEarned=data.total_xp_earned??storage.userData.stats.totalXpEarned;
    storage.saveUserData(); window.app?.updateHeaderStats(); return data;
  };
  const purchaseItem = async (itemId,requestId=crypto.randomUUID()) => {
    const {data,error}=await client.rpc('purchase_shop_item',{p_item_id:itemId,p_request_id:requestId});
    if(error) throw error;
    storage.userData.xp=data.xp_balance;
    storage.userData.inventory={...storage.userData.inventory,...data.inventory};
    storage.userData.hearts=data.inventory?.hearts??storage.userData.hearts;
    storage.userData.stats.itemsBoughtCount=(storage.userData.stats.itemsBoughtCount||0)+1;
    storage.unlockAchievement?.('shop_buyer');
    storage.saveUserData(); return data;
  };
  const equipItem = async itemId => {
    const {data,error}=await client.rpc('equip_shop_item',{p_item_id:itemId});
    if(error) throw error;
    storage.userData.inventory={...storage.userData.inventory,...data.inventory}; storage.saveUserData(); storage.applySettingsToApp(); return data;
  };
  window.accountSync={...state,client,get user(){return state.user;},sync,load,beginSession,submitAnswer,recordMistake,finishSession,purchaseItem,equipItem};
  get('accountImportLocal').onclick=async()=>{
    if(!state.user)return;
    try {
      const local=JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA)||'null');
      if(!local)return say('Auf diesem Gerät wurde kein lokaler Lernstand gefunden.');
      try { local.adaptiveLearning=JSON.parse(localStorage.getItem('russisch_adaptive_learning_v1')||'{}'); } catch (_) { local.adaptiveLearning={}; }
      get('accountImportLocal').disabled=true;
      const {data,error}=await client.rpc('import_local_progress',{local_payload:local});
      if(error)throw error;
      localStorage.removeItem(pendingKey(state.user.id)); applyServer(data,{});
      localStorage.setItem(userKey(state.user.id),JSON.stringify(storage.userData));
      window.app?.renderAll(); say('Lernfortschritt übernommen. XP und Shop-Inventar wurden aus Sicherheitsgründen nicht importiert.');
    } catch(error) { say(`Import nicht möglich: ${error.message}`); }
    finally { get('accountImportLocal').disabled=false; }
  };
  get('accountSignUp').onclick=async()=>{
    const {data,error}=await client.auth.signUp({email:get('accountEmail').value.trim(),password:get('accountPassword').value,options:{data:{username:get('accountUsername').value.trim()},emailRedirectTo:location.origin+location.pathname}});
    if(error)return say(`Registrierung fehlgeschlagen: ${error.message}`);
    if(data.session)await load(data.user);else say('Bitte bestätige deine E-Mail. Danach kannst du dich anmelden.');
  };
  get('accountSignIn').onclick=async()=>{
    const {data,error}=await client.auth.signInWithPassword({email:get('accountEmail').value.trim(),password:get('accountPassword').value});
    if(error)return say(`Anmeldung fehlgeschlagen: ${error.message}`); await load(data.user);
  };
  get('accountSaveProfile').onclick=async()=>{
    if(!state.user)return say('Melde dich zuerst an.');
    const {data,error}=await client.auth.updateUser({data:{username:get('accountUsername').value.trim()}});
    if(error)return say(`Profil konnte nicht gespeichert werden: ${error.message}`); state.user=data.user; window.app?.renderProfile(); say('Benutzername gespeichert.');
  };
  get('accountSignOut').onclick=async()=>{const {error}=await client.auth.signOut();if(error)return say(`Abmeldung fehlgeschlagen: ${error.message}`);await load(null);};
  get('accountResetPassword').onclick=async()=>{
    const email=get('accountEmail').value.trim(); if(!email)return say('Trage zuerst deine E-Mail-Adresse ein.');
    const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
    say(error?`Zurücksetzen fehlgeschlagen: ${error.message}`:'Falls ein Konto existiert, wurde ein Link zum Zurücksetzen gesendet.');
  };
  get('accountSetNewPassword').onclick=async()=>{
    const password=get('accountNewPassword').value;
    if(password.length<8)return say('Das neue Passwort muss mindestens 8 Zeichen lang sein.');
    const {error}=await client.auth.updateUser({password});
    if(error)return say(`Passwort konnte nicht gespeichert werden: ${error.message}`);
    get('accountNewPassword').value='';get('accountSetNewPassword').hidden=true;say('Passwort wurde aktualisiert.');
  };
  client.auth.onAuthStateChange((event,session)=>{
    if(event==='PASSWORD_RECOVERY')get('accountSetNewPassword').hidden=false;
    setTimeout(()=>{void load(session?.user||null);},0);
  });
  client.auth.getSession().then(({data,error})=>{if(error)say('Sitzung konnte nicht geprüft werden.');else return load(data.session?.user||null);});
  window.addEventListener('online',()=>sync().catch(()=>{}));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state.user)sync().catch(()=>{});});
})();

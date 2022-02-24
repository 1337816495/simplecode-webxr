async function Session(renderer, config = {}, callback_start, callback_end) {

    const session = {};
    const isSupport = await checkSupport();

    let currentSession = null;

    if (isSupport) {

        session.ok = true;
        session.on = () => { if (!currentSession) navigator.xr.requestSession('immersive-ar', config).then(onSessionStarted); };
        session.off = () => { if (currentSession) currentSession.end(); };

    } else {

        session.ok = false;
        session.on = null;
        session.off = null;

    }

    return session;

    // 必须支持 xr 和 ar 和 https
    async function checkSupport() {

        if (!navigator.xr) return false;

        if (!(await navigator.xr.isSessionSupported("immersive-ar"))) return false;

        if (!window.isSecureContext) return false;

        return true;

    }

    async function onSessionStarted(session) {

        session.addEventListener("end", onSessionEnded);

        renderer.xr.setReferenceSpaceType("local");

        await renderer.xr.setSession(session);

        currentSession = session;

        if (callback_start) callback_start();

    }

    function onSessionEnded() {

        currentSession.removeEventListener("end", onSessionEnded);

        currentSession = null;

        if (callback_end) callback_end(session);

    }

}

export { Session };
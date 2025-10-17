// Kakao SDK configuration and utilities

declare global {
  interface Window {
    Kakao: any;
  }
}

export const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "";
export const KAKAO_REDIRECT_URI =
  process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || "";

export const initKakao = () => {
  if (
    typeof window !== "undefined" &&
    window.Kakao &&
    !window.Kakao.isInitialized()
  ) {
    window.Kakao.init(KAKAO_JS_KEY);
  }
};

const loadKakaoSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Kakao SDK"));
    document.head.appendChild(script);
  });
};

export const waitForKakao = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not available"));
      return;
    }

    if (window.Kakao && window.Kakao.isInitialized()) {
      console.log("Kakao SDK already initialized");
      console.log("Kakao js key", KAKAO_JS_KEY);
      resolve();
      return;
    }

    let attempts = 0;
    const maxAttempts = 30; // 3 seconds max wait

    // Wait for Kakao SDK to load
    const checkKakao = () => {
      attempts++;
      console.log(`Checking for Kakao SDK, attempt ${attempts}`);

      if (window.Kakao) {
        console.log("Kakao SDK found, initializing...");
        console.log("KAKAO_JS_KEY:", KAKAO_JS_KEY ? "Set" : "Not set");
        console.log("Kakao object keys:", Object.keys(window.Kakao));

        if (!window.Kakao.isInitialized()) {
          if (!KAKAO_JS_KEY || KAKAO_JS_KEY.length < 10) {
            reject(
              new Error(
                "Invalid KAKAO_JS_KEY. Please check your environment variable."
              )
            );
            return;
          }
          window.Kakao.init(KAKAO_JS_KEY);
        }

        console.log("Kakao initialized:", window.Kakao.isInitialized());
        console.log("Kakao.Auth available:", !!window.Kakao.Auth);
        console.log(
          "Kakao.Auth.login available:",
          !!(window.Kakao.Auth && window.Kakao.Auth.login)
        );

        resolve();
      } else if (attempts >= maxAttempts) {
        console.log(
          "Kakao SDK not found in document, trying to load dynamically..."
        );
        // Try to load the SDK dynamically
        loadKakaoSDK()
          .then(() => {
            console.log("Kakao SDK loaded dynamically, initializing...");
            if (!window.Kakao.isInitialized()) {
              window.Kakao.init(KAKAO_JS_KEY);
            }
            resolve();
          })
          .catch((err) => {
            reject(new Error(`Failed to load Kakao SDK: ${err.message}`));
          });
      } else {
        setTimeout(checkKakao, 100);
      }
    };

    // Start checking after a short delay
    setTimeout(checkKakao, 100);
  });
};

export const loginWithKakao = (): Promise<string> => {
  return waitForKakao().then(() => {
    return new Promise((resolve, reject) => {
      if (!window.Kakao) {
        reject(new Error("Kakao SDK not loaded"));
        return;
      }

      if (
        !window.Kakao.Auth ||
        (!window.Kakao.Auth.login && !window.Kakao.Auth.authorize)
      ) {
        reject(
          new Error(
            "Kakao Auth module not available. Check if KAKAO_JS_KEY is set correctly."
          )
        );
        return;
      }

      if (!KAKAO_JS_KEY) {
        reject(
          new Error(
            "KAKAO_JS_KEY is not set. Please add NEXT_PUBLIC_KAKAO_JS_KEY to your environment variables."
          )
        );
        return;
      }

      if (window.Kakao.Auth.login) {
        window.Kakao.Auth.login({
          success: (authObj: any) => {
            resolve(authObj.access_token);
          },
          fail: (err: any) => {
            reject(err);
          },
        });
        return;
      }

      // Fallback for SDKs/environments without popup login: use redirect flow
      try {
        const redirectUri =
          KAKAO_REDIRECT_URI ||
          `${window.location.origin}/api/auth/kakao/callback`;
        window.Kakao.Auth.authorize({
          redirectUri,
          scope: "profile_nickname,account_email",
        });
        // This will navigate away; never resolves
      } catch (err) {
        reject(err as Error);
      }
    });
  });
};

export const authorizeWithKakaoRedirect = (
  redirectUri?: string
): Promise<never> => {
  return waitForKakao().then(() => {
    return new Promise((_, reject) => {
      if (!window.Kakao || !window.Kakao.Auth || !window.Kakao.Auth.authorize) {
        reject(new Error("Kakao authorize not available"));
        return;
      }
      const uri =
        redirectUri ||
        KAKAO_REDIRECT_URI ||
        `${window.location.origin}/api/auth/kakao/callback`;
      try {
        window.Kakao.Auth.authorize({
          redirectUri: uri,
          scope: "profile_nickname,account_email",
        });
      } catch (e) {
        reject(e as Error);
      }
    });
  });
};

export const getKakaoUserInfo = (accessToken: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject(new Error("Kakao SDK not loaded"));
      return;
    }

    window.Kakao.Auth.setAccessToken(accessToken);
    window.Kakao.API.request({
      url: "/v2/user/me",
      success: (res: any) => {
        resolve(res);
      },
      fail: (err: any) => {
        reject(err);
      },
    });
  });
};

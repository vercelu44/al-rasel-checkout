export const Cookies = {
    getAll: (): Record<string, string> => {
      return document.cookie.split("; ").reduce<Record<string, string>>((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
      }, {});
    },
  
    get: (name: string): string | null => {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? match[2] : null;
    },
  
    set: (name: string, value: string, days = 7) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
  
    remove: (name: string) => {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    },
  };
  


// export const getAllCookies = () => {
//     return document.cookie.split("; ").reduce((acc, cookie) => {
//       const [key, value] = cookie.split("=");
//       acc[key] = value;
//       return acc;
//     }, {});
//   };
  
//   export const getCookie = (name) => {
//     const cookies = getAllCookies();
//     return cookies[name] || null;
//   };
  
export const getTokenFromDB = async () => {
    try {
      const res = await fetch(`${process.env.server}/payment-tokens?type=bkash`, {
        headers: {
          AmsPrivateKey: process.env.AMS_PRIVATE_KEY,
        },
        cache: "no-store", //this is important
      });
      const tokenInfo = await res.json();
      return tokenInfo;
    } catch (e) {
      console.error("Error generating token:", e);
      return { data: { is_valid: false } }; // Indicate failure
    }
  };
  
  export const saveTokenToDB = async (token) => {
    const payload = {
      token: token,
      type: "Bkash",
      time: 50, //In minutes
    };
    try {
      const res = await fetch(`${process.env.server}/payment-tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          AmsPrivateKey: process.env.AMS_PRIVATE_KEY,
        },
        body: JSON.stringify(payload),
      });
      const tokenInfo = await res.json();
      return tokenInfo;
    } catch (e) {
      console.error("Error generating token:", e);
      return { data: { is_valid: false } }; // Indicate failure
    }
  };
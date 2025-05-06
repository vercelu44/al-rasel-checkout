import Home1 from "./Home1";
import Home2 from "./AlRasselHome";


export default async function Home() {
  const PublicKey = process.env.AMS_PUBLIC_KEY;
  const key = "pub_njADJt8yGye3OvlVxNnLKIHE0tJleDOwr3P";
  return (
    <>
    {PublicKey !== key ?  <Home1/> : <Home2/>}
     
    </>
  );
}

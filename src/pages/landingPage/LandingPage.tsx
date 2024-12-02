// import { Image } from "antd";
// import AppButton from "../../components/AppButton";
// import { useNavigate } from "react-router-dom";

// const LandingPage = () => {
//   const navigate = useNavigate();
//   return (
//     <main className="flex flex-col items-center justify-center text-center font-inter min-h-screen">
//       <Image src="/assets/images/logo.png" alt="logo" />
//       <h1 className="text-black text-[32px] font-medium leading-tight md:text-[48px] lg:text-[64px] mb-8">
//         Sign in!
//       </h1>
//       <AppButton width="40%" children="Sign In" onClick={() => navigate("/home")} />
//     </main>
//   );
// };

// export default LandingPage;


import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import keycloakService from '../../service/keycloakService';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDisplayMsg, setShowDisplayMsg] = useState(false);

  const redirectUrl = location?.state?.redirectUrl;

  useEffect(() => {
    if (keycloakService) {
      console.log(keycloakService);
      
      
      if (keycloakService.isLoggedIn()) {
        if (keycloakService.hasRole(['ADMIN'])) {
          navigate('/admin');
        } else {
          setShowDisplayMsg(true);
        }
      } else {
          // keycloakService.doLogin({ name: 'http://localhost:3000/' });
          keycloakService.doLogin()
      }

    }
}, []);

  return <div>{showDisplayMsg && "User Doesn't have role or user's role not yet handled."}</div>;
  
}

export default LandingPage;


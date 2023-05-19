// Amplify ---------------
import "./amplify.js"
import { useEffect, useState } from 'react'
import { Hub, Auth } from 'aws-amplify'

// import Menu from "@/components/Menu";
import "@/styles/globals.css";
import Head from "next/head";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MenuProvider } from "@/context/MenuContext";


// recoil
import { RecoilRoot } from "recoil"

// router
import { useRouter } from 'next/router'

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffa424",
      darker: "#ffa424",
      contrastText: "#fff",
    },
    secondary: {
      main: "#FFFFFF",
      darker: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: `Montserrat, sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});



const App = ({ Component, pageProps }) => {
  const [isUserAuth, setIsUserAuth] = useState(false)
  const router = useRouter();

  useEffect(() => {
    // crear subscripcion
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      console.log("HUB: ", event)
      switch (event) {
        case "signIn":
          checkUser();

          break;
        case "signIn_failure":

          break;
        case "signOut":
          router.push({ pathname: `/` })
          break;
        default:
          break;
      }

    });
    checkUser();
    console.log("Router: ", router)
    return unsubscribe;
  }, [])

  const checkUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log("USER: ", user)
      console.log(user?.signInUserSession.accessToken.payload['cognito:groups'])
      if (user?.signInUserSession.accessToken.payload['cognito:groups'] === undefined) return
      console.log("aqui estoy")
      const userGroups = user.signInUserSession.accessToken.payload['cognito:groups'];

      if (userGroups.includes('admin')) {
        console.log("ERES ADMIN")
        router.push({ pathname: `/home/dashboard` })
      } else {

      }
    } catch (error) {

      console.error("Error: ", error);
    }
  }

  return (
    <>
      <Head>
        <title>Portaty</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        ></link>
      </Head>
      <MenuProvider>
        <ThemeProvider theme={theme}>
          <RecoilRoot>
            {
              true && <Component {...pageProps} />
            }
          </RecoilRoot>
        </ThemeProvider>
      </MenuProvider>
    </>
  )
};

export default App;

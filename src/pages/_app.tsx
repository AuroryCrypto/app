import { FirebaseContext, FirebaseQueryProvider, useAuth, useLoginObserver, useUser } from "@/lib/firebase/client";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { MantineProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import { QueryClient } from "@tanstack/react-query";
import { type AppType } from "next/app";
import Head from "next/head";

export const queryClient = new QueryClient()

const MyApp: AppType = ({ Component, pageProps }) => {
  useLoginObserver()
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>({ key: 'theme', defaultValue: 'light' })
  // make hot keys for change theme
  useHotkeys([['mod+k', () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }]])
  const { auth } = useAuth()
  const user = useUser()

  return <FirebaseContext.Provider value={{ user, auth }}>
    <FirebaseQueryProvider>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: theme,

          // linear-gradient(151deg, #F83D6A 0%, #937DEF 100%)
          defaultGradient: {
            deg: 151,
            from: '#F83D6A',
            to: '#937DEF',
          }
        }}
      >
        <ModalsProvider
          modalProps={{
            withOverlay: true,
            overlayProps: {
              opacity: 0.75,
              blur: 10,
            }
          }}
        >
          <NavigationProgress />
          <Notifications
            position="bottom-center"
          />
          <Component {...pageProps} />
        </ModalsProvider>
      </MantineProvider>
    </FirebaseQueryProvider>
  </FirebaseContext.Provider>;
};

export default api.withTRPC(MyApp);

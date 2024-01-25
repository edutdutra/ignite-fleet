import {StatusBar} from "react-native";
import {AppProvider, UserProvider} from "@realm/react";
import {ThemeProvider} from "styled-components/native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Roboto_400Regular, Roboto_700Bold, useFonts} from "@expo-google-fonts/roboto";

import {REALM_APP_ID} from "@env";
import {RealmProvider} from './src/libs/realm'

import {Routes} from "./src/routes";
import {SignIn} from "./src/screens/SignIn";
import {Loading} from "./src/components/Loading";

import theme from "./src/theme";

export default function App() {
    const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold})

    if (!fontsLoaded) {
        return (
            <Loading/>
        )
    }

    return (
        <AppProvider id={REALM_APP_ID}>
            <ThemeProvider theme={theme}>
                <SafeAreaProvider>
                    <StatusBar
                        barStyle="light-content"
                        backgroundColor="transparent"
                        translucent
                    />
                    <UserProvider fallback={SignIn}>
                        <RealmProvider>
                            <Routes/>
                        </RealmProvider>
                    </UserProvider>
                </SafeAreaProvider>
            </ThemeProvider>
        </AppProvider>
    );
}
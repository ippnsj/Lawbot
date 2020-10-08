import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import * as Font from "expo-font";
import colors from "../config/colors";

function WelcomeScreen(props) {
  Font.loadAsync({
    SCDream8: require("../assets/fonts/SCDream8.otf"),
    KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.logoTitle}>LAWBOT</Text>
        <Image
          style={styles.logoImage}
          source={require("../assets/logo.png")}
        />
        <TextInput placeholder="아이디" style={styles.textInput} />
        <TextInput placeholder="비밀번호" style={styles.textInput} />
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.enrollButton}>
          <Text style={styles.enrollButtonText}>회원가입</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <View style={{ flex: 1 }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === `ios` ? 0 : Expo.Constants.statusBarHeight,
    overflow: "hidden",
  },
  enrollButton: {
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "80%",
  },
  enrollButtonText: {
    color: "#868686",
    fontFamily: Font.KPWDBold,
    fontWeight: "bold",
  },
  innerContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 4,
    width: "100%",
    padding: 24,
  },
  logoTitle: {
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: Font.SCDream8,
  },
  logoImage: {
    height: 250,
    width: 250,
  },
  loginButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    width: "80%",
  },
  loginButtonText: {
    color: "#fff",
    fontFamily: Font.KPWDBold,
    fontWeight: "bold",
  },
  textInput: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,
    height: 40,
    width: "80%",
    paddingLeft: 10,
    marginTop: 15,
  },
});

export default WelcomeScreen;

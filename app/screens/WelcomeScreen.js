import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import * as Font from "expo-font";

import colors from "../config/colors";

function WelcomeScreen(props) {
  Font.loadAsync({
    SCDream8: require("../assets/fonts/SCDream8.otf"),
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoTitle}>LAWBOT</Text>
        <Image
          style={styles.logoImage}
          source={require("../assets/logo.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    position: "absolute",
    top: 100,
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
});

export default WelcomeScreen;

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
    KPBRegular: require("../assets/fonts/KoPubBatang-Regular.ttf"),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../assets/menu.png")} style={styles.menu} />
        <Text style={styles.logoTitle}>LAWBOT</Text>
        <Image
          source={require("../assets/profile.png")}
          style={styles.profile}
        />
      </View>
      <KeyboardAvoidingView style={styles.body}>
        <View style={styles.fieldContatiner}>
          <Text style={styles.field}>손해배상(자)</Text>
          <TouchableOpacity style={styles.selectField}>
            <Text style={styles.selectFieldText}>다른 분야 선택</Text>
          </TouchableOpacity>
          <View style={styles.underbar} />
        </View>
        <View style={styles.pettitionContent}>
          <Text style={styles.subTitle}>소장 양식 입력</Text>
          <View style={styles.fileUploadContainer}>
            <Text style={styles.fileUploadGuide}>
              소장을 스캔해서 올리시려면?
            </Text>
            <TouchableOpacity style={styles.fileUpload}>
              <Text style={styles.fileUploadText}>PDF 파일 업로드</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pettition}>
            <Text style={styles.petitionTitle}>소장</Text>
          </View>
          <TouchableOpacity style={styles.submit}>
            <Text style={styles.submitText}>유사 판례 분석</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 10,
    overflow: "scroll",
  },
  container: {
    flex: 1,
  },
  field: {
    fontFamily: Font.KPWDBold,
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: "5%",
  },
  fieldContatiner: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: "3%",
  },
  fileUpload: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    margin: "4%",
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  fileUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileUploadGuide: {
    margin: "5%",
    fontSize: 12,
    color: "#959595",
    margin: "4%",
  },
  fileUploadText: {
    color: "#fff",
    fontSize: 10,
  },
  header: {
    flex: 1,
    marginTop: Platform.OS === `ios` ? 0 : Expo.Constants.statusBarHeight,
    backgroundColor: "#aaa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "5%",
    paddingRight: "5%",
  },
  logoTitle: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: Font.SCDream8,
  },
  menu: {
    width: 30,
    height: 30,
  },
  pettition: {
    flex: 8,
    borderWidth: 1,
    width: "90%",
    height: "100%",
  },
  pettitionContent: {
    flex: 8,
    paddingTop: "5%",
    alignItems: "center",
  },
  petitionTitle: {
    fontSize: 22,
    fontFamily: Font.KPBRegular,
    fontWeight: "bold",
  },
  profile: {
    width: 30,
    height: 30,
  },
  selectField: {
    backgroundColor: "#8C8C8C",
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 5,
    marginRight: "5%",
  },
  selectFieldText: {
    color: "#fff",
    fontSize: 10,
  },
  submit: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 5,
    width: "80%",
    marginVertical: "5%",
    alignItems: "center",
    paddingVertical: "0.5%",
  },
  submitText: {
    fontSize: 18,
    color: colors.primary,
    fontFamily: Font.KPWDBold,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 16,
    fontFamily: Font.KPWDBold,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
  underbar: {
    position: "absolute",
    width: "80%",
    height: 3,
    backgroundColor: "#E7E7E7",
    marginLeft: "10%",
  },
});

export default WelcomeScreen;

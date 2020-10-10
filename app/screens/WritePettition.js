import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

import colors from "../config/colors";

const purposePlaceholder = `청구취지를 자세히 입력해주세요.

청구취지 작성 예시
1. 원고와 피고는 이혼한다.
2. 피고는 원고에게 위자료로 금 3,000만원을 
이혼성립과 동시에 지급하되, 그 익일부터 
다 지급하는 날까지 년15%의 지연이자를 더하여 지급하라.`;

const causePlaceholder = `청구원인을 자세히 입력해주세요.

1. 당사자들의 관계
2. 금전거래 또는 대여사실
3. 결론`;

export default class WritePettition extends Component {
  state = {
    fontsLoaded: false,
    complainant: "",
    defendant: "",
    purpost: "",
    cause: "",
    cameraPermission: false,
    cameraRollPermission: false,
  };

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
      KPBRegular: require("../assets/fonts/KoPubBatang-Regular.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFonts();
  }

  //   uploadFile() {
  //     const options = {
  //       title: "Select Picker",
  //       takePhotoButtonTitle: "카메라",
  //       chooseFromLibraryButtonTitle: "갤러리",
  //       cancelButtonTitle: "취소",
  //     };

  // ImagePicker.showImagePicker(options, () => {});
  //   }

  async getCameraPermission() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      this.setState({ cameraPermission: true });
      this.getCameraRollPermission();
    } else {
      this.setState({ cameraPermission: false });
      alert("카메라 접근권한을 주어야 사진업로드가 가능합니다.");
    }
  }

  async getCameraRollPermission() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      this.setState({ cameraRollPermission: true });
      console.log("okay!!!");
    } else {
      this.setState({ cameraRollPermission: false });
      alert("사진첩 접근권한을 주어야 사진업로드가 가능합니다.");
    }
  }

  async takePictureAndCreateAlbum() {
    console.log("tpaca");
    const { uri } = await this.camera.takePictureAsync();
    console.log("uri", uri);
    const asset = await MediaLibrary.createAssetAsync(uri);
    console.log("asset", asset);
    MediaLibrary.createAlbumAsync("Expo", asset)
      .then(() => {
        Alert.alert("Album created!");
      })
      .catch((error) => {
        Alert.alert("An Error Occurred!");
      });
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <View />;
    }

    if (this.state.cameraPermission && this.state.cameraRollPermission) {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={Camera.Constants.Type.back}
            ref={(ref) => {
              this.camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={styles.cameraTake}
                onPress={() => this.takePictureAndCreateAlbum()}
              ></TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }

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
              <TouchableOpacity
                style={styles.fileUpload}
                onPress={() => this.getCameraPermission()}
              >
                <Text style={styles.fileUploadText}>PDF 파일 업로드</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pettition}>
              <ScrollView style={styles.pettitionScroll}>
                <Text style={styles.petitionTitle}>소 장</Text>
                <View style={styles.personal}>
                  <Text style={styles.person}>원{"   "}고</Text>
                  <TextInput
                    style={styles.personalInput}
                    placeholder="이름을 입력해주세요."
                    onChangeText={(constraint) => this.setState({ constraint })}
                    value={this.state.constraint}
                  ></TextInput>
                </View>
                <View style={styles.personal}>
                  <Text style={styles.person}>피{"   "}고</Text>
                  <TextInput
                    style={styles.personalInput}
                    placeholder="이름을 입력해주세요."
                    onChangeText={(defendant) => this.setState({ defendant })}
                    value={this.state.defendant}
                  ></TextInput>
                </View>
                <Text style={styles.contentSubTitle}>청 구 취 지</Text>
                <TextInput
                  multiline
                  style={styles.purpose}
                  placeholder={purposePlaceholder}
                  onChangeText={(purpose) => this.setState({ purpose })}
                  value={this.state.purpose}
                ></TextInput>
                <Text style={styles.contentSubTitle}>청 구 원 인</Text>
                <TextInput
                  multiline
                  style={styles.cause}
                  placeholder={causePlaceholder}
                  onChangeText={(cause) => this.setState({ cause })}
                  value={this.state.cause}
                ></TextInput>
              </ScrollView>
            </View>
            <TouchableOpacity style={styles.submit}>
              <Text style={styles.submitText}>유사 판례 분석</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 12,
    overflow: "scroll",
  },
  cameraTake: {
    alignSelf: "flex-end",
    height: 80,
    width: 80,
    backgroundColor: "#fff",
    borderRadius: 40,
    marginBottom: "10%",
  },
  cause: {
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    maxHeight: 150,
    padding: "5%",
    marginTop: "5%",
    overflow: "scroll",
    textAlignVertical: "top",
  },
  container: {
    flex: 1,
    marginTop: Platform.OS === `ios` ? 0 : Expo.Constants.statusBarHeight,
  },
  contentSubTitle: {
    fontSize: 18,
    fontFamily: "KPBRegular",
    marginTop: "10%",
    alignSelf: "center",
  },
  field: {
    fontFamily: "KPWDBold",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "5%",
    paddingRight: "5%",
    minHeight: 50,
  },
  logoTitle: {
    fontSize: 20,
    fontFamily: "SCDream8",
  },
  menu: {
    width: 20,
    height: 20,
  },
  person: {
    fontSize: 15,
    fontFamily: "KPBRegular",
    marginTop: "2%",
  },
  personal: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  personalInput: {
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    width: "80%",
    paddingLeft: "5%",
    margin: 0,
  },
  pettition: {
    flex: 8,
    borderWidth: 1,
    width: "90%",
    maxHeight: "100%",
    paddingVertical: "5%",
  },
  pettitionScroll: {
    paddingHorizontal: "5%",
  },
  pettitionContent: {
    flex: 8,
    paddingTop: "5%",
    alignItems: "center",
  },
  petitionTitle: {
    fontSize: 22,
    fontFamily: "KPBRegular",
    alignSelf: "center",
  },
  profile: {
    width: 20,
    height: 20,
  },
  purpose: {
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    maxHeight: 200,
    padding: "5%",
    marginTop: "5%",
    overflow: "scroll",
    textAlignVertical: "top",
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
    fontFamily: "KPWDBold",
  },
  subTitle: {
    fontSize: 16,
    fontFamily: "KPWDBold",
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

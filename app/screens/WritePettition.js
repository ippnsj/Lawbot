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
  Modal,
  Platform,
  ToastAndroid,
  Alert,
  Keyboard
} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import { MyContext } from "../../context.js";

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
    field: "손해배상(자)",
    purpose: "",
    cause: "",
    cameraPermission: false,
    cameraRollPermission: false,
    file: null,
    fieldSelectVisible: false,
    keywords: [],
    ids: [],
    similarities: [],
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
    this.setState({fieldSelectVisible: false});
    this.setState({field: this.props.route.params.field});
  }

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

  async fetchOCR() {
    const ctx = this.context;
    let data = new FormData();
    data.append("temp", this.state.file);

    new Promise((resolve, reject)=> {
      fetch(`${ctx.API_URL}/apicall`, {
        method: "POST",
        body: data,
        headers: {
            // 'Content-Type': 'multipart/form-data',
            // 'Accept': 'application/json',
            'token': ctx.token,
        },
      }).then((result) => {
        return result.json();
      }).then((result) => {
        var txt = "";
        for(const elem of result.images[0].fields) {
            txt += elem.inferText + " ";
        }

        var regEx = /청\s?구\s?취\s?지/gmu;
        var regEx1 = /청\s?구\s?원\s?인/gmu;
        var split = txt.split(regEx);
        if(split.length != 1) {
          var split1 = split[1].split(regEx1);
          if(split1.length != 1) {
            this.state.purpose = split1[0];
            this.state.cause = split1[1];
          }
          else { this.state.purpose = split1[0];}
        }
        else{
          var split1 = txt.split(regEx1);
          if(split1.length != 1) {
            this.state.cause = split1[1];
          }
        }
        this.setState({file: null});
        this.setState({cameraPermission: false});
        this.setState({cameraRollPermission: false});
      });
    });
  }

  async uploadPDF() {
    // let result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    // let result = await DocumentPicker.getDocumentAsync({ });
    //   this.setState({ file: result });
    ToastAndroid.showWithGravityAndOffset("잠시만 기다려주세요.", ToastAndroid.SHORT, ToastAndroid.TOP, 0, 100);
    var lastIndex = this.state.file.uri.lastIndexOf(".");
    var mimetype = this.state.file.uri.substr(lastIndex+1);
    this.state.file.name = this.state.file.filename;
    this.state.file.type = "application/" + mimetype;
    this.fetchOCR();
  }

  fetchNLP() {
    Keyboard.dismiss();
    if(this.state.purpose == "" || this.state.cause == "") {
      Alert.alert( "오류", "청구취지와 청구원인을 모두 채워주세요.", [ { text: "알겠습니다."} ]);
    }
    else {
      ToastAndroid.show("분석중... 잠시만 기다려주세요.", ToastAndroid.SHORT);
      const ctx = this.context;
      let body = {
        purpose: this.state.purpose,
        cause: this.state.cause,
        caseName: this.state.field,
        method:"cos"
      };
      fetch(`${ctx.API_URL}/analyze`, {
        method: 'POST',
        headers: {
            'token': ctx.token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((result) => {
          return result.json();
      }).then((result) => {
        this.setState({
          ids: [],
          similarities: [],
          keywords: []
        })
        for(var i = 0; i < 10; i++) {
          this.state.ids.push(result.ids[0][i]);
          this.state.similarities.push(result.ids[1][i]);
          this.state.keywords.push(result.keywords[0][i]);
        }
        this.props.navigation.navigate('SimilarCaseAnalysis', {
          ids: this.state.ids,
          similarities: this.state.similarities,
          keywords: this.state.keywords
        });
      });
    }
  }

  async getCameraRollPermission() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      this.setState({ cameraRollPermission: true });
    } else {
      this.setState({ cameraRollPermission: false });
      alert("사진첩 접근권한을 주어야 사진업로드가 가능합니다.");
    }
  }

  async takePictureAndCreateAlbum() {
    ToastAndroid.showWithGravityAndOffset("사진이 찍혔습니다. 잠시만 기다려주세요.", ToastAndroid.SHORT, ToastAndroid.TOP, 0, 100);
    const { uri } = await this.camera.takePictureAsync();
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ rotate: 90 }, { flip: ImageManipulator.FlipType.Vertical }]
    );
    const asset = await MediaLibrary.createAssetAsync(uri);
    MediaLibrary.createAlbumAsync("Expo", asset)
      .then(() => {
        this.setState({ file: asset });
      })
      .catch((error) => {
        Alert.alert("An Error Occurred!");
      });
  }

  overlayClose() {
    this.setState({fieldSelectVisible: false});
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <View />;
    }

    if (this.state.file !== null) {
      return (
        <View style={styles.picturePreviewContainer}>
          {/* <View style={{ flex: 1, backgroundColor: "#fff" }}></View> */}
          <Image
            source={{ uri: this.state.file.uri }}
            style={styles.picturePreview}
          />
          <View style={styles.picturePreviewUnderbar}>
            <TouchableOpacity style={styles.pictureSubmit} onPress={() => { this.setState({file: null}) }}>
              <Text style={styles.submitText}>다시찍기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pictureSubmit} onPress={() => {this.uploadPDF();}}>
              <Text style={styles.submitText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
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
          <Text style={styles.logoTitle} onPress={() => {this.props.navigation.navigate("Home")}}>LAWBOT</Text>
          <Image
            source={require("../assets/profile.png")}
            style={styles.profile}
          />
        </View>
        <KeyboardAvoidingView style={styles.body}>
          <View style={styles.fieldContatiner}>
            <Text style={styles.field}>{this.state.field}</Text>
            <TouchableOpacity style={styles.selectField} onPress={() => this.setState({fieldSelectVisible: true})}>
              <Text style={styles.selectFieldText}>다른 분야 선택</Text>
            </TouchableOpacity>
            <View style={styles.underbar} />
          </View>
          <View style={styles.pettitionContent}>
            <Text style={styles.subTitle}>소장 양식 입력</Text>
            <View style={styles.fileUploadContainer}>
              <Text style={styles.fileUploadGuide}>
                소장을 찍어서 올리시려면?
              </Text>
              <TouchableOpacity
                style={styles.fileUpload}
                onPress={() => this.getCameraPermission()}
              >
                <Text style={styles.fileUploadText}>사진 파일 업로드</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pettition}>
              <ScrollView style={styles.pettitionScroll}>
                <Text style={styles.petitionTitle}>소 장</Text>
                {/* <View style={styles.personal}>
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
                </View> */}
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
            <TouchableOpacity style={styles.submit} onPress={() => {this.fetchNLP()}}>
              <Text style={styles.submitText}>유사 판례 분석</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <Modal visible={this.state.fieldSelectVisible} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
          <View style={styles.fieldSelectModal}>
            <View style={styles.fieldSelectContainer}>
              <View style={styles.fieldSelectHeader}>
                <Text style={styles.fieldModalText}>분야선택</Text>
                <TouchableOpacity style={styles.fieldExcButton} onPress={() => {this.setState({field: "손해배상(기)"}); this.overlayClose();}}>
                  <Text style={styles.fieldExcText}>기타 분야</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.fieldRow}>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(자)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/carAccident.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>자동차</Text>
                </View>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(산)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/industrialAccident.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>산업재해</Text>
                </View>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(환)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/environment.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>환경</Text>
                </View>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(언)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/press.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>언론보도</Text>
                </View>
              </View>
              <View style={styles.fieldRow}>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(지)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/intellectualProperty.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>지식재산권</Text>
                </View>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(의)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/medical.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>의료</Text>
                </View>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(건)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/construction.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>건설</Text>
                </View>
                <View style={styles.fieldButtonContainer}>
                  <TouchableOpacity style={styles.fieldButton} onPress={() => {this.setState({field: "손해배상(국)"}); this.overlayClose();}}>
                    <Image style={styles.fieldImage} source={require("../assets/government.png")} />
                  </TouchableOpacity>
                  <Text style={styles.fieldText}>국가</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.fieldSelectCancel} onPress={() => this.overlayClose()}>
              <Text style={styles.fieldSelectCancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}
WritePettition.contextType = MyContext;

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
    marginVertical: "3%",
    overflow: "scroll",
    textAlignVertical: "top",
  },
  container: {
    flex: 1,
    marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
    backgroundColor: "#fff"
  },
  contentSubTitle: {
    fontSize: 18,
    fontFamily: "KPBRegular",
    marginTop: "5%",
    alignSelf: "center",
  },
  field: {
    fontFamily: "KPWDBold",
    fontSize: 18,
    marginLeft: "5%",
  },
  fieldButton: {
    width: 60,
    height: 60,
    backgroundColor: "#E7E7E7",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  fieldButtonContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  fieldContatiner: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: "3%",
  },
  fieldExcButton: {
    position: "absolute",
    top: 5,
    right: 5,
    width: "25%",
    height: "45%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.secondary
  },
  fieldExcText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "KPWDBold"
  },
  fieldRow: {
    flex: 5,
    backgroundColor: "#fff",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  fieldImage: {
    width: "60%",
    height: "60%"
  },
  fieldSelectCancel: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "6%",
    alignSelf: "center"
  },
  fieldSelectCancelText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "KPWDBold",
  },
  fieldSelectContainer: {
    height: "35%",
    width: "80%",
    backgroundColor: "#fff",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: "2%",
    paddingVertical: "3%"
  },
  fieldSelectHeader:
  {
    flex: 2,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center"
  },
  fieldSelectModal: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    justifyContent: "center",
  },
  fieldModalText: {
    fontSize: 20,
    fontFamily: "KPWDBold",
  },
  fieldText: {
    fontSize: 15,
    fontFamily: "KPWDBold",
    marginTop: 8
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
    fontSize: 12,
    fontFamily: "KPWDBold",
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
    backgroundColor: "#fff"
  },
  logoTitle: {
    fontSize: 20,
    fontFamily: "SCDream8",
  },
  menu: {
    width: 20,
    height: 20,
  },
  // person: {
  //   fontSize: 15,
  //   fontFamily: "KPBRegular",
  //   marginTop: "2%",
  // },
  // personal: {
  //   marginTop: 20,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  // },
  // personalInput: {
  //   backgroundColor: "#F6F6F6",
  //   borderRadius: 8,
  //   width: "80%",
  //   paddingLeft: "5%",
  //   margin: 0,
  // },
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
  picturePreviewContainer: {
    flex: 1,
  },
  picturePreview: {
    flex: 8,
  },
  picturePreviewUnderbar: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  pictureSubmit: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 5,
    width: "20%",
    alignItems: "center",
    paddingVertical: "0.5%",
    marginHorizontal: 20,
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
    marginVertical: "3%",
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

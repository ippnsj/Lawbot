import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  AsyncStorage,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  ToastAndroid
} from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";

import colors from "../config/colors";
import { MyContext } from '../../context.js';
import { TextInput } from "react-native-gesture-handler";

export default class MyPage extends Component {
  state = {
    fontsLoaded: false,
    token: '',
    categories: {}, 
    user: {},
    userInt: [],
    introModVisible: false,
    introduction: "",
  };

  

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
      KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
      KPWDLight: require("../assets/fonts/KPWDLight.ttf"),
      KPBLight: require("../assets/fonts/KoPubBatang-Light.ttf"),
      KPBBold: require("../assets/fonts/KoPubBatang-Bold.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  isFocused = () => {
    // this.scroll.scrollTo({x: 0, y: 0, animated: true});
    const ctx = this.context;
    this.setState({ introModVisible: false });

    if(ctx.token !== '' && this.state.token === ctx.token && ctx.favCategoryUpdated) {
        ctx.favCategoryUpdated = false;
        const { userInt } = this.state;
        for(var i = 0; i < this.state.userInt.length; i++) {
            userInt[i] = ctx.userInt[i];
        }
        this.setState({ userInt });
    }
}

  async componentDidMount() {
    this._loadFonts();
    this.props.navigation.addListener('focus', this.isFocused);
    this.scroll = React.createRef();

    const ctx = this.context;
    const { userInt } = this.state;

    await fetch(`${ctx.API_URL}/qna/category`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": ctx.token
        },
        }).then((res) => {
            return res.json();
        }).then((res) => {
            this.setState({categories: res});
        });

    await fetch(`${ctx.API_URL}/user`, {
      method: "GET",
      headers: {
          'token': ctx.token,
      },
    }).then((result) => {
      return result.json();
    }).then((result) => {
      this.setState({ token: ctx.token, user: result, introduction: result.introduction });
      for(var i = 0; i < this.state.categories.length; i++) {
          userInt[i] = -1;
      }
    });

    await fetch(`${ctx.API_URL}/user/interests`, {
        method: "GET",
        headers: {
            'token' : ctx.token,
        },
    }).then((result) => {
        return result.json();
    }).then((result) => {
        for(var i = 0; i < result.length; i++) {
            userInt[result[i].Category_ID] = 1;
        }
    });

    this.setState({ userInt });
  }

  async componentDidUpdate() {
    const ctx = this.context;
    const { userInt } = this.state;

    if(this.state.token != ctx.token && ctx.token != '') {
      await fetch(`${ctx.API_URL}/user`, {
        method: "GET",
        headers: {
            'token': ctx.token,
        },
      }).then((result) => {
        return result.json();
      }).then((result) => {
        this.setState({ token: ctx.token, user: result, introduction: result.introduction });
        for(var i = 0; i < this.state.categories.length; i++) {
            userInt[i] = -1;
        }
      });

      await fetch(`${ctx.API_URL}/user/interests`, {
        method: "GET",
        headers: {
            'token' : ctx.token,
        },
        }).then((result) => {
            return result.json();
        }).then((result) => {
            for(var i = 0; i < result.length; i++) {
                userInt[result[i].Category_ID] = 1;
            }
        });

        this.setState({ userInt });
    }
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.isFocused);
  }

  async logout() {
    await AsyncStorage.clear();
    const ctx = this.context;
    ctx.updateToken("");
    this.props.navigation.navigate("WelcomeScreen");
  }

  fieldActivate(idx) {
    const { userInt } = this.state;
    const ctx = this.context;
    var body = {};
    body.Category_ID = idx;

    if(userInt[idx]*-1 === -1) {
        fetch(`${ctx.API_URL}/user/interests`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'token' : ctx.token,
            },
            body: JSON.stringify(body),
            }).then((result) => {
                return result.json();
            }).then((result) => {
                ctx.favCategoryUpdated = true;
                userInt[idx] = userInt[idx]*-1;
                this.setState({
                    userInt,
                });
            }).then(() => {
                ctx.userInt = userInt;
            });
    }else if(userInt[idx]*-1 === 1) {
        fetch(`${ctx.API_URL}/user/interests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'token' : ctx.token,
            },
            body: JSON.stringify(body),
            }).then((result) => {
                return result.json();
            }).then((result) => {
                ctx.favCategoryUpdated = true;
                userInt[idx] = userInt[idx]*-1;
                this.setState({
                    userInt,
                });
            }).then(() => {
                ctx.userInt = userInt;
        });
    }
  }

  async choosePicture() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

    if(status !== "granted") {
        alert("사진첩 접근권한을 주어야 사진업로드가 가능합니다.");
        return;
    }

    let image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
    });

    if(!image.cancelled) {
        var localUri = image.uri;
        var filename = localUri.split('/').pop();
        var lastIndex = image.uri.lastIndexOf(".");
        var mimetype = image.uri.substr(lastIndex+1);
        image.name = filename;
        image.type = "image/" + mimetype;

        const ctx = this.context;
        let data = new FormData();
        data.append("temp", image);

        await fetch(`${ctx.API_URL}/user/profile/image`, {
            method: "PUT",
            body: data,
            headers: {
                // 'Content-Type': 'multipart/form-data',
                // 'Accept': 'application/json',
                'token': ctx.token,
            },
          }).then((result) => {
            return result.json();
          }).then((result) => {
            if(result.success) {
                this.setState(prevState => ({
                    user: {
                        ...prevState.user,
                        photo: `${result.uri}?random=${new Date()}`,
                    },
                }));
            }
        });
    }
  }

  modifyIntroduction() {
    const ctx = this.context;
    const body = {};
    body.introduction = this.state.introduction; 

    fetch(`${ctx.API_URL}/user/profile/introduction`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": ctx.token
        },
        body: JSON.stringify(body)
    }).then((res) => {
        return res.json();
    }).then((res) => {
        if(res.success) {
            ToastAndroid.show("소개글 수정에 성공하였습니다!", ToastAndroid.SHORT);
            const { user } = this.state;
            user.introduction = this.state.introduction;

            this.setState({ user });
            this.overlayClose();
        }else {
            ToastAndroid.show("소개글 수정에 실패하였습니다...", ToastAndroid.SHORT);
        }
    })
  }

  overlayClose() {
    this.setState({ introModVisible: false, introduction: this.state.user.introduction });
  }

//   goToLawyerHome() {
//     const ctx = this.context;
//     const answers = {};

//     fetch(`${ctx.API_URL}/lawyer/answer/${this.state.user.ID}`, {
//         method: "GET",
//         headers: {
//             'token': ctx.token,
//         },
//         }).then((res) => {
//             return res.json();
//         }).then((res) => {
//             answers = res;
//     });
//   }

  render() {
    if (!this.state.fontsLoaded) {
      return <View />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
            <View style={styles.userUpper}>
                <TouchableOpacity style={styles.leftArrowCont} onPress={() => this.props.navigation.goBack()}>
                    <Image source={require("../assets/leftArrow.png")} style={styles.leftArrowImage}/>
                </TouchableOpacity>
                <View style={styles.userNameCont}>
                    <Text style={styles.userName}>{this.state.user.name}</Text>
                    <Text style={styles.userNameWel}>님! 안녕하세요.</Text>
                </View>
            </View>
            <View style={styles.userLower}>
                <Text style={styles.updateProfile} onPress={() => this.props.navigation.navigate("ProfileMod", { user: this.state.user })}>비밀번호 변경</Text>
                <TouchableOpacity style={styles.logoutButtonCont} onPress={() => this.logout()}>
                    <Text style={styles.logoutButtonText}>로그아웃</Text>
                </TouchableOpacity>
                <ScrollView style={styles.introCont}>
                    <TouchableOpacity onPress={() => {this.setState({ introModVisible: true })}} style={{ height: 75 }}>
                        {this.state.user.introduction === null ? <Text style={styles.introText}>소개글이 없습니다.</Text> : <Text style={styles.introText}>{this.state.user.introduction}</Text>}
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.userImageCont} onPress={() => this.choosePicture()}>
                <Image source={{ uri: this.state.user.photo} } style={styles.userImage} />
            </TouchableOpacity>
        </View>
        <View style={styles.bar}></View>
        <View style={styles.interestCont}>
            <Text style={styles.subTitle}>내 관심분야</Text>
            <ScrollView ref={this.scroll}>
                <View style={styles.fieldRow}>
                    <View style = {this.state.userInt[0] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(0)}}>
                        <Image style={styles.fieldImage} source={require("../assets/carAccident.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>자동차</Text>
                    </View>
                    <View style = {this.state.userInt[1] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(1)}}>
                        <Image style={styles.fieldImage} source={require("../assets/industrialAccident.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>산업재해</Text>
                    </View>
                    <View style = {this.state.userInt[2] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(2)}}>
                        <Image style={styles.fieldImage} source={require("../assets/environment.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>환경</Text>
                    </View>
                    <View style = {this.state.userInt[3] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(3)}}>
                        <Image style={styles.fieldImage} source={require("../assets/press.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>언론보도</Text>
                    </View>
                </View>
                <View style={styles.fieldRow}>
                    <View style = {this.state.userInt[4] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(4)}}>
                        <Image style={styles.fieldImage} source={require("../assets/intellectualProperty.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>지식재산권</Text>
                    </View>
                    <View style = {this.state.userInt[5] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(5)}}>
                        <Image style={styles.fieldImage} source={require("../assets/medical.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>의료</Text>
                    </View>
                    <View style = {this.state.userInt[6] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(6)}}>
                        <Image style={styles.fieldImage} source={require("../assets/construction.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>건설</Text>
                    </View>
                    <View style = {this.state.userInt[7] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(7)}}>
                        <Image style={styles.fieldImage} source={require("../assets/government.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>국가</Text>
                    </View>
                </View>
                <View style={styles.fieldRow}>
                    <View style = {this.state.userInt[8] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(8)}}>
                        <Image style={styles.fieldImage} source={require("../assets/etc.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>기타</Text>
                    </View>
                    <View style = {this.state.userInt[9] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(9)}}>
                        <Image style={styles.fieldImage} source={require("../assets/family.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>가족/가정</Text>
                    </View>
                    <View style = {this.state.userInt[10] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(10)}}>
                        <Image style={styles.fieldImage} source={require("../assets/divorce.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>이혼</Text>
                    </View>
                    <View style = {this.state.userInt[11] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(11)}}>
                        <Image style={styles.fieldImage} source={require("../assets/violence.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>폭행</Text>
                    </View>
                </View>
                <View style={styles.fieldRow}>
                    <View style = {this.state.userInt[12] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(12)}}>
                        <Image style={styles.fieldImage} source={require("../assets/fraud.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>사기</Text>
                    </View>
                    <View style = {this.state.userInt[13] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(13)}}>
                        <Image style={styles.fieldImage} source={require("../assets/sexualAssault.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>성범죄</Text>
                    </View>
                    <View style = {this.state.userInt[14] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(14)}}>
                        <Image style={styles.fieldImage} source={require("../assets/libel.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>명예훼손</Text>
                    </View>
                    <View style = {this.state.userInt[15] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(15)}}>
                        <Image style={styles.fieldImage} source={require("../assets/insult.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>모욕</Text>
                    </View>
                </View>
                <View style={styles.fieldRow}>
                    <View style = {this.state.userInt[16] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(16)}}>
                        <Image style={styles.fieldImage} source={require("../assets/threat.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>협박</Text>
                    </View>
                    <View style = {this.state.userInt[17] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(17)}}>
                        <Image style={styles.fieldImage} source={require("../assets/carAcci.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>교통사고</Text>
                    </View>
                    <View style = {this.state.userInt[18] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(18)}}>
                        <Image style={styles.fieldImage} source={require("../assets/contract.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>계약</Text>
                    </View>
                    <View style = {this.state.userInt[19] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(19)}}>
                        <Image style={styles.fieldImage} source={require("../assets/personalInformation.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>개인정보</Text>
                    </View>
                </View>
                <View style={styles.fieldRow}>
                    <View style = {this.state.userInt[20] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(20)}}>
                        <Image style={styles.fieldImage} source={require("../assets/inheritance.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>상속</Text>
                    </View>
                    <View style = {this.state.userInt[21] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(21)}}>
                        <Image style={styles.fieldImage} source={require("../assets/burglary.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>재산범죄</Text>
                    </View>
                    <View style = {this.state.userInt[22] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(22)}}>
                        <Image style={styles.fieldImage} source={require("../assets/trading.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>매매</Text>
                    </View>
                    <View style = {this.state.userInt[23] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(23)}}>
                        <Image style={styles.fieldImage} source={require("../assets/labor.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>노동</Text>
                    </View>
                </View>
                <View style={styles.fieldRow}>
                    <View style = {this.state.userInt[24] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(24)}}>
                        <Image style={styles.fieldImage} source={require("../assets/debtCollection.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>채권추심</Text>
                    </View>
                    <View style = {this.state.userInt[25] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(25)}}>
                        <Image style={styles.fieldImage} source={require("../assets/bankruptcy.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>회생/파산</Text>
                    </View>
                    <View style = {this.state.userInt[26] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(26)}}>
                        <Image style={styles.fieldImage} source={require("../assets/drug.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>마약/대마</Text>
                    </View>
                    <View style = {this.state.userInt[27] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(27)}}>
                        <Image style={styles.fieldImage} source={require("../assets/consumer.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>소비자</Text>
                    </View>
                </View>
                <View style={styles.fieldRow}>
                    <View style = {this.state.userInt[28] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(28)}}>
                        <Image style={styles.fieldImage} source={require("../assets/millitary.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>국방/병역</Text>
                    </View>
                    <View style = {this.state.userInt[29] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(29)}}>
                        <Image style={styles.fieldImage} source={require("../assets/school.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>학교</Text>
                    </View>
                    <View style = {this.state.userInt[30] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(30)}}>
                        <Image style={styles.fieldImage} source={require("../assets/housebreaking.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>주거침입</Text>
                    </View>
                    <View style = {this.state.userInt[31] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(31)}}>
                        <Image style={styles.fieldImage} source={require("../assets/service.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>도급/용역</Text>
                    </View>
                </View>
                <View style={styles.fieldRow}>
                    <View style = {this.state.userInt[32] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(32)}}>
                        <Image style={styles.fieldImage} source={require("../assets/realEstate.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>건설/부동산</Text>
                    </View>
                    <View style = {this.state.userInt[33] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(33)}}>
                        <Image style={styles.fieldImage} source={require("../assets/falseWitness.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>위증</Text>
                    </View>
                    <View style = {this.state.userInt[34] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(34)}}>
                        <Image style={styles.fieldImage} source={require("../assets/falseAccusation.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>무고죄</Text>
                    </View>
                    <View style = {this.state.userInt[35] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(35)}}>
                        <Image style={styles.fieldImage} source={require("../assets/juvenile.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>아동/{"\n"}청소년범죄</Text>
                    </View>
                </View>
                <View style={styles.fieldRow}>
                    <View style = {this.state.userInt[36] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(36)}}>
                        <Image style={styles.fieldImage} source={require("../assets/lease.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>임대차</Text>
                    </View>
                    <View style = {this.state.userInt[37] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(37)}}>
                        <Image style={styles.fieldImage} source={require("../assets/loan.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>대여금</Text>
                    </View>
                    <View style = {this.state.userInt[38] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(38)}}>
                        <Image style={styles.fieldImage} source={require("../assets/online.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>온라인범죄</Text>
                    </View>
                    <View style = {this.state.userInt[39] === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(39)}}>
                        <Image style={styles.fieldImage} source={require("../assets/drunkDriving.png")} />
                        </TouchableOpacity>
                        <Text style={styles.fieldText}>음주운전</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
        <View style={styles.bar}></View>
        {this.state.user.lawyer === 0 ? 
        <View style={styles.lawyerInfoCont}>
            <Text style={styles.lawyerTitle}>변호사 이신가요?</Text>
            <Text style={styles.lawyerExplanation}>간단한 변호사 자격증 인증을 통해{"\n"}변호사 등급으로 변환할 수 있습니다.</Text>
            <TouchableOpacity style={styles.lawyerButton}>
                <Text style={styles.lawyerButtonText}>변호사 인증하러 가기</Text>
            </TouchableOpacity>
        </View>
                : 
        <View style={styles.lawyerInfoCont}>
            <Text style={styles.lawyerTitle}>변호사님! 도와주세요.</Text>
            <Text style={styles.lawyerExplanation}>변호사 홈으로 이동하여{"\n"}도움이 필요한 분들을 도와주세요.</Text> 
            <TouchableOpacity style={styles.lawyerButton} onPress={() => this.goToLawyerHome()}>
                <Text style={styles.lawyerButtonText}>변호사 홈페이지 가기</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.lawyerButton}>
                <Text style={styles.lawyerButtonText}>변호사 정보 수정</Text>
            </TouchableOpacity> */}
        </View> }
        <Modal visible={this.state.introModVisible} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
            <View style={styles.introModModal}>
                <KeyboardAvoidingView style={styles.introModContainer}>
                    <View style={styles.introModHeader}>
                        <Text style={styles.introModModalText}>소개글 수정</Text>
                    </View>
                    <ScrollView style={styles.introModCont}>
                        <TextInput 
                            placeholder="소개글을 입력하세요."
                            style={styles.intro}
                            value={this.state.user.introduction !== "" ? this.state.introduction : null}
                            onChangeText={(introduction)=>this.setState({ introduction })}
                            multiline
                            textAlignVertical={"top"}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
                <View style={styles.buttonCont}>
                    <TouchableOpacity style={styles.introModSubmit} onPress={() => this.modifyIntroduction()}>
                        <Text style={styles.introModSubmitText}>수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.introModCancel} onPress={() => this.overlayClose()}>
                        <Text style={styles.introModCancelText}>취소</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
      </View>
    );
  }
}
MyPage.contextType = MyContext;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Platform.OS === `ios` ? 1 : Constants.statusBarHeight,
      backgroundColor: "#fff",
    },

    bar: {
        width: "100%",
        height: 8,
        backgroundColor: "#ECECEC"
    },

    userContainer: {
        height: "35%",
        position: "relative",
    },
    userUpper: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    leftArrowCont: {
        marginTop: 20,
        marginLeft: 20,
    },
    leftArrowImage: {
        width: 30,
        height: 30,
    },
    userNameCont: {
        flexDirection: "row",
        position: "absolute",
        bottom: 10,
        left : "33%",
    },
    userName: {
        color: "#fff",
        fontFamily: "KPWDBold",
        alignSelf: "flex-end",
        fontSize: 28,
    },
    userNameWel: {
        fontFamily: "KPWDBold",
        fontSize: 15,
        alignSelf: "center",
        marginLeft: 10,
        color: "#fff"
    },

    userLower: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
    },
    updateProfile: {
        color: "#8D8D8D",
        fontFamily : "KPWDMedium",
        fontSize : 12,
        marginRight: 142
    },
    logoutButtonCont: {
        backgroundColor: "#000",
        alignSelf: "flex-start",
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 15,
        marginRight: 20
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 10,
        fontFamily: "KPWDMedium",
    },
    introCont: {
        position: "absolute",
        top: 30,
        left: 0,
        width: "100%",
        height: "60%",
        marginTop: 10,
        paddingHorizontal: 30,
    },
    introText: {
        fontSize: 14,
        color: "#898989",
        fontFamily: "KPWDLight",
    },

    userImageCont: {
        position: "absolute",
        top: "25%",
        left: "5%",
        width: 110,
        height: 110,
        borderRadius: 55,
        justifyContent: "center",
        alignItems: "center"
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    interestCont: {
        height: "40%",
        paddingBottom: 15,
    },
    subTitle: {
        fontSize: 16,
        fontFamily: "KPWDBold",
        marginTop: 15,
        marginLeft: "5%"
    },
    fieldRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 15,
        marginTop: 10,
    },
    fieldButtonContainerNonActive: {
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.3,
    },
    fieldButtonContainerActive: {
        justifyContent: "center",
        alignItems: "center",
    },
    fieldButton: {
        width: 60,
        height: 60,
        backgroundColor: "#f6f6f6",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    fieldText: {
        fontSize: 15,
        fontFamily: "KPWDBold",
        marginTop: 8,
        textAlign: "center"
    },
    fieldImage: {
        width: "60%",
        height: "60%"
    },

    lawyerInfoCont: {
        alignItems: "center",
    },
    lawyerTitle: {
        fontFamily: "KPBBold",
        fontSize: 20,
        marginTop: 30,
    },
    lawyerExplanation: {
        marginTop: 15,
        width: 200,
        fontFamily: "KPBLight",
        fontSize: 12,
        textAlign: "center",
    },
    lawyerButton: {
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 5,
        width: "80%",
        marginVertical: "5%",
        alignItems: "center",
        paddingVertical: "0.5%",    
    },
    lawyerButtonText: {
        fontSize: 18,
        color: colors.primary,
        fontFamily: "KPWDBold",
    },

    introModModal: {
        flex: 1,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        justifyContent: "center",
    },
    introModContainer: {
        height: 260,
        width: "80%",
        backgroundColor: "#fff",
        alignItems: "center",
        alignSelf: "center",
        paddingHorizontal: "2%",
        paddingVertical: "3%"
    },
    introModModalText: {
        fontSize: 20,
        fontFamily: "KPWDBold",
    },
    introModCont: {
        width: "100%",
        marginTop: 10,
    },
    intro: {
        minHeight: 190,
        fontFamily: "KPWDLight",
        fontSize: 15,
        paddingHorizontal: 10,
    },
    introModSubmit: {
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: "50%",
        height: "100%",
    },
    introModSubmitText: {
        color: "#fff",
        fontSize: 15,
        fontFamily: "KPWDBold",
    },
    introModCancel: {
        backgroundColor: "lightgray",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        width: "50%",
        height: "100%",
    },
    introModCancelText: {
        color: "#fff",
        fontSize: 15,
        fontFamily: "KPWDBold",
    },
    buttonCont: {
        flexDirection: "row",
        height: 50,
        width: "80%",
        alignSelf:"center",
    }
});

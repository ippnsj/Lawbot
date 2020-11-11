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
  ImageBackground,
  Modal,
  Platform,
  ToastAndroid,
  Alert,
  Keyboard
} from "react-native";
import {vw, vh, vmin, vmax} from 'react-native-expo-viewport-units';
import * as Font from "expo-font";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import { MyContext } from "../../context.js";

import colors from "../config/colors";
import Header from "./Header.js";
import { DrawerContentScrollView } from "@react-navigation/drawer";




const categories=[
    "자동차",  "산업재해",  "환경", "언론보도", "지식재산권", "의료", "건설", "국가", "기타", "가족/가정", "이혼", "폭행", "사기", "성범죄", "명예훼손", "모욕", "협박", "교통사고", "계약", "개인정보", "상속", "재산범죄", "매매", "노동", "채권추심", "회생/파산", "마약/대마", "소비자", "국방", "병역", "주거침입", "도급/용역", "건설/부동산", "위증", "무고죄", "아동/소년범죄", "임대차", "대여금", "온라인범죄","음주운전"   
]

const catImgList=[
    require("../assets/carAccident.png"), require("../assets/industrialAccident.png"), require("../assets/environment.png"),require("../assets/press.png"), require("../assets/intellectualProperty.png"),  require("../assets/medical.png"), require("../assets/construction.png"),require("../assets/government.png"), require("../assets/etc.png"), require("../assets/family.png"), require("../assets/divorce.png"), require("../assets/violence.png"), require("../assets/fraud.png"),require("../assets/sexualAssault.png"),  require("../assets/libel.png"), require("../assets/insult.png"), require("../assets/threat.png"), require("../assets/carAcci.png"), require("../assets/contract.png"), require("../assets/personalInformation.png"), require("../assets/inheritance.png"), require("../assets/burglary.png"),  require("../assets/trading.png"), require("../assets/labor.png"), require("../assets/debtCollection.png"), require("../assets/bankruptcy.png"), require("../assets/drug.png"), require("../assets/consumer.png"), require("../assets/millitary.png"), require("../assets/school.png"),require("../assets/housebreaking.png"),  require("../assets/service.png"), require("../assets/realEstate.png"), require("../assets/falseWitness.png"), require("../assets/falseAccusation.png"),require("../assets/juvenile.png"), require("../assets/lease.png"), require("../assets/loan.png"), require("../assets/online.png"), require("../assets/drunkDriving.png")
]



const empty="     ";


export default class LawyerModify extends Component {
    constructor(props) {
        super(props);
        this.state = {
          fontsLoaded: false,
          fields: "",
          token:"",
          info: true,
          id: this.props.route.params.id,
          lawyer: this.props.route.params.lawyer,
          companyName:"",
          intro:"",
          address:"",
            userInt: [],
            companyModify:false,
            addressModify:false,
            introModify:false,
            qualificationAdd:false,
            careerAdd:false,
            eduAdd:false,
            career:{
                startYear:"",
                endYear:"",
                detail:"",
            },
            qualification:{
                startYear:"",
                endYear:"",
                detail:"",
            },
            education:{
                startYear:"",
                endYear:"",
                detail:"",
            },
        };
    }
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //       fontsLoaded: false,
    //       fields: "",
    //       token:"",
    //       info: true,
    //       id: 1,
    //       companyName:"",
    //       intro:"",
    //       address:"",
    //     userInt: [],
    //     companyModify:false,
    //     addressModify:false,
    //     introModify:false,
    //     careerAdd:false,
    //     eduAdd:false,
    //     career:{
    //         startYear:"",
    //         endYear:"",
    //         detail:"",
    //     },
    //     education:{
    //         startYear:"",
    //         endYear:"",
    //         detail:"",
    //     },

    //       lawyer: {
    //         Careers:  [
    //             {
    //             Lawyer_ID: 1,
    //             detail: "풀씨 법무법인",
    //             endYear: null,
    //             startYear: 2020,
    //             },
    //         ],
    //         Education:  [
    //             {
    //             Lawyer_ID: 1,
    //             detail: "연세대학교 로스쿨",
    //             endYear: 2020,
    //             startYear: 2017,
    //             },
    //             {
    //             Lawyer_ID: 1,
    //             detail: "연세대학교 법과대학",
    //             endYear: 2017,
    //             startYear: 2013,
    //             },
    //         ],
    //         ID: 1,
    //         LawyerFields: [
    //             {
    //             Category_ID: 4,
    //             Lawyer_ID: 1,
    //             },
    //         ],
    //         User:  {
    //             ID: 1,
    //             birth: "1997-07-02",
    //             email: "yoonsukch@gmail.com",
    //             gender: 0,
    //             introduction: "안녕하세요",
    //             lawyer: 1,
    //             name: "정윤석",
    //             phone: "010-2676-3034",
    //             photo: "https://api.lawbotc.kr/files/users/1.jpg",
    //             userID: "yoonseokch",
    //             userPW: "11111111",
    //         },
    //         address1: null,
    //         address2: null,
    //         companyName: "김앤장 법률사무소",
    //         companyPhone: null,
    //         introduction: "안녕하세요",
    //         }
    //     };
    

  async _loadFonts() {
    await Font.loadAsync({
      SCDream8: require("../assets/fonts/SCDream8.otf"),
      KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
      KPBRegular: require("../assets/fonts/KoPubBatang-Regular.ttf"),
      KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
      KPBBold: require("../assets/fonts/KoPubBatang-Bold.ttf"),
      KPBLight: require("../assets/fonts/KoPubBatang-Light.ttf"),
      KPBRegular: require("../assets/fonts/KoPubBatang-Regular.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  isFocused = () => {
    this.setState({id: this.props.route.params.id, lawyer: this.props.route.params.lawyer });
    
    // const ctx = this.context;
    
    // // this.setState({ introModVisible: false });

    // if(ctx.token !== '' && this.state.token === ctx.token) {
    //     fetch(`${ctx.API_URL}/lawyer/${this.props.route.params.id}`, {
    //         method: "GET",
    //         headers: {
    //             // 'Content-Type': 'multipart/form-data',
    //             // 'Accept': 'application/json',
    //             'token': ctx.token,
    //         },
    //         }).then((result) => {
    //         return result.json();
    //         }).then((result) => {
    //         this.setState({ token: ctx.token, lawyer: result[0] });
    //         console.log("아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅄㅄㅄㅄㅄ");
    //         console.log(this.state.lawyer.User.name)
    //     });
        
        // ctx.favCategoryUpdated = false;
        // const { userInt } = this.state;
        // for(var i = 0; i < this.state.userInt.length; i++) {
        //     userInt[i] = ctx.userInt[i];
        // }
        // this.setState({ userInt });
    // }
}

  componentDidMount() {
    this._loadFonts();
    console.log("ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ")
    this.props.navigation.addListener('focus', this.isFocused);
    this.setState({id: this.props.route.params.id, lawyer: this.props.route.params.lawyer});
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.isFocused);
  }

  overlayClose() {
      this.setState({introModify:false, companyModify:false, qualificationAdd:false, addressModify:false, careerAdd: false, eduAdd:false})
  }


//   async componentDidUpdate() {
//     const ctx = this.context;
//     if(ctx.token !== '' && this.state.token === ctx.token) {
//         await fetch(`${ctx.API_URL}/lawyer/${this.props.route.params.id}`, {
//             method: "GET",
//             headers: {
//                 // 'Content-Type': 'multipart/form-data',
//                 // 'Accept': 'application/json',
//                 'token': ctx.token,
//             },
//             }).then((result) => {
//             return result.json();
//             }).then((result) => {
//             this.setState({ token: ctx.token, lawyer: result[0] });
//             console.log("아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅄㅄㅄㅄㅄ");
//             console.log(this.state.lawyer.User.name)
//         });
//     // this.getCategory();
//     // this.setState({lawyer: this.props.route.params.lawyer, answers: this.props.route.params.answers});
//   }
// }

//   async componentDidUpdate() {
//     const ctx = this.context;
//     if(this.state.token != ctx.token && ctx.token != '') {
//       await fetch(`${ctx.API_URL}/lawyer/1`, {
//         method: "GET",
//         headers: {
//             // 'Content-Type': 'multipart/form-data',
//             // 'Accept': 'application/json',
//             'token': ctx.token,
//         },
//       }).then((result) => {
//         return result.json();
//       }).then((result) => {
//         this.setState({ token: ctx.token, lawyer: result[0] });
//         console.log(this.state.lawyer.User.name)
//       });
//     }
//   }



    async handleTabs(which) {
        if (which==="home") {
            this.setState({home:true, info:false, qa: false})
            // this.getLawyerInfo();
            
        } else if (which==="info") {
            this.setState({home:false, info:true, qa: false})
            // this.getCategory();

        } else {
            // this.getQA();
            this.setState({home:false, info:false, qa: true})
        }
    }

    introOverlayClose(){
        this.setState({introModify:false});
        const ctx = this.context;
        const body = {};
        body.introduction = this.state.intro; 

        console.log("changing introduction");
        fetch(`${ctx.API_URL}/user/profile/lawyer/introduction`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                'token': ctx.token,
            },
        }
        ).then((result) => {
            console.log("wtfwtf!@#$1242341234123413")
            // console.log(result.json())
            return result.json();
        }).then((result) => {
            if(result.success) {
                console.log("succedd!!!!!!!!");

                ToastAndroid.show("소개글 수정에 성공하였습니다!", ToastAndroid.SHORT);
                const { lawyer } = this.state;
                lawyer.introduction = this.state.intro;
                this.setState({ lawyer });
            }else {
                console.log("failed!!!!!!!!!!!!!!!!!!!!!!!!!!");
                ToastAndroid.show("소개글 수정에 실패하였습니다...", ToastAndroid.SHORT);
            }
            // console.log(result);
            // this.setState({ token: ctx.token, user: result });
        });
    }

    companyOverlayClose(){
        this.setState({companyModify:false});
        const ctx = this.context;
        const body = {};
        body.companyName = this.state.companyName; 

        console.log("changing companyName");
        fetch(`${ctx.API_URL}/user/profile/lawyer/companyname`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                'token': ctx.token,
            },
        }
        ).then((result) => {
            console.log("wtfwtf!@#$1242341234123413")
            return result.json();
        }).then((result) => {
            if(result.success) {
                console.log("succedd!!!!!!!!");

                ToastAndroid.show("소개글 수정에 성공하였습니다!", ToastAndroid.SHORT);
                const { lawyer } = this.state;
                lawyer.companyName = this.state.companyName;
                this.setState({ lawyer });
            }else {
                console.log("failed!!!!!!!!!!!!!!!!!!!!!!!!!!");
                ToastAndroid.show("소개글 수정에 실패하였습니다...", ToastAndroid.SHORT);
            }
            // console.log(result);
            // this.setState({ token: ctx.token, user: result });
        });
    }

    addressOverlayClose(){
        this.setState({addressModify:false});
        const ctx = this.context;
        const body = {};
        body.address = this.state.address; 

        console.log("changing address");
        fetch(`${ctx.API_URL}/user/profile/lawyer/address`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                'token': ctx.token,
            },
        }
        ).then((result) => {
            console.log("wtfwtf!@#$1242341234123413")
            return result.json();
        }).then((result) => {
            if(result.success) {
                console.log("succedd!!!!!!!!");

                ToastAndroid.show("소개글 수정에 성공하였습니다!", ToastAndroid.SHORT);
                const { lawyer } = this.state;
                lawyer.address1 = this.state.address;
                this.setState({ lawyer });
            }else {
                console.log("failed!!!!!!!!!!!!!!!!!!!!!!!!!!");
                ToastAndroid.show("소개글 수정에 실패하였습니다...", ToastAndroid.SHORT);
            }
            // console.log(result);
            // this.setState({ token: ctx.token, user: result });
        });
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

      async test() {
        console.log("hi");
        const ctx = this.context;
        var newLawyer;
        await fetch(`${ctx.API_URL}/lawyer/${this.state.id}`, {
            method: "GET",
            headers: {
                'token': ctx.token,
            },
          }
          ).then((result) => {
            return result.json();
          }).then((result) => {
              // console.log("999999999999999");
              // console.log(result);
                newLawyer=result[0];
                // console.log(newLawyer);
        });
        console.log(newLawyer);
      }

      careerDelete() {
        const ctx = this.context;
        const body = {};
        body.address = this.state.address; 

        console.log("changing career");
        fetch(`${ctx.API_URL}/user/profile/lawyer/introduction`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                'token': ctx.token,
            },
        }
        ).then((result) => {
            console.log("wtfwtf!@#$1242341234123413")
            return result.json();
        }).then((result) => {
            if(result.success) {
                console.log("succedd!!!!!!!!");

                ToastAndroid.show("소개글 수정에 성공하였습니다!", ToastAndroid.SHORT);
                const { lawyer } = this.state;
                lawyer.address1 = this.state.address;
                this.setState({ lawyer });
            }else {
                console.log("failed!!!!!!!!!!!!!!!!!!!!!!!!!!");
                ToastAndroid.show("소개글 수정에 실패하였습니다...", ToastAndroid.SHORT);
            }
            // console.log(result);
            // this.setState({ token: ctx.token, user: result });
        });
      }


      async careerOverlayClose() {
        this.setState({careerAdd:false})
        const ctx = this.context;
        let body = {
          endYear: "",
          startYear:"",
          detail:"",
        //   Lawyer_ID:this.state.lawyer.ID,
        };

        body.endYear=this.state.career.endYear;
        body.startYear=this.state.career.startYear;
        body.detail=this.state.career.detail;
        console.log("22222222222222222222")
        // console.log(body)

        await fetch(`${ctx.API_URL}/user/profile/lawyer/career`, {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "token": ctx.token
            },
            body: JSON.stringify(body),
          }).then((res) => {
            return res.json();
          }).then((res) => {
              console.log("89888888888888888888888")
              if(res.success) {
                console.log("답변 등록 성공~~~~~~~~")
                const {lawyer}=this.state;
                lawyer.Careers.push(this.state.career);
                this.setState({lawyer})
                console.log(this.state.lawyer)
                ToastAndroid.show("답변 등록에 성공하였습니다!", ToastAndroid.SHORT);
            }else {
                console.log("실패!!!!!!!!!!!!!!!!!!!!!!!!")
                ToastAndroid.show("답변 등록에 실패하였습니다...", ToastAndroid.SHORT);
            }
          });
      }

      careerAdd() {
        this.setState({careerAdd:true})
      }

 

  render() {
    if (!this.state.fontsLoaded) {
      return <View />;
    }

    return (
      <View style={styles.container}>
        <Header {...this.props}/>
        <ScrollView style={styles.body} nestedScrollEnabled = {true}>
            <Text style={{margin:"5%", fontFamily:"KPWDBold", fontSize:20, }}>변호사 정보 수정</Text> 

                <View style={{marginHorizontal:"5%"}}>
                    <TouchableOpacity onPress={()=>this.test()}>
                        <Text>변화 확인</Text>
                    </TouchableOpacity>
                    <Text style={styles.info_subtitle}>기본 정보</Text>
                    <View style={{marginTop:"3%"}}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.basic_subtitle}>이름</Text>
                            <Text style={styles.basic_content}>{this.state.lawyer.User.name} 변호사</Text>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.basic_subtitle}>소속</Text>
                            <Text  style={styles.basic_content} >{this.state.lawyer.companyName!=null? this.state.lawyer.companyName : "등록 된 소속 사무소가 없습니다."}</Text>
                            <TouchableOpacity onPress={()=>this.setState({companyModify:true})}>
                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", fontSize:11}}>수정</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.basic_subtitle}>소개</Text>
                            <Text  style={styles.basic_content} >{this.state.lawyer.introduction!=null? this.state.lawyer.introduction : "등록 된 소개 말이 없습니다."}</Text>
                            <TouchableOpacity onPress={()=>this.setState({introModify:true})}>
                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", fontSize:11}}>수정</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.basic_subtitle}>주소</Text>
                            <Text style={styles.basic_content} >{this.state.lawyer.address1!=null ? this.state.lawyer.address1 : "등록 된 주소가 없습니다."}</Text>
                            <TouchableOpacity onPress={()=>this.setState({addressModify:true})}>
                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", fontSize:11}}>수정</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </View>

                
                <View style={styles.thinUnderline}/>

                <View style={{marginHorizontal:"5%"}}>
                    <Text style={styles.info_subtitle}>주요분야</Text>
                   

                    <View style={{height:300}}>

                        <ScrollView nestedScrollEnabled = {true}>
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

                    {/* <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{flexDirection: "row"}}>
                        {this.state.lawyer.LawyerFields.map((f, idx)=> {
                            return(
                                <View style={{alignItems: 'center', marginRight:40, marginTop: 10}}>
                                    <Image style={styles.info_field_img} source={catImgList[f.Category_ID]}/>
                                    <Text style={styles.info_field_text}>{categories[f.Category_ID]}</Text>
                                </View>
                            )
                        })}
                        <Text>수정</Text>
                    </ScrollView> */}
                </View>

                <View style={styles.thinUnderline}/>


                <View style={{marginHorizontal:"5%"}}>
                    <Text style={styles.info_subtitle}>이력사항</Text>
                    <View style={{margin:"3%"}}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.info_career_subtitle}>경력</Text>
                            
                        </View>
                        <View style={{borderLeftColor:"#9C9A9A", borderLeftWidth: 1.5, margin: "3%", paddingHorizontal:"5%"}}>
                                {this.state.lawyer.Careers && this.state.lawyer.Careers.length ? this.state.lawyer.Careers.map((c)=>{
                                    return(
                                        <View style={{flexDirection:"row"}}>
                                            <Text style={styles.info_career_text1}>{c.startYear} ~ {c.endYear===null ? empty : c.endYear}</Text>
                                            <Text numberOfLines={1}  style={styles.info_career_text2}>  -  {c.detail}</Text>   
                                            <TouchableOpacity onPress={()=>this.careerDelete()}>
                                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center",fontSize:11}}>삭제</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }) : <Text>경력사항 없음</Text>}
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{width:"92%"}}> </Text>
                            <TouchableOpacity onPress={()=>this.careerAdd()}>
                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center", fontSize:11}}>추가</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={{margin:"3%"}}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.info_career_subtitle}>자격</Text>
                            
                        </View>
                        <View style={{borderLeftColor:"#9C9A9A", borderLeftWidth: 1.5, margin: "3%", paddingHorizontal:"5%"}}>
                                {this.state.lawyer.Qualifications && this.state.lawyer.Qualifications.length ? this.state.lawyer.Qualifications.map((c)=>{
                                    return(
                                        <View style={{flexDirection:"row"}}>
                                            <Text style={styles.info_career_text1}>{c.startYear} ~ {c.endYear===null ? empty : c.endYear}</Text>
                                            <Text numberOfLines={1}  style={styles.info_career_text2}>  -  {c.detail}</Text>   
                                            <TouchableOpacity onPress={()=>this.careerDelete()}>
                                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center",fontSize:11}}>삭제</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }) : <Text>자격사항 없음</Text>}
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{width:"92%"}}> </Text>
                            <TouchableOpacity onPress={()=>this.careerAdd()}>
                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center", fontSize:11}}>추가</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* <View style={{margin:"3%"}}>
                        <Text style={styles.info_career_subtitle}>자격</Text>
                        <View style={{borderLeftColor:"#9C9A9A", borderLeftWidth: 1.5, margin: "3%", paddingHorizontal:"5%"}}>
                                {qualification.map((c)=>{
                                    return(
                                        <View style={{flexDirection:"row"}}>
                                            <Text style={styles.info_career_text1}>{c.periodstart} ~ {c.periodend==="" ? empty : c.periodend}</Text>
                                            <Text numberOfLines={1}  style={styles.info_career_text2}>  -  {c.name}</Text>   
                                            <TouchableOpacity>
                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", fontSize:11}}>수정</Text>
                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                        </View>
                    </View> */}
                    <View style={{margin:"3%"}}>
                        <Text style={styles.info_career_subtitle}>학력</Text>
                        <View style={{borderLeftColor:"#9C9A9A", borderLeftWidth: 1.5, margin: "3%", paddingHorizontal:"5%"}}>
                                {this.state.lawyer.Education && this.state.lawyer.Education.length ? this.state.lawyer.Education.map((c)=>{
                                    return(
                                        <View style={{flexDirection:"row"}}>
                                            <Text style={styles.info_career_text1}>{c.startYear} ~ {c.endYear===null ? empty : c.endYear}</Text>
                                            <Text numberOfLines={1} style={styles.info_career_text2}>  -  {c.detail}</Text>   
                                            <TouchableOpacity>
                                                <Text style={{color:colors.primary, fontFamily:"KPWDBold",alignSelf:"center", fontSize:11}}>삭제</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }) : <Text>학력사항 없음</Text>}
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{width:"92%"}}> </Text>
                            <TouchableOpacity onPress={()=>this.eduAdd()}>
                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center", fontSize:11}}>추가</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </View>
                <View style={styles.thinUnderline}/>
                

                <View>
                    <Text style={styles.info_subtitle}>활동사항</Text>
                    <View style={{margin:"10%"}}></View>
                </View>
                <View style={styles.thinUnderline}/>

                <View style={styles.moreButton}>
                    <TouchableOpacity>
                        <View style={{flexDirection: "row", marginBottom:"5%"}}>
                            <Text style={styles.moreButton_text}>변호사 정보 수정 완료</Text>
                            <Image  source={require("../assets/lawyerMoreButton.png")} />
                        </View>
                    </TouchableOpacity>
                </View>


                
        {/* introduction modify */}
            <Modal visible={this.state.introModify} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                <View  style={styles.fieldSelectModal}>
                    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset= {-200} style={styles.fieldSelectContainer}>
                        <Text style={{fontFamily:"KPWDBold", fontSize:20, marginBottom:"5%"}}>소개말 수정</Text>
                            <TextInput
                                placeholder="나를 소개하는 말을 입력하세요."
                                style={styles.textInputForId}
                                onChangeText={(intro) => {this.setState({ intro }); }}
                                value={this.state.intro}
                                maxLength={45}
                            />
                            <View style={{flexDirection:"row", marginTop:"10%", backgroundColor:"white", justifyContent:"space-between"}}>
                                <View  style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>overlayClose()}>
                                        <Text style={styles.modalText}>취소</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>this.introOverlayClose()}>
                                        <Text style={styles.modalText}>확인</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>                     
                    </KeyboardAvoidingView >
                </View >
           </Modal>


        {/* company modify */}
            <Modal visible={this.state.companyModify} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                <View style={styles.fieldSelectModal}>
                    <View style={styles.fieldSelectContainer}>
                        <Text style={{fontFamily:"KPWDBold", fontSize:20, marginBottom:"5%"}}>소속 정보 수정</Text>
                        {/* <View style={styles.textInputContainer}> */}
                            <TextInput
                                placeholder="소속 사무소를 입력하세요."
                                style={styles.textInputForId}
                                onChangeText={(companyName) => {this.setState({ companyName }); }}
                                value={this.state.companyName}
                                maxLength={45}
                            />
                        {/* </View> */}
                            <View style={{flexDirection:"row", marginTop:"10%", justifyContent:"space-between"}}>
                                <View  style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>overlayClose()}>
                                        <Text style={styles.modalText}>취소</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>this.companyOverlayClose()}>
                                        <Text style={styles.modalText}>확인</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>                     
                    </View>
                </View>
           </Modal>

           {/* address modify */}
           <Modal visible={this.state.addressModify} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                <View style={styles.fieldSelectModal}>
                    <View style={styles.fieldSelectContainer}>
                        <Text style={{fontFamily:"KPWDBold", fontSize:20, marginBottom:"5%"}}>주소 수정</Text>
                        {/* <View style={styles.textInputContainer}> */}
                            <TextInput
                                placeholder="주소를 입력하세요."
                                style={styles.textInputForId}
                                onChangeText={(address) => {this.setState({ address }); }}
                                value={this.state.address}
                                maxLength={100}
                            />
                        {/* </View> */}
                            <View style={{flexDirection:"row", marginTop:"10%", justifyContent:"space-between"}}>
                                <View  style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>overlayClose()}>
                                        <Text style={styles.modalText}>취소</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>this.addressOverlayClose()}>
                                        <Text style={styles.modalText}>확인</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>                     
                    </View>
                </View>
           </Modal>

           {/* career modify */}
           <Modal visible={this.state.careerAdd} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                <View style={styles.fieldSelectModal}>
                    <View style={styles.fieldSelectContainerCareer}>
                        <Text style={{fontFamily:"KPWDBold", fontSize:20, marginBottom:"5%"}}>경력 추가</Text>
                        <View style={{flexDirection:"row", marginBottom:"5%"}}>
                            {/* <View style={{flexDirection:"row"}}> */}
                                <Text style={styles.textInputSubtitle}>시작</Text>
                                    <TextInput
                                        placeholder="2020"
                                        style={styles.textInputForYear}
                                        onChangeText={(startYear) => { const {career} =this.state; career.startYear=startYear; this.setState({career}); }}
                                        value={this.state.career.startYear}
                                        maxLength={45}
                                    />
                            {/* </View> */}

                            {/* <View style={{flexDirection:"row"}}> */}
                                <Text style={styles.textInputSubtitle}>끝</Text>
                                    <TextInput
                                            placeholder="2020"
                                            style={styles.textInputForYear}
                                            onChangeText={(endYear) => { const {career} =this.state; career.endYear=endYear; this.setState({career}); }}
                                            value={this.state.career.endYear}
                                            maxLength={45}
                                        />
                            {/* </View> */}
                        </View>
                        {/* <View style={styles.textInputContainer}> */}
                            <TextInput
                                placeholder="경력 사항을 입력하세요."
                                style={styles.textInputForId}
                                onChangeText={(detail) => { const {career} =this.state; career.detail=detail; this.setState({career}); }}
                                value={this.state.career.detail}
                                maxLength={45}
                            />
                        {/* </View> */}
                            <View style={{flexDirection:"row", marginTop:"10%", justifyContent:"space-between"}}>
                                <View  style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>overlayClose()}>
                                        <Text style={styles.modalText}>취소</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>this.careerOverlayClose()}>
                                        <Text style={styles.modalText}>확인</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>                     
                    </View>
                </View>
           </Modal>


             {/* education modify */}
             <Modal visible={this.state.eduAdd} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                <View style={styles.fieldSelectModal}>
                    <View style={styles.fieldSelectContainerCareer}>
                        <Text style={{fontFamily:"KPWDBold", fontSize:20, marginBottom:"5%"}}>학력 추가</Text>
                        <View style={{flexDirection:"row", marginBottom:"5%"}}>
                            {/* <View style={{flexDirection:"row"}}> */}
                                <Text style={styles.textInputSubtitle}>시작</Text>
                                    <TextInput
                                            placeholder="2020"
                                            style={styles.textInputForYear}
                                            onChangeText={(startYear) => { const {education} =this.state; education.startYear=startYear; this.setState({education}); }}
                                            value={this.state.education.startYear}
                                            maxLength={45}
                                        />
                            {/* </View> */}

                            {/* <View style={{flexDirection:"row"}}> */}
                                <Text style={styles.textInputSubtitle}>끝</Text>
                                    <TextInput
                                            placeholder="2020"
                                            style={styles.textInputForYear}
                                            onChangeText={(endYear) => { const {education} =this.state; education.endYear=endYear; this.setState({education}); }}
                                            value={this.state.education.endYear}
                                            maxLength={45}
                                        />
                            {/* </View> */}
                        </View>
                        {/* <View style={styles.textInputContainer}> */}
                            <TextInput
                                placeholder="학력 내용을 입력하세요."
                                style={styles.textInputForId}
                                onChangeText={(detail) => { const {education} =this.state; education.detail=detail; this.setState({education}); }}
                                value={this.state.education.detail}
                                maxLength={45}
                            />
                        {/* </View> */}
                            <View style={{flexDirection:"row", marginTop:"10%", justifyContent:"space-between"}}>
                                <View  style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>overlayClose()}>
                                        <Text style={styles.modalText}>취소</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>this.eduOverlayClose()}>
                                        <Text style={styles.modalText}>확인</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>                     
                    </View>
                </View>
           </Modal>


             {/* qualification modify */}
             <Modal visible={this.state.qualificationAdd} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                <View style={styles.fieldSelectModal}>
                    <View style={styles.fieldSelectContainerCareer}>
                        <Text style={{fontFamily:"KPWDBold", fontSize:20, marginBottom:"5%"}}>자격 추가</Text>
                        <View style={{flexDirection:"row", marginBottom:"5%"}}>
                            {/* <View style={{flexDirection:"row"}}> */}
                                <Text style={styles.textInputSubtitle}>시작</Text>
                                    <TextInput
                                            placeholder="2020"
                                            style={styles.textInputForYear}
                                            onChangeText={(startYear) => { const {qualification} =this.state; qualification.startYear=startYear; this.setState({qualification}); }}
                                            value={this.state.qualification.startYear}
                                            maxLength={45}
                                        />
                            {/* </View> */}

                            {/* <View style={{flexDirection:"row"}}> */}
                                <Text style={styles.textInputSubtitle}>끝</Text>
                                    <TextInput
                                            placeholder="2020"
                                            style={styles.textInputForYear}
                                            onChangeText={(endYear) => { const {qualification} =this.state; qualification.endYear=endYear; this.setState({qualification}); } }
                                            value={this.state.qualification.endYear}
                                            maxLength={45}
                                        />
                            {/* </View> */}
                        </View>
                        {/* <View style={styles.textInputContainer}> */}
                            <TextInput
                                placeholder="학력 내용을 입력하세요."
                                style={styles.textInputForId}
                                onChangeText={(detail) => { const {qualification} =this.state; qualification.detail=detail; this.setState({qualification}); }}
                                value={this.state.qualification.detail}
                                maxLength={45}
                            />
                        {/* </View> */}
                            <View style={{flexDirection:"row", marginTop:"10%", justifyContent:"space-between"}}>
                                <View  style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>overlayClose()}>
                                        <Text style={styles.modalText}>취소</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>this.qualificationOverlayClose()}>
                                        <Text style={styles.modalText}>확인</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>                     
                    </View>
                </View>
           </Modal>




            </ScrollView>
        {/* <View >
            <ImageBackground style={styles.backgroundPic} source={{ uri: `${this.state.lawyer.User.photo}?random=${new Date()}` }}>
            <Text style={styles.backgroundPicText}>{this.state.lawyer.introduction}</Text>
            </ImageBackground>
        </View> */}

        {/* {this.info()} */}
        


        {/* {this.state.home ? this.home() : null} */}
        {/* {this.state.info ? this.info() : null} */}
        {/* {this.state.qa ? this.qa() : null} */}


      </View>
    );
  }
}
LawyerModify.contextType = MyContext;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
        backgroundColor: "#fff",
    },
    body: {
        flex: 1,
        overflow: "scroll",
        paddingLeft:"5%",
        paddingRight:"5%",
        // backgroundColor: "#c0c0c0"
      },
      
    thinUnderline : {
        width: 500,
        height: 1,
        backgroundColor: "#E7E7E7",
        alignSelf: "center",
        borderRadius: 10,
        marginVertical: "8%"
    },
    thinShortUnderline : {
        width: 50,
        height: 2,
        backgroundColor: "#E7E7E7",
        alignSelf: "flex-start",
        borderRadius: 10,
        marginVertical: "5%"
    },

    basic_subtitle: {
        width:40,
        alignSelf:"center",
        fontFamily:"KPWDBold",
        fontSize:15,
        marginLeft:"3%"
    },

    basic_content: {
        alignSelf:"center",

        fontFamily: "KPWDMedium",
        fontSize:13,
        width:"70%"
    },


    home_info_subtitle: {
        fontFamily: "KPBBold",
        fontSize: 14,
        marginRight: 10
    },
    home_info_content: {
        fontFamily: "KPBRegular",
        color:"#888282",
        fontSize: 13,

    },
    moreButton: {
        backgroundColor: "#f8f8f8",
        padding: "2%",
        alignItems: "center"
    },
    moreButton_text: {
        alignSelf: "center",
        color: "#888282",
        fontFamily: "KPBBold",
        fontSize: 13,
        marginRight: 5
    },

    home_subtitle: {
        fontFamily: "KPWDBold",
        fontSize: 20
    },

    home_subtitle_num: {
        fontFamily: "KPWDBold",
        fontSize: 20,
        marginLeft: 10,
        color: colors.primary
    },


    qa_question:{
        width: vw(40),
        marginRight: 20
    },
    qa_question_title: {
        fontFamily: "KPBRegular",
        fontSize: 13,
    },
    qa_question_content: {
        fontFamily: "KPWDMedium",
        fontSize: 13,
        color: "#858282",
        marginTop: 10
    },
    qa_question_date: {
        fontFamily: "KPWDMedium",
        fontSize: 10,
        color: "#755C5C",
        marginTop: 10
    },


    info_subtitle: {
        fontFamily: "KPWDBold",
        fontSize: 18
    },
    info_field_img: {
        width: 40,
        height: 40
    },
    info_field_text: {
        fontFamily: "KPWDBold",
        fontSize: 12,
        marginTop: 10
    },

    info_career_subtitle: {
        fontFamily: "KPWDBold",
        fontSize: 13,
        width:"90%",
    },
    info_career_text1: {
        fontFamily: "KPWDMedium",
        fontSize: 12,
        color: "#565252",
        marginVertical: 3,
        width:"30%"
    },
    info_career_text2: {
        fontFamily: "KPWDMedium",
        fontSize: 12,
        color: "#565252",
        marginVertical: 3,
        width:"70%"
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
        width: 50,
        height: 50,
        backgroundColor: "#f6f6f6",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    fieldText: {
        fontSize: 12,
        fontFamily: "KPWDBold",
        marginTop: 8,
        textAlign: "center"
    },
    fieldImage: {
        width: "70%",
        height: "70%"
    },


    fieldSelectModal: {
        flex: 1,
        backgroundColor: 'rgba(52, 52, 52, 0.8)',
        justifyContent: "center",
      },

      fieldSelectContainer: {
        height: 200,
        width: "80%",
        backgroundColor: "#fff",
        alignItems: "center",
        alignSelf: "center",
        paddingHorizontal: "2%",
        paddingVertical: "3%"
      },
      fieldSelectContainerCareer: {
        height: 300,
        width: "80%",
        backgroundColor: "#fff",
        alignItems: "center",
        alignSelf: "center",
        paddingHorizontal: "2%",
        paddingVertical: "3%"
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
      textInput: {
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 5,
        height: 40,
        width: "80%",
        textAlign: "center",
      },
      textInputContainer: {
        flexDirection: "row",
        width: "80%",
        height: 40,
        justifyContent: "center",
        marginLeft: 10,
      },
      textInputSubtitle: {
        fontFamily:"KPWDBold",
        alignSelf:"center",
        justifyContent:"center",
        marginRight:"3%",
        fontSize:15
      },
      textInputForId: {
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 5,
        height: 40,
        width: "80%",
        textAlign: "center",
      },
      textInputForYear: {
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 5,
        height: 40,
        width: "20%",
        textAlign: "center",
        marginRight:"8%"
      },

      modalButton: {
          backgroundColor: colors.primary,
          width:"30%",
          borderRadius:20,
        marginHorizontal:"3%"
        },

      modalText: {
          fontFamily:"KPWDBold",
          color:"white",
        alignSelf:"center"
      }

});

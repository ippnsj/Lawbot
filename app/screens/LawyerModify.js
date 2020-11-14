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
import {Picker} from '@react-native-community/picker';
import { MyContext } from "../../context.js";

import colors from "../config/colors";
import Header from "./Header.js";
import { DrawerContentScrollView } from "@react-navigation/drawer";




// const categories=[
//     "자동차",  "산업재해",  "환경", "언론보도", "지식재산권", "의료", "건설", "국가", "기타", "가족/가정", "이혼", "폭행", "사기", "성범죄", "명예훼손", "모욕", "협박", "교통사고", "계약", "개인정보", "상속", "재산범죄", "매매", "노동", "채권추심", "회생/파산", "마약/대마", "소비자", "국방/병역", "학교", "주거침입", "도급/용역", "건설/부동산", "위증", "무고죄", "아동/청소년범죄", "임대차", "대여금", "온라인범죄","음주운전"   
// ]

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
        companyModify:false,
        addressModify:false,
        introModify:false,
        qualificationAdd:false,
        careerAdd:false,
        eduAdd:false,
        activityAdd:false,

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
        activity:{
            url:"",
            detail:"",            
        },
        addField: false,
        categoryID: 0,
        categories: {},
        };
    }


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
  };

  isFocused = () => {
    this.setState({id: this.props.route.params.id, lawyer: this.props.route.params.lawyer, categories: this.props.route.params.categories });
};

  componentDidMount() {
    this._loadFonts();
    this.props.navigation.addListener('focus', this.isFocused);
    // this.setState({id: this.props.route.params.id, lawyer: this.props.route.params.lawyer});
  };
  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this.isFocused);
  };

  overlayClose() {
      this.setState({introModify:false, companyModify:false, qualificationAdd:false, addressModify:false, careerAdd: false, eduAdd:false, activityAdd:false, addField: false})
  };

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

        fetch(`${ctx.API_URL}/user/profile/lawyer/introduction`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                'token': ctx.token,
            },
        }
        ).then((result) => {
            return result.json();
        }).then((result) => {
            if(result.success) {
                ToastAndroid.show("소개글 수정에 성공하였습니다!", ToastAndroid.SHORT);
                const { lawyer } = this.state;
                lawyer.introduction = this.state.intro;
                this.setState({ lawyer });
            }else {
                ToastAndroid.show("소개글 수정에 실패하였습니다...", ToastAndroid.SHORT);
            }
        });
    }

    companyOverlayClose(){
        this.setState({companyModify:false});
        const ctx = this.context;
        const body = {};
        body.companyName = this.state.companyName; 

        fetch(`${ctx.API_URL}/user/profile/lawyer/companyname`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                'token': ctx.token,
            },
        }
        ).then((result) => {
            return result.json();
        }).then((result) => {
            if(result.success) {
                ToastAndroid.show("소속법인 수정에 성공하였습니다!", ToastAndroid.SHORT);
                const { lawyer } = this.state;
                lawyer.companyName = this.state.companyName;
                this.setState({ lawyer });
            }else {
                ToastAndroid.show("소속법인 수정에 실패하였습니다...", ToastAndroid.SHORT);
            }
        });
    }

    addressOverlayClose(){
        this.setState({addressModify:false});
        const ctx = this.context;
        const body = {};
        body.address = this.state.address; 

        fetch(`${ctx.API_URL}/user/profile/lawyer/address`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                'token': ctx.token,
            },
        }
        ).then((result) => {
            return result.json();
        }).then((result) => {
            if(result.success) {
                ToastAndroid.show("주소 수정에 성공하였습니다!", ToastAndroid.SHORT);
                const { lawyer } = this.state;
                lawyer.address1 = this.state.address;
                this.setState({ lawyer });
            }else {
                ToastAndroid.show("주소 수정에 실패하였습니다...", ToastAndroid.SHORT);
            }
        });
    }

      async addFields() {
        this.setState({addField:false})
        const ctx = this.context;
        let body = {};

        body.Category_ID = this.state.categoryID;

        await fetch(`${ctx.API_URL}/user/interests/lawyer`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "token": ctx.token
            },
            body: JSON.stringify(body),
          }).then((res) => {
            return res.json();
          }).then((res) => {
              if(res.success) {
                const {lawyer}=this.state;
                lawyer.LawyerFields.push({ "Category_ID": this.state.categoryID, "Lawyer_ID": this.state.lawyer.ID });
                this.setState({lawyer})
                ToastAndroid.show("주요분야 추가에 성공하였습니다!", ToastAndroid.SHORT);
            }else {
                ToastAndroid.show("주요분야 추가에 실패하였습니다...", ToastAndroid.SHORT);
            }
          });
      }

      async deleteFields(idx, categoryID) {
        const ctx = this.context;
        let body = {};

        body.Category_ID = categoryID;

        await fetch(`${ctx.API_URL}/user/interests/lawyer`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "token": ctx.token
            },
            body: JSON.stringify(body),
          }).then((res) => {
            return res.json();
          }).then((res) => {
              if(res.success) {
                const {lawyer}=this.state;
                lawyer.LawyerFields.splice(idx,1);
                this.setState({lawyer})
                ToastAndroid.show("주요분야 삭제에 성공하였습니다!", ToastAndroid.SHORT);
            }else {
                ToastAndroid.show("주요분야 삭제에 실패하였습니다...", ToastAndroid.SHORT);
            }
          });
      }

      async careerOverlayClose() {
        this.setState({careerAdd:false})
        const ctx = this.context;
        let body = {
          endYear: "",
          startYear:"",
          detail:"",
        };

        body.endYear=this.state.career.endYear;
        body.startYear=this.state.career.startYear;
        body.detail=this.state.career.detail;

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
              if(res.success) {
                const {lawyer}=this.state;
                lawyer.Careers.push(this.state.career);
                this.setState({lawyer})
                ToastAndroid.show("경력 추가에 성공하였습니다!", ToastAndroid.SHORT);
            }else {
                ToastAndroid.show("경력 추가에 실패하였습니다...", ToastAndroid.SHORT);
            }
          });
      }

      async careerDelete(target, idx) {
        // this.setState({careerAdd:false})
        const ctx = this.context;
        let body = {
          endYear: "",
          startYear:"",
          detail:"",
        };

        body.endYear=target.endYear;
        body.startYear=target.startYear;
        body.detail=target.detail;

        await fetch(`${ctx.API_URL}/user/profile/lawyer/career`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "token": ctx.token
            },
            body: JSON.stringify(body),
          }).then((res) => {
            return res.json();
          }).then((res) => {
              if(res.success) {
                const {lawyer}=this.state;
                lawyer.Careers.splice(idx,1);
                this.setState({lawyer})
                ToastAndroid.show("경력 삭제에 성공하였습니다!", ToastAndroid.SHORT);
            }else {
                ToastAndroid.show("경력 삭제에 실패하였습니다...", ToastAndroid.SHORT);
            }
          });
      }

      async eduOverlayClose() {
        this.setState({eduAdd:false})
        const ctx = this.context;
        let body = {
          endYear: "",
          startYear:"",
          detail:"",
        //   Lawyer_ID:this.state.lawyer.ID,
        };

        body.endYear=this.state.education.endYear;
        body.startYear=this.state.education.startYear;
        body.detail=this.state.education.detail;

        await fetch(`${ctx.API_URL}/user/profile/lawyer/education`, {
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
              if(res.success) {
                const {lawyer}=this.state;
                lawyer.Education.push(this.state.education);
                this.setState({lawyer})
                ToastAndroid.show("학력 추가에 성공하였습니다!", ToastAndroid.SHORT);
            }else {
                ToastAndroid.show("학력 추가에 실패하였습니다...", ToastAndroid.SHORT);
            }
          });
      }

      async eduDelete(target, idx) {
        // this.setState({careerAdd:false})
        const ctx = this.context;
        let body = {
          endYear: "",
          startYear:"",
          detail:"",
        };

        body.endYear=target.endYear;
        body.startYear=target.startYear;
        body.detail=target.detail;

        await fetch(`${ctx.API_URL}/user/profile/lawyer/education`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "token": ctx.token
            },
            body: JSON.stringify(body),
          }).then((res) => {
            return res.json();
          }).then((res) => {
              if(res.success) {
                const {lawyer}=this.state;
                lawyer.Education.splice(idx,1);
                this.setState({lawyer})
                ToastAndroid.show("학력 삭제에 성공하였습니다!", ToastAndroid.SHORT);
            }else {
                ToastAndroid.show("학력 삭제에 실패하였습니다...", ToastAndroid.SHORT);
            }
          });
      }


      async qualificationOverlayClose() {
        this.setState({qualificationAdd:false})
        const ctx = this.context;
        let body = {
          endYear: "",
          startYear:"",
          detail:"",
        //   Lawyer_ID:this.state.lawyer.ID,
        };

        body.endYear=this.state.qualification.endYear;
        body.startYear=this.state.qualification.startYear;
        body.detail=this.state.qualification.detail;

        await fetch(`${ctx.API_URL}/user/profile/lawyer/qualification`, {
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
              if(res.success) {
                const {lawyer}=this.state;
                lawyer.Qualifications.push(this.state.qualification);
                this.setState({lawyer})
                ToastAndroid.show("자격 추가에 성공하였습니다!", ToastAndroid.SHORT);
            }else {
                ToastAndroid.show("자격 추가에 실패하였습니다...", ToastAndroid.SHORT);
            }
          });
      }

      async qualificationDelete(target, idx) {
        // this.setState({careerAdd:false})
        const ctx = this.context;
        let body = {
          endYear: "",
          startYear:"",
          detail:"",
        //   Lawyer_ID:this.state.lawyer.ID,
        };

        body.endYear=target.endYear;
        body.startYear=target.startYear;
        body.detail=target.detail;

        await fetch(`${ctx.API_URL}/user/profile/lawyer/qualification`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "token": ctx.token
            },
            body: JSON.stringify(body),
          }).then((res) => {
            return res.json();
          }).then((res) => {
              if(res.success) {
                const {lawyer}=this.state;
                lawyer.Qualifications.splice(idx,1);
                this.setState({lawyer})
                ToastAndroid.show("자격 삭제에 성공하였습니다!", ToastAndroid.SHORT);
            }else {
                ToastAndroid.show("자격 삭제에 실패하였습니다...", ToastAndroid.SHORT);
            }
          });
      }

    async activityOverlayClose() {
        this.setState({activityAdd:false})
        const ctx = this.context;
        let body = {
          url:"",
          detail:"",
        };

        body.url=this.state.activity.url;
        body.detail=this.state.activity.detail;

        await fetch(`${ctx.API_URL}/user/profile/lawyer/activity`, {
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
              if(res.success) {
                const {lawyer}=this.state;
                lawyer.Activities.push(this.state.activity);
                this.setState({lawyer})
                ToastAndroid.show("활동사항 추가에 성공하였습니다!", ToastAndroid.SHORT);
            }else {
                ToastAndroid.show("활동사항 추가에 실패하였습니다...", ToastAndroid.SHORT);
            }
          });
      }

      async activityDelete(target, idx) {
        const ctx = this.context;
        let body = {
          url:"",
          detail:"",
        };

        body.url=target.url;
        body.detail=target.detail;

        await fetch(`${ctx.API_URL}/user/profile/lawyer/activity`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "token": ctx.token
            },
            body: JSON.stringify(body),
          }).then((res) => {
            return res.json();
          }).then((res) => {
              if(res.success) {
                const {lawyer}=this.state;
                lawyer.Activities.splice(idx,1);
                this.setState({lawyer})
                ToastAndroid.show("활동사항 삭제에 성공하였습니다!", ToastAndroid.SHORT);
            }else {
                ToastAndroid.show("활동사항 삭제에 실패하였습니다...", ToastAndroid.SHORT);
            }
          });
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
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{flexDirection: "row"}}>
                        {this.state.lawyer.LawyerFields && this.state.lawyer.LawyerFields.length ? 
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {this.state.lawyer.LawyerFields.map((f, idx)=> {
                            return(
                                <View style={{alignItems: 'center', marginRight:40, marginTop: 10}} key={idx}>
                                    <Image style={styles.info_field_img} source={catImgList[f.Category_ID]}/>
                                    <Text style={styles.info_field_text}>{this.state.categories[f.Category_ID].name}</Text>
                                    <TouchableOpacity onPress={()=>this.deleteFields(idx, f.Category_ID)}>
                                        <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center",fontSize:11}} >삭제</Text>
                                    </TouchableOpacity>
                                </View>
                                )
                            })}
                            <TouchableOpacity onPress={()=>this.setState({ addField: true })}>
                                <View style={{alignItems: 'center', marginRight:40, marginTop: 10}}>
                                    <Image style={styles.info_field_img} source={require("../assets/more.png")}/>
                                    <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center",fontSize:14}}>추가</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    : 
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={styles.noneText}>전문 분야가 없습니다.</Text>
                            <TouchableOpacity onPress={()=>this.setState({ addField: true })}>
                                <View style={{alignItems: 'center', marginRight:40, marginTop: 10}}>
                                    <Image style={styles.info_field_img} source={require("../assets/more.png")}/>
                                    <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center",fontSize:14}}>추가</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        }
                        {/* <TouchableOpacity onPress={()=>this.setState({ addField: true })}>
                            <View style={{alignItems: 'center', marginRight:40, marginTop: 10}}>
                                <Image style={styles.info_field_img} source={require("../assets/more.png")}/>
                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center",fontSize:14}}>추가</Text>
                            </View>
                        </TouchableOpacity> */}
                    </ScrollView>
                </View>

                <View style={styles.thinUnderline}/>


                <View style={{marginHorizontal:"5%"}}>
                    <Text style={styles.info_subtitle}>이력사항</Text>
                    <View style={{margin:"3%"}}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.info_career_subtitle}>경력</Text>
                            
                        </View>
                        <View style={{borderLeftColor:"#9C9A9A", borderLeftWidth: 1.5, margin: "3%", paddingHorizontal:"5%"}}>
                                {this.state.lawyer.Careers && this.state.lawyer.Careers.length ? this.state.lawyer.Careers.map((c,idx)=>{
                                    return(
                                        <View style={{flexDirection:"row"}} key={idx}>
                                            <Text style={styles.info_career_text1}>{c.startYear} ~ {c.endYear===null ? empty : c.endYear}</Text>
                                            <Text numberOfLines={1}  style={styles.info_career_text2}>  -  {c.detail}</Text>   
                                            <TouchableOpacity onPress={()=>this.careerDelete(c,idx)}>
                                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center",fontSize:11}}>삭제</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }) : 

                                <View>
                                    <Text style={styles.noneText}>경력사항 없음</Text>
                                    {/* <TouchableOpacity onPress={()=>this.setState({careerAdd:true})}>
                                        <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center", fontSize:11}}>추가</Text>
                                    </TouchableOpacity> */}
                                </View>
                                    }
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{width:"92%"}}> </Text>
                            <TouchableOpacity onPress={()=>this.setState({careerAdd:true})}>
                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center", fontSize:11}}>추가</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={{margin:"3%"}}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={styles.info_career_subtitle}>자격</Text>
                            
                        </View>
                        <View style={{borderLeftColor:"#9C9A9A", borderLeftWidth: 1.5, margin: "3%", paddingHorizontal:"5%"}}>
                                {this.state.lawyer.Qualifications && this.state.lawyer.Qualifications.length ? this.state.lawyer.Qualifications.map((c, idx)=>{
                                    return(
                                        <View style={{flexDirection:"row"}} key={idx}>
                                            <Text style={styles.info_career_text1}>{c.startYear} ~ {c.endYear===null ? empty : c.endYear}</Text>
                                            <Text numberOfLines={1}  style={styles.info_career_text2}>  -  {c.detail}</Text>   
                                            <TouchableOpacity onPress={()=>this.qualificationDelete(c, idx)}>
                                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center",fontSize:11}}>삭제</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }) : <View>
                                <Text style={styles.noneText}>자격사항 없음</Text>
                                {/* <TouchableOpacity onPress={()=>this.setState({qualificationAdd:true})}>
                                    <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center", fontSize:11}}>추가</Text>
                                </TouchableOpacity> */}
                            </View>}
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{width:"92%"}}> </Text>
                            <TouchableOpacity onPress={()=>this.setState({qualificationAdd:true})}>
                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center", fontSize:11}}>추가</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{margin:"3%"}}>
                        <Text style={styles.info_career_subtitle}>학력</Text>
                        <View style={{borderLeftColor:"#9C9A9A", borderLeftWidth: 1.5, margin: "3%", paddingHorizontal:"5%"}}>
                                {this.state.lawyer.Education && this.state.lawyer.Education.length ? this.state.lawyer.Education.map((c, idx)=>{
                                    return(
                                        <View style={{flexDirection:"row"}} key={idx}>
                                            <Text style={styles.info_career_text1}>{c.startYear} ~ {c.endYear===null ? empty : c.endYear}</Text>
                                            <Text numberOfLines={1} style={styles.info_career_text2}>  -  {c.detail}</Text>   
                                            <TouchableOpacity onPress={()=>this.eduDelete(c, idx)}>
                                                <Text style={{color:colors.primary, fontFamily:"KPWDBold",alignSelf:"center", fontSize:11}}>삭제</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }) : <View>
                                <Text style={styles.noneText}>학력사항 없음</Text>
                                {/* <TouchableOpacity onPress={()=>this.setState({eduAdd:true})}>
                                    <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center", fontSize:11}}>추가</Text>
                                </TouchableOpacity> */}
                            </View>}
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{width:"92%"}}> </Text>
                            <TouchableOpacity onPress={()=>this.setState({eduAdd:true})}>
                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"center", fontSize:11}}>추가</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </View>
                <View style={styles.thinUnderline}/>
                

                <View>
                    <Text style={styles.info_subtitle}>활동사항</Text>
                    <View style={{margin:"3%"}}>
                        <View style={{borderLeftColor:"#9C9A9A", borderLeftWidth: 1.5, margin: "3%", paddingHorizontal:"5%"}}>
                                {this.state.lawyer.Activities && this.state.lawyer.Activities.length ? this.state.lawyer.Activities.map((c, idx)=>{
                                    return(
                                        <View style={{marginBottom:10}} key={idx}>
                                            <Text numberOfLines={1} style={styles.activity_text1}>{c.detail}</Text>
                                            <View style={{flexDirection:"row"}}>
                                                <Text  numberOfLines={2} style={styles.activity_text2}>   {c.url}</Text>   
                                                <TouchableOpacity onPress={()=>this.activityDelete(c, idx)}>
                                                    <Text style={{color:colors.primary, fontFamily:"KPWDBold",alignSelf:"center", fontSize:11}}>삭제</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                }) : <View>
                                
                                <Text style={styles.noneText}>활동사항 없음</Text>
                                {/* <TouchableOpacity onPress={()=>this.setState({activityAdd:true})}>
                                    <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"flex-start", fontSize:11}}>추가</Text>
                                </TouchableOpacity> */}
                            </View>}
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{width:"92%"}}> </Text>
                            <TouchableOpacity onPress={()=>this.setState({activityAdd:true})}>
                                <Text style={{color:colors.primary, fontFamily:"KPWDBold", alignSelf:"flex-start", fontSize:11}}>추가</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.thinUnderline}/>

                <View style={[styles.moreButton, {marginBottom:"5%"}]}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <View style={{flexDirection: "row"}}>
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
                                    <TouchableOpacity onPress={()=>this.overlayClose()}>
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
                                    <TouchableOpacity onPress={()=>this.overlayClose()}>
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
                                    <TouchableOpacity onPress={()=>this.overlayClose()}>
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

           {/* field modify */}
           <Modal visible={this.state.addField} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                <View style={styles.fieldSelectModal}>
                    <View style={styles.fieldSelectContainer}>
                        <Text style={{fontFamily:"KPWDBold", fontSize:20, marginBottom:"5%"}}>주요분야 수정</Text>
                        {/* <View style={styles.textInputContainer}> */}
                        <Picker
                            selectedValue={this.state.categoryID}
                            style={{ width: 200 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({categoryID: itemIndex})}
                        >
                            {this.state.categories.map((cat, idx) => {
                                return(<Picker.Item label={cat.name} value={idx} key={idx}/>)
                            })}
                        </Picker>
                        {/* </View> */}
                            <View style={{flexDirection:"row", marginTop:"10%", justifyContent:"space-between"}}>
                                <View  style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>this.overlayClose()}>
                                        <Text style={styles.modalText}>취소</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>this.addFields()}>
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
                                    <TouchableOpacity onPress={()=>this.overlayClose()}>
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
                                    <TouchableOpacity onPress={()=>this.overlayClose()}>
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
                                placeholder="자격 내용을 입력하세요."
                                style={styles.textInputForId}
                                onChangeText={(detail) => { const {qualification} =this.state; qualification.detail=detail; this.setState({qualification}); }}
                                value={this.state.qualification.detail}
                                maxLength={45}
                            />
                        {/* </View> */}
                            <View style={{flexDirection:"row", marginTop:"10%", justifyContent:"space-between"}}>
                                <View  style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>this.overlayClose()}>
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

           
             {/* activities modify */}
             <Modal visible={this.state.activityAdd} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                <View style={styles.fieldSelectModal}>
                    <View style={styles.fieldSelectContainerCareer}>
                        <Text style={{fontFamily:"KPWDBold", fontSize:20, marginBottom:"5%"}}>활동 사항 추가</Text>
                        <View style={{flexDirection:"row"}}>
                        <Text style={styles.textInputSubtitle}>내용</Text>
                                    <TextInput
                                        placeholder="활동 내용을 입력하세요."
                                        style={styles.textInputForId}
                                        onChangeText={(detail) => { const {activity} =this.state; activity.detail=detail; this.setState({activity}); }}
                                        value={this.state.activity.detail}
                                        maxLength={45}
                                    />
                        </View>
                        <View style={{flexDirection:"row", marginTop: 15}}>
                            <Text style={styles.textInputSubtitle}>URL</Text>
                                <TextInput
                                    placeholder="url을 입력하세요."
                                    style={styles.textInputForId}
                                    onChangeText={(url) => { const {activity} =this.state; activity.url=url; this.setState({activity}); }}
                                    value={this.state.activity.url}
                                    maxLength={45}
                                />
                        </View>
                            <View style={{flexDirection:"row", marginTop:"10%", justifyContent:"space-between"}}>
                                <View  style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>this.overlayClose()}>
                                        <Text style={styles.modalText}>취소</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.modalButton}>
                                    <TouchableOpacity onPress={()=>this.activityOverlayClose()}>
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

    activity_text1: {
        fontFamily: "KPWDMedium",
        fontSize: 15,
        color: "black",
        marginVertical: 3,
        width:"30%"
    },
    activity_text2: {
        fontFamily: "KPWDMedium",
        fontSize: 10,
        color: "#565252",
        marginVertical: 3,
        width:"92%"
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
        height: 280,
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
      },

      noneText: {
        fontFamily: "KPWDMedium",
        fontSize: 12,
        color: "#565252",
      }
});

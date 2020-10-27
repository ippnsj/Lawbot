import React, { Component, useState } from 'react';
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
    Alert,
  } from "react-native";
import * as Font from "expo-font";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import {Picker} from '@react-native-community/picker';

import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import Constants from "expo-constants";
import * as DocumentPicker from 'expo-document-picker';
import colors from "../config/colors";
import { MyContext } from '../../context.js';


// const questions = [
//     {
//         field: ["자동차", "산업재해", "폭행"],
//         title: "음주운전 처벌수위와 대처",
//         content: "우선 과거 2016년도 음주운전 취소(수치 0.158)된적이 있고, 2017년 무면허 전과가있습니다."
        
//     },
//     {
//         field: ["자동차",  "사기", "폭행"],
//         title: "자동차 주행중 돌이 날라와서 찍힘 사고가 발생했습니다",
//         content: "자유로를 주행중에 돌빵을 당했습니다. 블랙박스를 수차례 돌려 보았지만 이게 앞차에서 날아온 돌은 아닌것 같고 갑자기 공중에서 생기더니 차에 맞았습니다. 주행도로 옆에는 항타기 공사중이었고 혹시나 그 현장에서 날아온건 아닐까 또 블랙박스를 돌려 보았지만 돌이 날아오는 방향은 기계와 반대입니다."
//     },
//     {
//         field: ["자동차", "모욕" ],
//         title: "음주교통사고 피해자입니다",
//         content: "안녕하세요\n저는 음주교통사고 피해자차량의 동승자입니다.\n일주일전 운전자와 함께 차량으로 서행중에 뒤에서 음주차량이 저희차를 한번박고 세번을 추가로 더 박았습니다."
//     },
// ]


export default class QaUser extends Component {
    state = {
        fontsLoaded: false,
        file: null,
        qna: "",
        qnaKind: "키워드",
        article:{},
        questions: [
            {
                field: ["자동차", "산업재해", "폭행"],
                title: "음주운전 처벌수위와 대처",
                content: "우선 과거 2016년도 음주운전 취소(수치 0.158)된적이 있고, 2017년 무면허 전과가있습니다.2018년에 면허를다시 취득후 교동법규 위반없이 잘지내오다 전날 집근처에서 밤11시 까지 술을마시고 집근처에서"
                
            },
            {
                field: ["자동차",  "사기", "폭행"],
                title: "자동차 주행중 돌이 날라와서 찍힘 사고가 발생했습니다",
                content: "자유로를 주행중에 돌빵을 당했습니다. 블랙박스를 수차례 돌려 보았지만 이게 앞차에서 날아온 돌은 아닌것 같고 갑자기 공중에서 생기더니 차에 맞았습니다. 주행도로 옆에는 항타기 공사중이었고 혹시나 그 현장에서 날아온건 아닐까 또 블랙박스를 돌려 보았지만 돌이 날아오는 방향은 기계와 반대입니다."
            },
            {
                field: ["자동차", "모욕" ],
                title: "음주교통사고 피해자입니다",
                content: "안녕하세요\n저는 음주교통사고 피해자차량의 동승자입니다.\n일주일전 운전자와 함께 차량으로 서행중에 뒤에서 음주차량이 저희차를 한번박고 세번을 추가로 더 박았습니다."
            },
        ],
        interests: [
            {
                name: "#관심분야 전체",
                selected: true
            },
            {
                name: "#자동차",
                selected: false
            },
            {
                name: "#건설",
                selected: false
            },
            {
                name: "#폭행",
                selected: false
            },
            {
                name: "#사기",
                selected: false
            },
            {
                name: "#가족/가정",
                selected: false
            },
            {
                name: "#기타",
                selected: false
            },
        ],
        lawyers : [
            {
                name: "김수지",
                url: require("../assets/lawyer1.jpg")
            },
            {
                name: "박철수",
                url: require("../assets/lawyer2.jpg")
            },{
                name: "강혜연",
                url: require("../assets/lawyer3.jpg")
            },
            {
                name: "김수지",
                url: require("../assets/lawyer1.jpg")
            },
            {
                name: "박철수",
                url: require("../assets/lawyer2.jpg")
            },{
                name: "강혜연",
                url: require("../assets/lawyer3.jpg")
            },{
                name: "김수지",
                url: require("../assets/lawyer1.jpg")
            },
            {
                name: "박철수",
                url: require("../assets/lawyer2.jpg")
            },{
                name: "강혜연",
                url: require("../assets/lawyer3.jpg")
            },
        ],
        categories:{},
    };

  
    async _loadFonts() {
      await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPWDLight: require("../assets/fonts/KPWDLight.ttf"),

        KPWDMedium: require("../assets/fonts/KPWDMedium.ttf"),
        KPBBold: require("../assets/fonts/KoPubBatang-Bold.ttf")

      });
      this.setState({ fontsLoaded: true });
    }

    // componentWillMount() {
    //     if (Object.keys(this.props.route.params.article).length!=0 ) {
    //         console.log("dasfsdffffffffffffffffffffffff");
    //         this.setState(prevState => ({
    //             questions: [this.props.route.params.article, ...prevState.questions]
    //         }))
    //     }
    // };
  
    async componentDidMount() {
        this._loadFonts();
        if (Object.keys(this.props.route.params.article).length!=0 ) {
            console.log("dasfsdffffffffffffffffffffffff");
            this.setState({questions: [...this.state.questions, this.props.route.params.article]})
            // this.setState(prevState => ({
            //     questions: [this.props.route.params.article, ...prevState.questions]
            // }))
        }
        this.forceUpdate();
        // if (typeof this.props.route.params.article != "undefined") {
        // console.log(this.props.route.params);
        // this.setState({questions: this.props.route.params.article});  
        
    };

    async handleButtons(idx) {
        let newInt=[...this.state.interests];
        newInt.map((item)=> {
            item.selected=false;
        });
        // let newInt=[this.state.interests.selected ? ...this.state.interests : ...newInt]
        newInt[idx] = {...newInt[idx], selected: true};
        
        this.setState({interests: newInt});
    }

    renderArticle() {
        if (Object.entries(this.state.article).length!==0) {
            return(
                <View>
                <View style={styles.interestQ_content_question_field}>
                {this.state.article.category.map((c)=> {
                    return(
                        <Text style={styles.interestQ_content_question_field_text}>{c}</Text>
                        )
                    })}
                </View>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('QaAnswer')}>
                    <View>
                        <Text style={styles.interestQ_content_question_title}>{this.state.article.title}</Text>
                        <Text style={styles.interestQ_content_question_content}>{this.state.article.content}</Text>
                        <View>
                            <Text style={styles.interestQ_content_question_answer}>답변</Text>

                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            )
        }
    }


    
    // async searchQNA() {
    //     if(this.state.qna == "") {
    //         Alert.alert( "오류", "검색어를 입력해주세요.", [ { text: "알겠습니다."} ]);
    //     }else {
    //         const ctx = this.context;
    //         var body = {};
    //         body.kind = this.state.qnaKind;
    //         body.content = this.state.qna;

    //         await fetch(`${ctx.API_URL}/qna/question/search`, {
    //             method: "POST",
    //             headers: {
    //                 "Accept": "application/json",
    //                 "Content-Type": "application/json",
    //                 "token": ctx.token
    //             },
    //             body: JSON.stringify(body),
    //         })
    //         .then((res) => {
    //             return res.json();
    //         }).then((res) => {
    //             this.searchAgain(res.posts);
    //         })
    //     }
    // }

    // searchQNA() {
    //     if(this.state.qna == "") {
    //         Alert.alert( "오류", "검색어를 입력해주세요.", [ { text: "알겠습니다."} ]);
    //     }else {
    //         const ctx = this.context;
    //         var body = {};
    //         body.kind = this.state.qnaKind;
    //         body.content = this.state.qna;

    //         fetch(`${ctx.API_URL}/qna/question/search`, {
    //             method: "POST",
    //             headers: {
    //                 "Accept": "application/json",
    //                 "Content-Type": "application/json",
    //                 "token": ctx.token
    //             },
    //             body: JSON.stringify(body),
    //         })
    //         .then((res) => {
    //             return res.json();
    //         }).then((res) => {
    //             this.props.navigation.navigate("QaList", {
    //                 list: res,
    //             });
    //         })
    //     }
    // }

    searchQNA() {
        if(this.state.qna == "") {
            Alert.alert( "오류", "검색어를 입력해주세요.", [ { text: "알겠습니다."} ]);
        }else {
            const ctx = this.context;
            var body = {};
            body.kind = this.state.qnaKind;
            body.content = this.state.qna;

            fetch(`${ctx.API_URL}/qna/category`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "token": ctx.token
                },
                }).then((res) => {
                    return res.json();
                }).then((res) => {
                    this.setState({categories: res});
                    fetch(`${ctx.API_URL}/qna/question/search`, {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "token": ctx.token
                        },
                        body: JSON.stringify(body),
                    })
                    .then((res) => {
                        return res.json();
                    }).then((res) => {
                        this.props.navigation.navigate("QaList", {
                            posts: res.posts,
                            categories: this.state.categories
                        });
                    })
            })   
        }
    }

    
    render() {
        if (!this.state.fontsLoaded) {
            return <View />;
          }
          return (
              <View style={styles.container}>
                    <View style={styles.header}>
                        <Image source={require("../assets/menu.png")} style={styles.menu} />
                        <Text style={styles.logoTitle} onPress={() => {this.props.navigation.navigate('Home')}} >LAWBOT</Text>
                        <Image
                            source={require("../assets/profile.png")}
                            style={styles.profile}
                        />
                    </View>


                {/* 글쓰기 버튼!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                {/* 글쓰기 버튼!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                    <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('QaWrite')}  >                       
                        <Image style={styles.writebuttonimg} source={require("../assets/writeButton.png")} />
                    </TouchableOpacity>
                {/* 글쓰기 버튼!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                {/* 글쓰기 버튼!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
              
                

                {/* body */}
                <ScrollView >
                    <View style={styles.body}>
                        
                        {/* QA bar */}
                    <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                            <Picker
                                selectedValue={this.state.qnaKind}
                                style={{ width: 110 }}
                                onValueChange={(itemValue, itemIndex) => this.setState({qnaKind: itemValue})}
                            >
                                <Picker.Item label="제목" value="제목" />
                                <Picker.Item label="내용" value="내용" />
                                <Picker.Item label="키워드" value="키워드" />
                            </Picker>
                            <TextInput 
                                placeholder="검색어를 입력하세요"
                                style={styles.textInput}
                                value={this.state.qna}
                                onChangeText={(qna) => this.setState({ qna })}
                                onSubmitEditing={() => {this.searchQNA()}}
                                returnKeyType="search"
                            />
                            <TouchableOpacity onPress={() => {this.searchQNA()}}>
                                <Image source={require("../assets/search.png")} style={styles.search} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.underline}></View>

                        {/* <View style={styles.searchBar}>
                            <Image source={require("../assets/search.png")} style={styles.search} />
                            <TextInput 
                                placeholder="궁금한 법령이나 키워드를 입력해 보세요!"
                                style={styles.textInput}
                            />
                        </View>
                        <View style={styles.underline}></View> */}
                    </View>


                    {/* my news */}
                    <View style={styles.myNews}>
                        <View style={styles.myNews_header}>
                            <Text style={styles.myNews_header_title}>내 소식</Text>
                            <Text style={styles.myNews_header_noticeNum}>1</Text>
                            <TouchableOpacity  onPress={() => this.setState({fieldSelectVisible: true})}>
                                <Text style={styles.myNews_header_text}>전체 보기</Text>
                            </TouchableOpacity>
                            <Image style={styles.more} source={require("../assets/more.png")} />
                        </View>

                        <View style={styles.myNews_content}>
                            <Text style={styles.myNews_content_icon}>A.</Text>
                            <View style={styles.myNews_content_main}>
                                <View style={styles.myNews_content_main_subtitle}>
                                    <Text style={styles.myNews_content_main_subtitle_red}>답변 2개</Text>
                                    <Text style={styles.myNews_content_main_subtitle_black}>가 등록 되었습니다.</Text>
                                </View>
                                <Text style={styles.myNews_content_main_question}>편의점 폐기음식 먹은 것 손해배상 해야하나요?</Text>
                            </View>
                        </View>
                    </View>

                    {/* interest */}
                    <View style={{backgroundColor: "#EBEBEB", marginHorizontal: -20, marginTop: "5%" }}>
                        <View style={styles.interest}>
                            <View style={styles.interestL}>
                                <View style={styles.interestL_header}>
                                    <Text style={styles.interestL_header_title}>관심분야 우수 답변자</Text>
                                    
                                    <TouchableOpacity  onPress={() => this.setState({fieldSelectVisible: true})}>
                                        <Text style={styles.interestL_header_text}>전체 보기</Text>
                                    </TouchableOpacity>
                                    <Image style={styles.more} source={require("../assets/more.png")} />
                                </View>

                                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.interestL_content_tags}>
                                    
                                    {this.state.lawyers.map((lawyer)=> {
                                        return(
                                            <View style={styles.interest_lawyer}>
                                                <Image style={styles.interest_lawyer_pic} source={lawyer.url}/>
                                                <Text style={styles.interest_lawyer_name}>{lawyer.name}</Text>
                                            </View>
                                            // <TouchableOpacity  onPress={() => this.handleButtons(idx) } key={idx}>
                                            //     <Text style={inter.selected ? styles.interestQ_content_tags_tag_clicked : styles.interestQ_content_tags_tag}>{inter.name}</Text>
                                            // </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                                {/* <Image source={this.state.img} /> */}
                            </View>
                            

                            {/* interest question */}
                            <View style={styles.interestQ}>
                                <View style={styles.interestQ_header}>
                                    <Text style={styles.interestQ_header_title}>관심분야 질문</Text>
                                    
                                    <TouchableOpacity  onPress={() => this.setState({fieldSelectVisible: true})}>
                                        <Text style={styles.interestQ_header_text}>전체 보기</Text>
                                    </TouchableOpacity>
                                    <Image style={styles.more} source={require("../assets/more.png")} />
                                </View>
                                <View style={{borderBottomColor: '#ebebeb', borderBottomWidth: 1, marginTop: 10}}/>
                                
                                <View style={styles.interestQ_content}>
                                   
                                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.interestQ_content_tags}>
                                            {/* {this.state.interests.map((interest) => (
                                                <TouchableOpacity  onPress={() => this.setState({fieldSelectVisible: true})}>
                                                    <Text style={styles.interestQ_content_tags_tag}>{interest.name}</Text>
                                                </TouchableOpacity>
                                            ))}; */}

                                            {this.state.interests.map((inter, idx)=> {
                                                return(
                                                    <TouchableOpacity  onPress={() => this.handleButtons(idx) } key={idx}>
                                                        <Text style={inter.selected ? styles.interestQ_content_tags_tag_clicked : styles.interestQ_content_tags_tag}>{inter.name}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                            
                                            
                                        </ScrollView>
                                        
                                        {/* {this.state.interests.map((inter) => {
                                            return(
                                                <View>

                                                    <Text>{inter.name}</Text>
                                                    <Text>{inter.selected ? "맞다" : "아니다"}</Text>
                                                </View>
                                            )
                                        })} */}

                                        {/* 찐 질문 */}
                                        <View>
                                            {/* {Object.entries(this.state.article).length!==0 && 
                                                <View>
                                                <View style={styles.interestQ_content_question_field}>
                                                {this.state.article.category.map((c)=> {
                                                    return(
                                                        <Text style={styles.interestQ_content_question_field_text}>{c}</Text>
                                                        )
                                                    })}
                                                </View>
                                                <TouchableOpacity onPress={()=>this.props.navigation.navigate('QaAnswer')}>
                                                    <View>
                                                        <Text style={styles.interestQ_content_question_title}>{this.state.article.title}</Text>
                                                        <Text style={styles.interestQ_content_question_content}>{this.state.article.content}</Text>
                                                        <View>
                                                            <Text style={styles.interestQ_content_question_answer}>답변</Text>
                                
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        } */}
                                            {/* {this.renderArticle() } */}

                                                   
                                            
                                            {this.state.questions.map((q, idx)=> {
                                                return(
                                                    <View key={idx}>
                                                        <View style={styles.interestQ_content_question_field}>
                                                        {q.field.map((f, idx)=> {
                                                            return(
                                                                <Text style={styles.interestQ_content_question_field_text} key={idx}>{f}</Text>
                                                                )
                                                            })}
                                                        </View>
                                                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('QaAnswer')}>
                                                            <View>
                                                                <Text style={styles.interestQ_content_question_title}>{q.title}</Text>
                                                                <Text style={styles.interestQ_content_question_content}>{q.content}</Text>
                                                                <View>
                                                                    <Text style={styles.interestQ_content_question_answer}> </Text>

                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                        <TouchableOpacity style={styles.interestQ_button}  onPress={() => this.terminologyExplanation()}>
                                            <Text style={styles.interestQ_buttonText}>내 관심분야 재설정 하기</Text>
                                        </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                 
                    </View>
                </ScrollView>
               

                    
            </View>
          )
        
    };
}
QaUser.contextType = MyContext;

const styles=StyleSheet.create({
    body: {
        flex: 1,
        overflow: "scroll",
        paddingLeft:"5%",
        paddingRight:"5%",
        // backgroundColor: "#c0c0c0"
      },
    container: {
        flex: 1,
        marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
        backgroundColor: "#fff",
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

    searchSection:{
        alignItems:"center",
        marginTop: 5
    },
    searchBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "5%",
        paddingRight: "5%",
        minHeight: 50,
    },
    search : {
        width:30,
        height:30,
        marginRight: 15,
        marginBottom: 5
    },

    textInput : {
        fontSize: 16,
        fontFamily: "KPWDBold",
        fontWeight: "400",
        // color: "#E7E7E7",
        marginRight: 10,
    },

    underline : {
        width: 340,
        height: 5,
        backgroundColor: "#E7E7E7",
        marginLeft: 10,
        marginTop: -7,
        borderRadius: 30
    },
    logoTitle: {
        fontSize: 20,
        fontFamily: "SCDream8",
    },
    menu: {
        width: 20,
        height: 20,
    },
    profile: {
        width: 20,
        height: 20,
    },

    writingButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 1,
        // bottom: 0,
        backgroundColor: "red"
    },



// News
    myNews: {
        justifyContent: "space-evenly",
        marginTop: "10%",
        marginHorizontal: "5%"
    },
    myNews_header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    myNews_header_title: {
        fontSize: 18,
        fontFamily: "KPWDBold",
        flex: 1,
        alignSelf: "center"
    },
    myNews_header_noticeNum: {
        fontSize: 13,
        flex:3,
        alignSelf: "auto",
        fontFamily: "KPWDBold",
        color: colors.primary,

    },
    myNews_header_text: {
        color: "#c0c0c0",
        alignSelf: "flex-end",
        fontFamily: "KPWDBold",
        fontSize: 11,
        // flex:1,
        // marginRight: -3,
        marginTop: 5
    },
    more: {
        // alignItems: "center",
        width: 20,
        height: 20,
        marginRight: -10,
        marginTop: 3,

        // flex: 0.5,
        // width: null,
        // height: null,
        // resizeMode: 'contain',
    },

    myNews_content: {
        flexDirection: "row",
        marginTop: "5%"
    },

    myNews_content_icon: {
        fontFamily: "KPBBold",
        fontSize: 22,
        marginLeft: '5%',
        alignSelf: "center"
    },
    myNews_content_main: {
        marginLeft: "5%"
    },
    myNews_content_main_subtitle: {
        flexDirection: "row"
    },

    myNews_content_main_subtitle_red: {
        color: colors.primary,
        fontFamily: "KPWDMedium",
        fontSize: 15
    },
    myNews_content_main_subtitle_black: {
        color: "black",
        fontFamily: "KPWDMedium",
        fontSize: 15
    },
    myNews_content_main_question: {
        color: "#c0c0c0",
        fontFamily: "KPWDMedium",
        fontSize: 12,
        marginTop: 2
    },



    interest: {
        backgroundColor: "white",
        marginTop: "5%",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40
    },

    interestQ: {
        justifyContent: "space-evenly",
        marginTop: "6%",
        marginHorizontal: "8%"
    },
    interestQ_header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    interestQ_header_title: {
        fontSize: 18,
        fontFamily: "KPWDBold",
        flex: 1,
        alignSelf: "center"
    },

    interestQ_header_text: {
        color: "#c0c0c0",
        alignSelf: "flex-end",
        fontFamily: "KPWDBold",
        fontSize: 11,
        // flex:1,
        // marginRight: -3,
        marginTop: 5
    },

    interestL: {
        justifyContent: "space-evenly",
        marginTop: "10%",
        marginHorizontal: "8%"
    },
    interestL_header: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    interestL_header_title: {
        fontSize: 18,
        fontFamily: "KPWDBold",
        flex: 1,
        alignSelf: "center"
    },

    interestL_header_text: {
        color: "#c0c0c0",
        alignSelf: "flex-end",
        fontFamily: "KPWDBold",
        fontSize: 11,
        // flex:1,
        // marginRight: -3,
        marginTop: 5
    },

    
    interestL_content_tags: {
        flexDirection: "row",
        overflow: "hidden",
        marginTop: "5%"
    },


    interest_lawyer: {
        justifyContent: "space-evenly",
        alignItems: "center",
        marginRight: "5%",
        marginBottom: "5%"
    },
    interest_lawyer_pic: {
        borderRadius: 100,
        width: 50,
        height: 50
    },
    interest_lawyer_name : {
        fontSize: 13,
        fontFamily: "KPWDMedium",
        marginTop: 5
    },



    interestQ_content_tags: {
        flexDirection: "row",
        overflow: "hidden",
        marginTop: "5%"
    },

    interestQ_content_tags_tag: {
        marginRight: "5%",
        color: "lightgray"
    },
    interestQ_content_tags_tag_clicked: {
        marginRight: "5%",
        fontFamily: "KPWDBold",
        color: "black"
    },


    interestQ_content_question_field: {
        flexDirection: "row",
        // backgroundColor: "red", 
        marginTop: "5%"
    },

    interestQ_content_question_field_text: {
        color: "lightgray",
        marginRight: "5%",
        fontSize: 10,
    },

    interestQ_content_question_title: {
        fontSize: 15,
        fontFamily: "KPWDBold"
    },
    interestQ_content_question_content: {
        fontSize: 13,
        color: "#1d1d1d",

    },

    interestQ_content_question_answer: {
        fontFamily: "KPWDBold",
        fontSize: 13,
        alignSelf: "flex-start",
        color: colors.primary,
        marginBottom: "5%",
        marginTop: 5
    },
    interestQ_button: {
        marginVertical: "5%",
        borderColor: "#c00202",
        backgroundColor: "white",
        borderRadius: 6,
        borderWidth: 2,
        paddingVertical: 3,
        paddingHorizontal: 10,
        height: 30,
        width: 300,
        alignSelf: "center"
    },
    interestQ_buttonText: {
        color: "#c00202",
        alignSelf: "center",
        fontFamily: "KPWDBold",
        fontSize: 15,
    },

    bottom: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 36,
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },

    button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,

        // backgroundColor: "yellow",
    }, 
    writebuttonimg: {
        width: 100,
        height: 100,
    }
});

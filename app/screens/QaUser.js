import React, { Component, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    BackHandler,
    Modal
  } from "react-native";
import * as Font from "expo-font";
import {Picker} from '@react-native-community/picker';

import Constants from "expo-constants";

import colors from "../config/colors";
import Header from "./Header.js";
import { MyContext } from '../../context.js';

export default class QaUser extends Component {
    state = {
        fontsLoaded: false,
        file: null,
        qna: "",
        qnaKind: "키워드",
        user: {},
        userInt: [],
        everySelected: true,
        AllPosts: {},
        posts: {},
        needToReset: true,
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
        categories: {},
        fieldSelectVisible: false,
        category: "",
        searchCategory: "",
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

    isFocused = () => {
        if(this.state.needToReset) {
            this.handleEveryButtons();
        }else {
            this.setState({ needToReset: true });
        }

        const ctx = this.context;

        if(ctx.token !== '' && this.state.token === ctx.token && ctx.favCategoryUpdated) {
            ctx.favCategoryUpdated = false;
            const { userInt } = this.state;
            for(var i = 0; i < this.state.userInt.length; i++) {
                userInt[i] = { "activate": ctx.userInt[i], "selected": false };
            }
            this.setState({ everySelected: true, userInt });
        }
    }

    handleBackButton = () => {
        if(this.props.navigation.isFocused()) {
            this.props.navigation.navigate("Home");

            return true;
        }else {
            return false;
        }
    }
  
    async componentDidMount() {
        this._loadFonts();
        this.props.navigation.addListener('focus', this.isFocused);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

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
        this.setState({ token: ctx.token, user: result });
        for(var i = 0; i < this.state.categories.length; i++) {
            userInt[i] = { "activate": -1, "selected": false };
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
                userInt[result[i].Category_ID] = { "activate": 1, "selected": false };
            }
        });

        this.setState({ userInt });
    };

    async componentDidUpdate() {
        const ctx = this.context;
        const { userInt } = this.state;
    
        if(ctx.token != '') {
            if(this.state.token != ctx.token) {
                await fetch(`${ctx.API_URL}/user`, {
                    method: "GET",
                    headers: {
                        'token': ctx.token,
                    },
                }).then((result) => {
                    return result.json();
                }).then((result) => {
                    this.setState({ token: ctx.token, user: result });
                    for(var i = 0; i < this.state.categories.length; i++) {
                        userInt[i] = { "activate": -1, "selected": false };
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
                        userInt[result[i].Category_ID] = { "activate": 1, "selected": false };
                    }
                });
            
                this.setState({ userInt, qna: "", qnaKind: "키워드" });
                this.handleEveryButtons();
            }
        }
      }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.isFocused);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    async handleEveryButtons() {
        let { userInt } = this.state;
        userInt.map((inter)=> {
            inter.selected = false;
        });

        this.setState({ userInt, everySelected: true });

        const ctx = this.context;

        await fetch(`${ctx.API_URL}/qna/question`, {
            method: "GET",
            headers: {
                "token": ctx.token
            }
        })
        .then((res) => {
            return res.json();
        }).then((res) => {
            this.setState({ category: "#전체", AllPosts: res.posts, posts: res.posts.slice(0,5) });
        })
    }

    async handleButtons(idx) {
        let { userInt } = this.state;
        userInt.map((inter)=> {
            inter.selected = false;
        });

        userInt[idx].selected = true;
        
        this.setState({ userInt, everySelected: false });

        const ctx = this.context;
        var body = {};
        body.kind = "키워드";
        body.content = idx;

        await fetch(`${ctx.API_URL}/qna/question/search`, {
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
            this.setState({ category: "#"+this.state.categories[idx].name, AllPosts: res.posts, posts: res.posts.slice(0,5) });
        })
    }

    timeForToday(value) {
        const today = new Date();
        const timeValue = new Date(value);

        const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
        if (betweenTime < 1) return '방금전';
        if (betweenTime < 60) {
            return `${betweenTime}분전`;
        }

        const betweenTimeHour = Math.floor(betweenTime / 60);
        if (betweenTimeHour < 24) {
            return `${betweenTimeHour}시간전`;
        }

        const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
        if (betweenTimeDay < 365) {
            return `${betweenTimeDay}일전`;
        }

        return `${Math.floor(betweenTimeDay / 365)}년전`;
    }

    searchQNA() {
        if(this.state.qna == "") {
            Alert.alert( "오류", "검색어를 입력해주세요.", [ { text: "알겠습니다."} ]);
        }else {
            const ctx = this.context;
            var body = {};
            body.kind = this.state.qnaKind;
            this.setState({ searchCategory: "" });
            if(this.state.qnaKind === "키워드") {
                body.content = -1;
                for(var i = 0; i < this.state.categories.length; i++) {
                    if(this.state.categories[i].name === this.state.qna) {
                        body.content = this.state.categories[i].ID;
                        this.setState({ searchCategory: "#"+this.state.categories[i].name });
                        break;
                    }
                }
            }else {
                body.content = this.state.qna;
            }

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
                this.props.navigation.navigate("QnaList", {
                    user: this.state.user,
                    posts: res.posts,
                    categories: this.state.categories,
                    needUpdate: true,
                    category: this.state.searchCategory
                });
            }) 
        }
    }

    overlayClose() {
        this.setState({fieldSelectVisible: false});
    }

    fieldActivate(idx) {
        const { userInt } = this.state;
        const ctx = this.context;
        var body = {};
        body.Category_ID = idx;
    
        if(userInt[idx].activate*-1 === -1) {
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
                    userInt[idx].activate = userInt[idx].activate*-1;
                    this.setState({
                        userInt,
                    });
                }).then(() => {
                    for(var i = 0; i < this.state.categories.length; i++) {
                        ctx.userInt[i] = userInt[i].activate;
                    }
                });
        }else if(userInt[idx].activate*-1 === 1) {
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
                    userInt[idx].activate = userInt[idx].activate*-1;
                    this.setState({
                        userInt,
                    });
                }).then(() => {
                    for(var i = 0; i < this.state.categories.length; i++) {
                        ctx.userInt[i] = userInt[i].activate;
                    }
            });
        }
      }
    
    render() {
        if (!this.state.fontsLoaded) {
            return <View />;
          }
          return (
              <View style={styles.container}>
                    <Header {...this.props}/>


                {/* 글쓰기 버튼!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                {/* 글쓰기 버튼!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                { this.state.user.lawyer === 0 ?
                    <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('QaWrite', { categories: this.state.categories })}  >                       
                        <Image style={styles.writebuttonimg} source={require("../assets/writeButton.png")} />
                    </TouchableOpacity> : 
                    null
                }
                {/* 글쓰기 버튼!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                {/* 글쓰기 버튼!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
              
                

                {/* body */}
                {/* QA bar */}
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <Picker
                            selectedValue={this.state.qnaKind}
                            style={{ width: 110 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({qnaKind: itemValue})}
                        >
                            <Picker.Item label="분야" value="키워드" />
                            <Picker.Item label="제목" value="제목" />
                            <Picker.Item label="내용" value="내용" />
                        </Picker>
                        <TextInput 
                            placeholder="법률 Q&A를 검색해주세요"
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
                <ScrollView >
                    <View style={styles.body}>
                    {/* my news */}
                    {/* <View style={styles.myNews}>
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
                    </View> */}

                    {/* interest */}
                    <View style={{backgroundColor: "#EBEBEB", marginHorizontal: -20, marginTop: "5%" }}>
                        <View style={styles.interest}>
                            {/* <View style={styles.interestQ}>
                                <View style={styles.interestQ_header}>
                                    <Text style={styles.interestQ_header_title}>관심분야 우수 답변자</Text>
                                    
                                    <TouchableOpacity  onPress={() => this.setState({fieldSelectVisible: true})}>
                                        <Text style={styles.interestQ_header_text}>전체 보기</Text>
                                    </TouchableOpacity>
                                    <Image style={styles.more} source={require("../assets/more.png")} />
                                </View>

                                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.interestQ_content_tags}>
                                    
                                    {this.state.lawyers.map((lawyer, idx)=> {
                                        return(
                                            <View style={styles.interest_lawyer} key={idx}>
                                                <Image style={styles.interest_lawyer_pic} source={lawyer.url}/>
                                                <Text style={styles.interest_lawyer_name}>{lawyer.name}</Text>
                                            </View>
                                            // <TouchableOpacity  onPress={() => this.handleButtons(idx) } key={idx}>
                                            //     <Text style={inter.selected ? styles.interestQ_content_tags_tag_clicked : styles.interestQ_content_tags_tag}>{inter.name}</Text>
                                            // </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            </View> */}
                            

                            {/* interest question */}
                            <View style={styles.interestQ}>
                                <View style={styles.interestQ_header}>
                                    <Text style={styles.interestQ_header_title}>관심분야 질문</Text>
                                    
                                    <TouchableOpacity  onPress={() => { this.props.navigation.navigate("QnaList", { user: this.state.user, posts: this.state.AllPosts, categories: this.state.categories, needUpdate: true, category: this.state.category }); }}>
                                        <Text style={styles.interestQ_header_text}>전체 보기</Text>
                                    </TouchableOpacity>
                                    <Image style={styles.more} source={require("../assets/more.png")} />
                                </View>
                                <View style={{borderBottomColor: '#ebebeb', borderBottomWidth: 1, marginTop: 10}}/>
                                
                                <View style={styles.interestQ_content}>
                                   
                                        <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.interestQ_content_tags} contentContainerStyle={{ flexDirection: 'row' }}>
                                            <TouchableOpacity  onPress={() => { this.handleEveryButtons() }}>
                                                <Text style={this.state.everySelected ? styles.interestQ_content_tags_tag_clicked_every : styles.interestQ_content_tags_tag_every}>#전체</Text>
                                            </TouchableOpacity>
                                            {this.state.userInt.map((inter, idx) => {
                                                if(inter.activate === 1) {
                                                    return(
                                                    <TouchableOpacity  onPress={() => this.handleButtons(idx) } key={idx}>
                                                        <Text style={inter.selected ? styles.interestQ_content_tags_tag_clicked : styles.interestQ_content_tags_tag}>#{this.state.categories[idx].name}</Text>
                                                    </TouchableOpacity>);
                                                }
                                            })}
                                        </ScrollView>

                                        {/* 찐 질문 */}
                                        <View>
                                            {this.state.posts.length === undefined || this.state.posts.length === 0 ? <View style={styles.nolist}><Text>해당 분야의 QNA가 없습니다...</Text></View> :
                                            <View style={styles.yeslist}>
                                                {this.state.posts.map((post, idx) => {
                                                return(
                                                <View key={idx} style={{ marginTop: 2, }}>
                                                    <View style={styles.interestQ_content_question_field}>
                                                    {post.Question_has_Categories.map((tag, idx)=> {
                                                        return(
                                                            <Text style={styles.interestQ_content_question_field_text} key={idx}>{this.state.categories[tag.Category_ID].name}</Text>
                                                            )
                                                        })}
                                                    </View>
                                                    <TouchableOpacity onPress={()=> {this.setState({ needToReset: false }); this.props.navigation.navigate("QnaView", {post: post, categories: this.state.categories, date: this.timeForToday(post.writtenDate)})}}>
                                                        <View style={{alignItems: "flex-start"}}>
                                                            <Text style={styles.interestQ_content_question_title}>{post.title}</Text>
                                                            <Text style={styles.interestQ_content_question_content} numberOfLines={3}>{post.content}</Text>
                                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("QaAnswer", { post: post })} style={{marginBottom: "2%", marginTop: 5}}>
                                                                { this.state.user.lawyer === 0 ? null : <Text style={styles.interestQ_content_question_answer}>답변</Text> }
                                                            </TouchableOpacity>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                                )})}
                                            </View>
                                            }
                                        </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.interestQ_button}  onPress={() => {this.setState({ fieldSelectVisible: true })}}>
                    <Text style={styles.interestQ_buttonText}>내 관심분야 재설정 하기</Text>
                </TouchableOpacity>
                <Modal visible={this.state.fieldSelectVisible} onRequestClose={() => this.overlayClose()} transparent={true} animationType={"fade"}>
                    <View style={styles.fieldSelectModal}>
                        <View style={styles.fieldSelectContainer}>
                            <View style={styles.fieldSelectHeader}>
                                <Text style={styles.fieldModalText}>분야선택</Text>
                            </View>
                            <ScrollView>
                                <View style={styles.fieldRow}>
                                    <View style = {this.state.userInt[0] !== undefined && this.state.userInt[0].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(0)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/carAccident.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>자동차</Text>
                                    </View>
                                    <View style = {this.state.userInt[1] !== undefined && this.state.userInt[1].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(1)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/industrialAccident.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>산업재해</Text>
                                    </View>
                                    <View style = {this.state.userInt[2] !== undefined && this.state.userInt[2].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(2)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/environment.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>환경</Text>
                                    </View>
                                    <View style = {this.state.userInt[3] !== undefined && this.state.userInt[3].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(3)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/press.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>언론보도</Text>
                                    </View>
                                </View>
                                <View style={styles.fieldRow}>
                                    <View style = {this.state.userInt[4] !== undefined && this.state.userInt[4].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(4)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/intellectualProperty.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>지식재산권</Text>
                                    </View>
                                    <View style = {this.state.userInt[5] !== undefined && this.state.userInt[5].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(5)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/medical.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>의료</Text>
                                    </View>
                                    <View style = {this.state.userInt[6] !== undefined && this.state.userInt[6].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(6)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/construction.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>건설</Text>
                                    </View>
                                    <View style = {this.state.userInt[7] !== undefined && this.state.userInt[7].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(7)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/government.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>국가</Text>
                                    </View>
                                </View>
                                <View style={styles.fieldRow}>
                                    <View style = {this.state.userInt[8] !== undefined && this.state.userInt[8].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(8)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/etc.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>기타</Text>
                                    </View>
                                    <View style = {this.state.userInt[9] !== undefined && this.state.userInt[9].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(9)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/family.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>가족/가정</Text>
                                    </View>
                                    <View style = {this.state.userInt[10] !== undefined && this.state.userInt[10].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(10)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/divorce.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>이혼</Text>
                                    </View>
                                    <View style = {this.state.userInt[11] !== undefined && this.state.userInt[11].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(11)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/violence.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>폭행</Text>
                                    </View>
                                </View>
                                <View style={styles.fieldRow}>
                                    <View style = {this.state.userInt[12] !== undefined && this.state.userInt[12].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(12)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/fraud.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>사기</Text>
                                    </View>
                                    <View style = {this.state.userInt[13] !== undefined && this.state.userInt[13].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(13)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/sexualAssault.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>성범죄</Text>
                                    </View>
                                    <View style = {this.state.userInt[14] !== undefined && this.state.userInt[14].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(14)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/libel.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>명예훼손</Text>
                                    </View>
                                    <View style = {this.state.userInt[15] !== undefined && this.state.userInt[15].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(15)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/insult.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>모욕</Text>
                                    </View>
                                </View>
                                <View style={styles.fieldRow}>
                                    <View style = {this.state.userInt[16] !== undefined && this.state.userInt[16].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(16)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/threat.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>협박</Text>
                                    </View>
                                    <View style = {this.state.userInt[17] !== undefined && this.state.userInt[17].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(17)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/carAcci.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>교통사고</Text>
                                    </View>
                                    <View style = {this.state.userInt[18] !== undefined && this.state.userInt[18].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(18)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/contract.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>계약</Text>
                                    </View>
                                    <View style = {this.state.userInt[19] !== undefined && this.state.userInt[19].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(19)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/personalInformation.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>개인정보</Text>
                                    </View>
                                </View>
                                <View style={styles.fieldRow}>
                                    <View style = {this.state.userInt[20] !== undefined && this.state.userInt[20].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(20)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/inheritance.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>상속</Text>
                                    </View>
                                    <View style = {this.state.userInt[21] !== undefined && this.state.userInt[21].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(21)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/burglary.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>재산범죄</Text>
                                    </View>
                                    <View style = {this.state.userInt[22] !== undefined && this.state.userInt[22].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(22)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/trading.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>매매</Text>
                                    </View>
                                    <View style = {this.state.userInt[23] !== undefined && this.state.userInt[23].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(23)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/labor.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>노동</Text>
                                    </View>
                                </View>
                                <View style={styles.fieldRow}>
                                    <View style = {this.state.userInt[24] !== undefined && this.state.userInt[24].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(24)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/debtCollection.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>채권추심</Text>
                                    </View>
                                    <View style = {this.state.userInt[25] !== undefined && this.state.userInt[25].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(25)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/bankruptcy.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>회생/파산</Text>
                                    </View>
                                    <View style = {this.state.userInt[26] !== undefined && this.state.userInt[26].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(26)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/drug.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>마약/대마</Text>
                                    </View>
                                    <View style = {this.state.userInt[27] !== undefined && this.state.userInt[27].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(27)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/consumer.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>소비자</Text>
                                    </View>
                                </View>
                                <View style={styles.fieldRow}>
                                    <View style = {this.state.userInt[28] !== undefined && this.state.userInt[28].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(28)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/millitary.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>국방/병역</Text>
                                    </View>
                                    <View style = {this.state.userInt[29] !== undefined && this.state.userInt[29].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(29)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/school.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>학교</Text>
                                    </View>
                                    <View style = {this.state.userInt[30] !== undefined && this.state.userInt[30].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(30)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/housebreaking.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>주거침입</Text>
                                    </View>
                                    <View style = {this.state.userInt[31] !== undefined && this.state.userInt[31].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(31)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/service.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>도급/용역</Text>
                                    </View>
                                </View>
                                <View style={styles.fieldRow}>
                                    <View style = {this.state.userInt[32] !== undefined && this.state.userInt[32].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(32)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/realEstate.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>건설/부동산</Text>
                                    </View>
                                    <View style = {this.state.userInt[33] !== undefined && this.state.userInt[33].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(33)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/falseWitness.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>위증</Text>
                                    </View>
                                    <View style = {this.state.userInt[34] !== undefined && this.state.userInt[34].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(34)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/falseAccusation.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>무고죄</Text>
                                    </View>
                                    <View style = {this.state.userInt[35] !== undefined && this.state.userInt[35].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(35)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/juvenile.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>아동/{"\n"}청소년범죄</Text>
                                    </View>
                                </View>
                                <View style={styles.fieldRow}>
                                    <View style = {this.state.userInt[36] !== undefined && this.state.userInt[36].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(36)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/lease.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>임대차</Text>
                                    </View>
                                    <View style = {this.state.userInt[37] !== undefined && this.state.userInt[37].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(37)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/loan.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>대여금</Text>
                                    </View>
                                    <View style = {this.state.userInt[38] !== undefined && this.state.userInt[38].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(38)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/online.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>온라인범죄</Text>
                                    </View>
                                    <View style = {this.state.userInt[39] !== undefined && this.state.userInt[39].activate === -1 ? styles.fieldButtonContainerNonActive : styles.fieldButtonContainerActive}>
                                        <TouchableOpacity style={styles.fieldButton} onPress={() => {this.fieldActivate(39)}}>
                                        <Image style={styles.fieldImage} source={require("../assets/drunkDriving.png")} />
                                        </TouchableOpacity>
                                        <Text style={styles.fieldText}>음주운전</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        <TouchableOpacity style={styles.fieldSelectCancel} onPress={() => this.overlayClose()}>
                            <Text style={styles.fieldSelectCancelText}>확인</Text>
                        </TouchableOpacity>
                    </View>
              </Modal>
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

    searchSection:{
        alignItems:"center"
    },
    searchBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 50,
    },
    search : {
        width:30,
        height:30,
        marginBottom: 5
    },
    textInput : {
        fontSize: 16,
        fontFamily: "KPWDBold",
        fontWeight: "400",
        color: "#8D8D8D",
        width: 180,
    },
    underline : {
        width: 340,
        height: 5,
        backgroundColor: "#E7E7E7",
        marginLeft: 10,
        marginTop: -7,
        borderRadius: 30
    },

    writingButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: 1,
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


    interest_lawyer: {
        justifyContent: "space-evenly",
        alignItems: "center",
        marginRight: 15,
        marginBottom: "5%"
    },
    interest_lawyer_pic: {
        borderRadius: 100,
        width: 50,
        height: 50
    },
    interest_lawyer_name : {
        fontSize: 12,
        fontFamily: "KPWDMedium"
    },

    nolist: {
        height: 150,
        justifyContent: "center",
        alignItems: "center"
    },
    yeslist: {
    },

    interestQ_content_tags: {
        flexDirection: "row",
        overflow: "hidden",
        marginTop: "5%",
    },

    interestQ_content_tags_tag: {
        marginLeft: 20,
        color: "lightgray",
        fontFamily: "KPWDBold",
    },
    interestQ_content_tags_tag_clicked: {
        marginLeft: 20,
        fontFamily: "KPWDBold",
        color: "black"
    },
    interestQ_content_tags_tag_every: {
        color: "lightgray",
        fontFamily: "KPWDBold",
    },
    interestQ_content_tags_tag_clicked_every: {
        fontFamily: "KPWDBold",
        color: "black"
    },

    interestQ_content_question_field: {
        flexDirection: "row",
        marginTop: "4%"
    },

    interestQ_content_question_field_text: {
        color: "lightgray",
        marginRight: "5%",
        fontSize: 12,
        fontFamily: "KPWDBold"
    },

    interestQ_content_question_title: {
        fontSize: 15,
        fontFamily: "KPWDBold"
    },
    interestQ_content_question_content: {
        fontSize: 13,
        color: "#1d1d1d",
        fontFamily: "KPWDLight",
    },

    interestQ_content_question_answer: {
        fontFamily: "KPWDBold",
        fontSize: 13,
        alignSelf: "flex-start",
        color: colors.primary,
    },
    interestQ_button: {
        marginVertical: "5%",
        borderColor: colors.primary,
        borderRadius: 6,
        borderWidth: 2,
        paddingVertical: 3,
        paddingHorizontal: 80,
        alignSelf: "center"
    },
    interestQ_buttonText: {
        color: colors.primary,
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
        bottom: 70,
        right: 10,
        zIndex: 1,

        // backgroundColor: "yellow",
    }, 
    writebuttonimg: {
        width: 100,
        height: 100,
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
});

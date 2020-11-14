import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ToastAndroid,
  BackHandler,
} from "react-native";
import * as Font from "expo-font";
import { MyContext } from "../../context.js";
import Constants from "expo-constants";
import utils from "./Utils.js";
import {Picker} from '@react-native-community/picker';

import colors from "../config/colors";
import Header from "./Header.js";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { documentDirectory } from "expo-file-system";
import { TextInput } from "react-native-gesture-handler";


export default class Board extends Component {
    state = {
        BoardName: "",
        category: 0,
        Contents: [],
        isSearching: false,
        favCheck: [],
        search: "",
        searchCategory: "제목",
    };

    async _loadFonts() {
        await Font.loadAsync({
          SCDream8: require("../assets/fonts/SCDream8.otf"),
          KPWDBold: require("../assets/fonts/KPWDBold.ttf"),
          KPBRegular: require("../assets/fonts/KoPubBatang-Regular.ttf"),
        });
        this.setState({ fontsLoaded: true });
    }

    isFocused = () => {
        this.setState({ category: this.props.route.params.BoardCategory });
        if (this.props.route.params.BoardCategory == 0){
            this.setState({BoardName: "전체 게시판"});
        } else if (this.props.route.params.BoardCategory == 1){
            this.setState({BoardName: "앱 이용 후기 게시판"});
        } else if (this.props.route.params.BoardCategory == 2){
            this.setState({BoardName: "재판 후기 게시판"});
        } else if (this.props.route.params.BoardCategory == 3){
            this.setState({BoardName: "자유 게시판"});
        }
        this.getBoardContents();
    }

    handleBackButton = () => {

    }
        
    componentDidMount() {
       this._loadFonts();
       BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
       this.props.navigation.addListener('focus', this.isFocused);
    }
    
    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.isFocused);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentDidUpdate() {
    }

    async getBoardContents() {
        const ctx = this.context;
        
        if (this.props.route.params.BoardCategory == 0){
            fetch(`${ctx.API_URL}/boards/posts`, {
                method: "GET",
                headers: {
                    'token': ctx.token,
                },
            }).then((data) => {
                return data.json();
            }).then((result) => {
                this.setState({Contents : result}, () => {this.getFavPost()});
            });
        } else{
            fetch(`${ctx.API_URL}/boards/${this.props.route.params.BoardCategory}`, {
                method: "GET",
                headers: {
                    'token': ctx.token,
                },
            }).then((data) => {
                return data.json();
            }).then((result) => {
                this.setState({Contents : result}, () => {this.getFavPost()});
            });
        }
    }

    async getFavPost () {
        const ctx = this.context;
        
        fetch(`${ctx.API_URL}/user/favpost`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        }).then((res) =>{
            if (res.length == 0){
                console.error("no favorite Post");
                return;
            }
            let check = true;
            let checkList=[];
            for (let i=0; i < this.state.Contents.length; i++){
                check = true;
                for (let idx = 0; idx < res.length; idx++){
                    if (this.state.Contents[i].ID == res[idx].Board_ID){
                        checkList.push(true);
                        check = false;
                        break;
                    } 
                }

                if (check){
                    checkList.push(false);
                }
            }

            this.setState({favCheck:checkList})
        })
    }

    async onAddFav (boardID, idx) {
        const ctx = this.context;
        let data = {Board_ID: boardID};
        
        if (this.state.favCheck[idx]){
            fetch(`${ctx.API_URL}/user/favpost`,{
                method: "DELETE",
                headers: {
                    "token": ctx.token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            .then((res)=>{
                return res.json();
            })
            .then((res)=>{
                ToastAndroid.show("즐겨찾기 취소했습니다.", ToastAndroid.SHORT);
                this.getFavPost();
            })
            .catch((error) => {
                ToastAndroid.show("즐겨찾기 취소에 실패하였습니다...", ToastAndroid.SHORT);
                console.error(error);
            });
        }else{
            fetch(`${ctx.API_URL}/user/favpost`,{
                method: "POST",
                headers: {
                    "token": ctx.token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            .then((res)=>{
                return res.json();
            })
            .then((res)=>{
                ToastAndroid.show("즐겨찾기에 등록했습니다.", ToastAndroid.SHORT);
                this.getFavPost();
            })
            .catch((error) => {
                ToastAndroid.show("즐겨찾기 등록에 실패하였습니다...", ToastAndroid.SHORT);
                console.error(error);
            });
        }
    }
    
    searchSwitch = () => {
        this.setState(prevState => ({isSearching: !prevState.isSearching}), () =>{});
    }

    // POST	/boards/question/search	검색 기능을 제공하는 api입니다.	{ kind : string , content : string }
    
    async searchBoard() {
        if(this.state.serach == "") {
            Alert.alert( "오류", "검색어를 입력해주세요.", [ { text: "알겠습니다."} ]);
        }else {
            const ctx = this.context;
            var body = {};
            body.kind = this.state.searchCategory;
            body.content = this.state.search;
            
            await fetch(`${ctx.API_URL}/boards/posts/search`, {
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
                this.setState({Contents: res})
            }).catch((error) =>{
                console.error(error);
            })
        }
    }

    async contentDetail(content) {
        this.props.navigation.navigate("BoardDetail", {post: content});
    }

    render() {
        const isSearching = this.state.isSearching;

        let boardHead = null;
        if (!isSearching){
            boardHead = styles.boardHead;
        } else {
            boardHead = styles.boardHeadSearching;
        }


        return (
            <View style={styles.container}>
                <Header {...this.props}/>
                <TouchableOpacity style={styles.button} onPress={()=>this.props.navigation.navigate('BoardWrite', {category: this.state.category})} >                       
                        <Image style={styles.writebuttonimg} source={require("../assets/writeButton.png")} />
                </TouchableOpacity>
                <View style={styles.board}>
                    <View style={styles.boardHeader}>
                        { !this.state.isSearching ?
                            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                                <Text style={styles.boardTitle}>{this.state.BoardName}</Text> 
                                <TouchableOpacity onPress={() => {this.searchSwitch()}}>
                                    <Image source={require("../assets/search.png")} style={styles.search} />
                                </TouchableOpacity>
                            </View> :
                            <View style= {{flexDirection:"row", alignItems: "center"}}>
                                <TouchableOpacity style={{flex:1}} onPress={() => {this.searchSwitch()}}>
                                    <Image source={require("../assets/search.png")} style={styles.search} />
                                </TouchableOpacity>
                                <View style={{flexDirection:"row", flex:5, justifyContent:"space-between"}}>
                                    <TextInput 
                                    placeholder="검색어를 입럭하세요"
                                    style={[styles.textInput, {left: 10, paddingRight:10, borderWidth:3, borderRadius:5, borderStyle:"solid", borderColor: '#ffffff'}]}
                                    value={this.state.search}
                                    onChangeText={(search) => this.setState({ search })}
                                    onSubmitEditing={() => {this.searchBoard()}}
                                    returnKeyType="search"
                                    onBlur={e => {this.searchBoard()}}
                                    />
                                    <Picker
                                    mode='dropdown'
                                    selectedValue={this.state.searchCategory}
                                    style={{width:100}}
                                    onValueChange={(itemValue, itemIndex) => this.setState({searchCategory: itemValue}, ()=>this.searchBoard())}>
                                        <Picker.Item label="제목" value={"제목"} />
                                        <Picker.Item label="내용" value={"내용"} />
                                    </Picker>
                                </View>

                            </View>
                        }
                    </View>
                </View>
                <ScrollView style={styles.boardContents}>
                    {this.state.Contents.map((content, idx) => {
                        return(
                            <View style={styles.content} key={idx}>
                                <TouchableOpacity onPress={() => this.contentDetail(content )}>
                                    <Text style={styles.contentTitle}>{content.title} </Text>
                                    <Text style={styles.contentBody} numberOfLines={3}> {content.content} </Text>
                                </TouchableOpacity>
                                <View style={styles.contentInfo}>
                                    <View style={styles.writerInfo}>
                                        <Text style={styles.writeDate}> {utils.dateAgo(content.writtenDate)} </Text>
                                        <Text style={styles.writer}> {utils.nameHide(content.User.userID)} </Text>
                                    </View>
                                    {
                                        this.state.favCheck[idx] ? 
                                        <TouchableOpacity style={styles.scrapViewInfo} onPress={()=>this.onAddFav(content.ID, idx)}>
                                            <Image source={require("../assets/yellowStar.png")} style={styles.scrapImage} />
                                            <Text style={styles.viewNumber}> {content.views} </Text>
                                        </TouchableOpacity> :
                                        <TouchableOpacity style={styles.scrapViewInfo} onPress={()=>this.onAddFav(content.ID, idx)}>
                                            <Image source={require("../assets/graystar.png")} style={styles.scrapImage} />
                                            <Text style={styles.viewNumber}> {content.views} </Text>
                                        </TouchableOpacity> 
                                    }
                                </View>
                                <View style={styles.thinUnderline}></View>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        );
    }
}
Board.contextType = MyContext;

const styles=StyleSheet.create({
    body: {
        paddingLeft:"5%",
        paddingRight:"5%",
      },
    container: {
        flex: 1,
        marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
        backgroundColor: "#fff",
    },
    board: {
        paddingLeft: "7%",
        paddingRight: "7%",
        paddingTop: "10%",
    },
    boardHeader: {
        marginBottom: 40,
        height: 30,
    },
    boardHeaderSearching: {
        flexDirection:"row",
        marginBottom: "10%",
        marginBottom: 20,
        height: 30,
    },
    boardTitle: {
        fontFamily: "KPWDBold",
        fontSize: 18,
    },
    contentTitle: {
        fontFamily: "KPWDMedium",
        fontSize: 16,
        marginBottom: 2,
    },
    search : {
        width:30,
        height:30,
    },
    boardContents: {
        overflow: "scroll",
        paddingLeft: "5%",
        paddingRight: "5%",
    },
    content: {
        paddingLeft: "3%",
        paddingRight: "3%",
        marginBottom: 30,
    },
    contentBody: {
        fontFamily: "KPWDMedium",
        fontSize: 12,
        color: "#BCBCBC",
        overflow: "hidden",
        marginBottom: 5,
    },
    contentInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    writerInfo: {
        flexDirection: "row",
    },
    scrapViewInfo: {
        flexDirection: "row",
    },
    writeDate: {
        fontFamily: "SCDream8",
        fontSize: 12,
        color: "#EDEDED",
    },
    writer: {
        fontFamily: "SCDream8",
        fontSize: 12,
        color: "#EDEDED",
    },
    scrapImage: {
        width: 15,
        height: 15,
        opacity: 0.8,
        right: 10,
    },
    viewNumber: {
        fontFamily: "SCDream8",
        fontSize: 12,
        color: "#EDEDED",
    },
    thinUnderline : {
        paddingLeft: "0%",
        paddingRight: "0%",
        height: 1,
        backgroundColor: "#E7E7E7",
        alignSelf: "center",
        borderRadius: 10,
    },
    button: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 1,
    }, 
    writebuttonimg: {
        width: 100,
        height: 100,
    },
    textInput : {
        fontSize: 16,
        fontFamily: "KPWDBold",
        fontWeight: "400",
        color: "#8D8D8D",
        // width: 180,
    },
    starImage: {
        width: 30,
        height: 30,
        alignSelf:"center",
        padding: 0,
        margin: "1%",
        marginTop: "70%",
    },
});
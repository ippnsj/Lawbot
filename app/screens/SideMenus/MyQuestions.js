import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Image,
  } from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import { MyContext } from '../../../context.js';
import colors from "../../config/colors";
import Header from "../Header.js";

export default class MyQuestions extends Component{
    state = {
        fontsLoaded: false,
        listExist: false,
        qnaList:[],
        token: '',
        qnaCategoryList:[],
        categories:[],
        refreshing: false,
    }

    async _loadFonts() {
        await Font.loadAsync({
            SCDream8: require("../../assets/fonts/SCDream8.otf"),
            KPWDBold: require("../../assets/fonts/KPWDBold.ttf"),
            KPWDMedium: require("../../assets/fonts/KPWDMedium.ttf"),
            KPWDLight: require("../../assets/fonts/KPWDLight.ttf")
        });
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFonts();
        const ctx = this.context;
        let categoryList = [];
        fetch(`${ctx.API_URL}/qna/category`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        }).then((res) => {
            return res.json();
        }).then((res)=>{
            for (let j=0; j<res.length; j++){
                categoryList.push(String(res[j].name));
            }
        })
        .catch((error) => {
            console.error(error);
        });
        this.setState({categories:categoryList, token: ctx.token});

        fetch(`${ctx.API_URL}/user/myquestion`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((res) =>{   
            let qnaList = [];
            let qnaCategoryList = [];
            for (let i=0; i<res.length; i++){
                qnaList.push(res[i]);
                let indivCategoryList = [];
                if (res[i].Question_has_Categories === []){
                    qnaCategoryList.push(indivCategoryList);
                }else{
                    let indivCategory = "";
                    let ji = 0;
                    for (ji=1; ji<=res[i].Question_has_Categories.length; ji++){
                        let j = ji-1
                        let index = res[i].Question_has_Categories[j].Category_ID;
                        indivCategory+= "#" +(this.state.categories[index])+ "   ";
                        if ((ji % 4 === 0)&&(ji !== 0)){
                            indivCategoryList.push(indivCategory);
                            indivCategory = "";
                        }
                    }
                    if (indivCategory != ""){
                        indivCategoryList.push(indivCategory);
                    }
                    qnaCategoryList.push(indivCategoryList);
                }          
            }
            let exist = false;
            if (res.length!= 0){    
                exist = true;
            }
            this.setState({listExist: exist, qnaList:qnaList,qnaCategoryList:qnaCategoryList});
        })
        .catch((error) => {
            console.error(error);
        });
    }
    componentDidUpdate(){
        const ctx = this.context;
        if((this.state.token != ctx.token && ctx.token != '')){
            fetch(`${ctx.API_URL}/user/myquestion`, {
                method: "GET",
                headers: {
                    "token": ctx.token
                },
            })
            .then((res) => {
                return res.json();
            })
            .then((res) =>{   
                let qnaList = [];
                let qnaCategoryList = [];
                for (let i=0; i<res.length; i++){
                    qnaList.push(res[i]);
                    let indivCategoryList = [];
                    if (res[i].Question_has_Categories === []){
                        qnaCategoryList.push(indivCategoryList);
                    }else{
                        let indivCategory = "";
                        let ji = 0;
                        for (ji=1; ji<=res[i].Question_has_Categories.length; ji++){
                            let j = ji-1
                            let index = res[i].Question_has_Categories[j].Category_ID;
                            indivCategory+= "#" +(this.state.categories[index])+ "   ";
                            if ((ji % 4 === 0)&&(ji !== 0)){
                                indivCategoryList.push(indivCategory);
                                indivCategory = "";
                            }
                        }
                        if (indivCategory != ""){
                            indivCategoryList.push(indivCategory);
                        }
                        qnaCategoryList.push(indivCategoryList);
                    }          
                }
                let exist = false;
                if (res.length!= 0){    
                    exist = true;
                }
                this.setState({token: ctx.token,listExist: exist, qnaList:qnaList,qnaCategoryList:qnaCategoryList});
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }
    _onRefresh = ()=>{
        this.setState({refreshing: true}, ()=>this.read());
    }
    read(){
        const ctx = this.context;
        fetch(`${ctx.API_URL}/user/myquestion`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((res) =>{   
            let qnaList = [];
            let qnaCategoryList = [];
            for (let i=0; i<res.length; i++){
                qnaList.push(res[i]);
                let indivCategoryList = [];
                if (res[i].Question_has_Categories === []){
                    qnaCategoryList.push(indivCategoryList);
                }else{
                    let indivCategory = "";
                    let ji = 0;
                    for (ji=1; ji<=res[i].Question_has_Categories.length; ji++){
                        let j = ji-1
                        let index = res[i].Question_has_Categories[j].Category_ID;
                        indivCategory+= "#" +(this.state.categories[index])+ "   ";
                        if ((ji % 4 === 0)&&(ji !== 0)){
                            indivCategoryList.push(indivCategory);
                            indivCategory = "";
                        }
                    }
                    if (indivCategory != ""){
                        indivCategoryList.push(indivCategory);
                    }
                    qnaCategoryList.push(indivCategoryList);
                }          
            }
            let exist = false;
            if (res.length!= 0){    
                exist = true;
            }
            if (this.state.refreshing){
                this.setState({listExist: exist, qnaList:qnaList,qnaCategoryList:qnaCategoryList, refreshing: false});
            }else{
                this.setState({listExist: exist, qnaList:qnaList,qnaCategoryList:qnaCategoryList});
            }
            
        })
        .catch((error) => {
            console.error(error);
        });
    }
    render(){
        if (!this.state.fontsLoaded) {
            return <View />;
        }
        return (
            <View style={styles.container}>
                <Header {...this.props}/>
                <View style = {styles.body}>
                    <View style={styles.titleContainer}>
                        <Text style = {styles.title}>내가 업로드한 질문</Text>
                        <View style={styles.underbar} />
                    </View>
                    {!this.state.listExist ? <View style={styles.nolist} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                          }><Text style={styles.nolistText}>업로드한 질문이 없습니다...</Text></View> :
                        <ScrollView style={styles.yeslist} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                          }>
                            {this.state.qnaList.map((qna, idx)=>{
                                return (
                                    <View key={idx} style = {styles.caseTopContainer}>
                                        <TouchableOpacity style = {styles.indivContainer} 
                                        onPress={()=> this.props.navigation.navigate("QnaView", {post: qna, categories: this.state.categories, date: this.timeForToday(qna.writtenDate)})}>
                                            <View style = {styles.caseContainer}>
                                                <Text style={styles.caseID}>{qna.title}</Text>
                                                {qna.content.length>20 ?
                                                <Text style= {styles.caseName}>{qna.content.slice(0, 20)+"..."}</Text>:
                                                <Text style= {styles.caseName}>{qna.content.slice(0, 20)}</Text>}
                                                {
                                                    this.state.qnaCategoryList[idx].map((keytags, id)=>{
                                                        return(
                                                            <Text key={id} style={styles.keywordsText}>{keytags}</Text>
                                                        );
                                                    })
                                                }
                                                <View style= {styles.commentContainer}>
                                                    <Text style= {styles.date}>{qna.writtenDate.slice(0,10)+" "+qna.writtenDate.slice(11, 16)}</Text>
                                                    <Image source={require("../../assets/view.png")} style={styles.lawyerImage} />
                                                    <Text style= {styles.commentCount}>{(qna.views)}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    }
                </View>
            </View>
        );
    }
}
MyQuestions.contextType = MyContext;
const styles = StyleSheet.create({
    body: {
      flex: 12,
      overflow: "scroll",
      backgroundColor: "#fff",
    },
    container: {
      flex: 1,
      marginTop: Platform.OS === `ios` ? 0 : Constants.statusBarHeight,
    },
    title:{
        fontFamily: "KPWDBold",
        fontSize: 18,
        marginLeft: "5%",
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingBottom: "3%",
        paddingTop : "2%",
        marginTop: "5%",
    },
    underbar: {
        position: "absolute",
        width: "80%",
        height: 3,
        backgroundColor: "#E7E7E7",
        marginTop : "0%",
        marginLeft: "10%",
    },
    nolist: {
        alignSelf: "center",
        width: "100%", 
        height: "100%",
    },
    nolistText:{
        fontSize:20,
        alignSelf : "center",
        marginTop: "60%"
    },
    yeslist: {
        paddingTop: 10,
        width: "100%", 
        height: "100%",
        alignSelf: "center",
    },
    caseContainer: {
        width: "100%",
        height: "40%",
        padding: "2%",
        paddingLeft: "1%",
        marginRight: 0,
    },
    caseTopContainer:{
        borderTopColor:"#DDDDDD",
        borderTopWidth: 1,
        flexDirection:"row",
        justifyContent:"space-between",      
        padding:20,
        paddingTop:5,
        paddingBottom:5,
    },
    caseID: {
        fontFamily: "KPWDMedium",
        color: "#000000",
        fontSize: 16,
        marginRight:"3%"
    },
    caseName:{
        fontFamily: "KPWDMedium",
        fontSize: 13,
        color: "#8D8D8D",
    },
    starImage: {
        width: 30,
        height: 30,
        alignSelf:"center",
        padding: 0,
        margin: "1%",
        marginTop: "70%",
    },
    indivContainer:{
        flexDirection:"row",
        justifyContent:"flex-start",
    },
    keywordsText: {
        fontFamily: "KPWDBold",
        fontSize: 12,
        paddingTop: "1%",
        color: colors.primary,
    },
    lawyerImage: {
        width: 15,
        height: 15,
        margin: 5,
        marginLeft: "2%",
        alignSelf: "center",
        marginBottom:"1%",
        marginTop:"0%",
    },
    commentContainer:{
        flexDirection:"row",
        justifyContent:"flex-start",
    },
    commentCount:{
        fontFamily: "KPWDLight",
        fontSize: 13,
        color: "#000000",
    },
    date:{
        fontFamily: "KPWDLight",
        fontSize: 13,
        color: "#000000",
    }
});
import React, {Component}from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    RefreshControl,
  } from "react-native";
import * as Font from "expo-font";
import Constants from "expo-constants";
import { MyContext } from '../../../context.js';
import colors from "../../config/colors";
import Header from "../Header.js";

export default class FavLawyer extends Component {
    state = {
        fontsLoaded: false,
        listExist: false,
        lawyers:{},
        categories:[],
        lawyerCategories:{},
        token: '',
        favCheck:[],
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
    isFocused = () => {
        this.read();
    }

    async componentDidMount() {
        this._loadFonts();
        this.props.navigation.addListener('focus', this.isFocused);
        const ctx = this.context;
        let categoryList = [];
        await fetch(`${ctx.API_URL}/qna/category`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((res)=>{
            for (let j=0; j<res.length; j++){
                categoryList.push(String(res[j].name));
            }
        })
        .catch((error) => {
            console.error(error);
        });
        this.setState({categories:categoryList, token: ctx.token});
        
        fetch(`${ctx.API_URL}/user/favlawyer`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((res) =>{
            let lawyerList = [];
            let lawyerCategoryList = [];
            let favCheckList = [];
            for (let i=0; i<res.length; i++){
                // console.log(res[i]);
                lawyerList.push(res[i]);
                favCheckList.push(true);
                let indivCategoryList = [];
                if (res[i].Lawyer.LawyerFields === []){
                    lawyerCategoryList.push(indivCategoryList);
                }else{
                    let indivCategory = "";
                    let ji = 0;
                    for (ji=1; ji<=res[i].Lawyer.LawyerFields.length; ji++){
                        let j = ji -1;
                        let index = res[i].Lawyer.LawyerFields[j].Category_ID;
                        indivCategory+= "#" +(this.state.categories[index])+ "   ";
                        if ((ji % 3 === 0)&&(j !== 0)){
                            indivCategoryList.push(indivCategory);
                            indivCategory = "";
                        }
                    }
                    if (indivCategory != ""){
                        indivCategoryList.push(indivCategory);
                    }
                    lawyerCategoryList.push(indivCategoryList);
                }          
            }
            let exist = false;
            if (res.length!= 0){    
                exist = true;
            }
            this.setState({listExist: exist, lawyers:lawyerList,lawyerCategories:lawyerCategoryList, favCheck:favCheckList}); 
        })
        .catch((error) => {
            console.error(error);
        });
    }
    async componentDidUpdate(){
        const ctx = this.context;
        if(this.state.token != ctx.token && ctx.token != ''){
            fetch(`${ctx.API_URL}/user/favlawyer`, {
                method: "GET",
                headers: {
                    "token": ctx.token
                },
            })
            .then((res) => {
                return res.json();
            })
            .then((res) =>{
                let lawyerList = [];
                let lawyerCategoryList = [];
                let favCheckList = [];
                for (let i=0; i<res.length; i++){
                    lawyerList.push(res[i]);
                    favCheckList.push(true);
                    let indivCategoryList = [];
                    if (res[i].Lawyer.LawyerFields === []){
                        lawyerCategoryList.push(indivCategoryList);
                    }else{
                        let indivCategory = "";
                        let ji = 0;
                        for (ji=1; ji<=res[i].Lawyer.LawyerFields.length; ji++){
                            let j = ji -1;
                            let index = res[i].Lawyer.LawyerFields[j].Category_ID;
                            indivCategory+= "#" +(this.state.categories[index])+ "   ";
                            if ((ji % 3 === 0)&&(j !== 0)){
                                indivCategoryList.push(indivCategory);
                                indivCategory = "";
                            }
                        }
                        if (indivCategory != ""){
                            indivCategoryList.push(indivCategory);
                        }
                        lawyerCategoryList.push(indivCategoryList);
                    }          
                }
                let exist = false;
                if (res.length!= 0){    
                    exist = true;
                }
                this.setState({token: ctx.token, listExist: exist, lawyers:lawyerList,lawyerCategories:lawyerCategoryList, favCheck:favCheckList});
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }
    changeFav(idx){
        let favCheckList = [];
        for (let j=0; j<this.state.favCheck.length; j++){
            if (j === idx){
                const ctx = this.context;
                if (this.state.favCheck[j]){
                    let a = {};
                    a.Lawyer_ID = this.state.lawyers[j].Lawyer_ID;
                    fetch(`${ctx.API_URL}/user/favlawyer`,{
                        method: "DELETE",
                        headers: {
                            "token": ctx.token,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(a),
                    })
                    .then((res)=>{
                        return res.json();
                    })
                    .then((json)=>{
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                }else{
                    let a = {};
                    a.Lawyer_ID = this.state.lawyers[j].Lawyer_ID;
                    fetch(`${ctx.API_URL}/user/favlawyer`,{
                        method: "POST",
                        headers: {
                            "token": ctx.token,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(a),
                    })
                    .then((res)=>{
                        return res.json();
                    })
                    .then((json)=>{
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                }
                this.state.favCheck[j] = !this.state.favCheck[j];
            }
            favCheckList.push(this.state.favCheck[j]);
        }
        this.setState({favCheck:favCheckList});
    }
    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.isFocused);
    }

    _onRefresh = ()=>{
        this.setState({refreshing: true}, ()=>this.read());
    }

    read(){
        const ctx = this.context;
        fetch(`${ctx.API_URL}/user/favlawyer`, {
            method: "GET",
            headers: {
                "token": ctx.token
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((res) =>{
            let lawyerList = [];
            let lawyerCategoryList = [];
            let favCheckList = [];
            let exist = false;
            for (let i=0; i<res.length; i++){
                exist = true;
                lawyerList.push(res[i]);
                favCheckList.push(true);
                let indivCategoryList = [];
                if (res[i].Lawyer.LawyerFields === []){
                    lawyerCategoryList.push(indivCategoryList);
                }else{
                    let indivCategory = "";
                    let ji = 0;
                    for (ji=1; ji<=res[i].Lawyer.LawyerFields.length; ji++){
                        let j = ji -1;
                        let index = res[i].Lawyer.LawyerFields[j].Category_ID;
                        indivCategory+= "#" +(this.state.categories[index])+ "   ";
                        if ((ji % 3 === 0)&&(j !== 0)){
                            indivCategoryList.push(indivCategory);
                            indivCategory = "";
                        }
                    }
                    if (indivCategory != ""){
                        indivCategoryList.push(indivCategory);
                    }
                    lawyerCategoryList.push(indivCategoryList);
                }          
            }
            if (this.state.refreshing){
                this.setState({listExist: exist, lawyers:lawyerList,lawyerCategories:lawyerCategoryList, favCheck:favCheckList, refreshing: false});
            }else{
                this.setState({listExist: exist, lawyers:lawyerList,lawyerCategories:lawyerCategoryList, favCheck:favCheckList});
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }
    async goToLawyerPage(lawyer){
        const ctx = this.context;
        // console.log(lawyer);
        let newAnswers;
        await fetch(`${ctx.API_URL}/lawyer/answer/${lawyer.Lawyer_ID}`, {
            method: "GET",
            headers: {
                'token': ctx.token,
            },
        }).then((result) => {
            return result.json();
        }).then((result) => {
            // console.log(result);
            newAnswers=result;
            // this.setState({ token: ctx.token, user: result });
        });
        
        this.props.navigation.navigate('Lawyer', {id : lawyer.Lawyer_ID, lawyer:lawyer.Lawyer, answers: newAnswers});
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
                        <Text style = {styles.title}>변호사 즐겨찾기</Text>
                        <View style={styles.underbar} />
                    </View>
                    {!this.state.listExist ? <ScrollView style={styles.nolist} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                          }><Text style={styles.nolistText} >즐겨찾기한 변호사가 없습니다...</Text></ScrollView> :
                        <ScrollView style={styles.yeslist} refreshControl={
                            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
                          }>
                            {this.state.lawyers.map((lawyer, idx)=>{
                                if (this.state.lawyerCategories[idx] === []){
                                    this.state.lawyerCategories[idx] = [];
                                }
                                if (lawyer.Lawyer.companyName=== null){
                                    lawyer.Lawyer.companyName= "법인 등록 안됨."
                                }
                                if (lawyer.Lawyer.companyPhone === null){
                                    lawyer.Lawyer.companyPhone= "등록 안됨."
                                }
                                if (lawyer.Lawyer.User.introduction === null){
                                    lawyer.Lawyer.User.introduction = "소개가 없습니다."
                                }
                                return (
                                    <View key={idx} style = {styles.caseTopContainer}>
                                        <TouchableOpacity style = {styles.indivContainer} 
                                        onPress={() => this.goToLawyerPage(lawyer)}>
                                        <Image source={{ uri: `${lawyer.Lawyer.User.photo}?random=${new Date()}`}}style={styles.lawyerImage} />
                                        <View style = {styles.caseContainer}>
                                            <Text style={styles.caseID}>{lawyer.Lawyer.User.name+ " 변호사"}</Text>
                                            <Text style={styles.caseName}>{lawyer.Lawyer.companyName}</Text>
                                            <Text style={styles.date}>{lawyer.Lawyer.User.phone}</Text>
                                            {
                                                this.state.lawyerCategories[idx].map((keytags, id)=>{
                                                    return(
                                                        <Text key={id} style={styles.keywordsText}>{keytags}</Text>
                                                    );
                                                })
                                            }
                                        </View>
                                        </TouchableOpacity>
                                        {
                                            !this.state.favCheck[idx] ? 
                                            <TouchableOpacity  onPress={()=>this.changeFav(idx)}>
                                                <Image source={require("../../assets/graystar.png")} style={styles.starImage} />
                                            </TouchableOpacity> :
                                            <TouchableOpacity onPress={()=>this.changeFav(idx)}>
                                                <Image source={require("../../assets/yellowStar.png")} style={styles.starImage} />
                                            </TouchableOpacity>
                                        }
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
FavLawyer.contextType = MyContext;
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
    indivContainer:{
        flexDirection:"row",
        justifyContent:"flex-start",
    },
    caseTopContainer:{
        borderTopColor:"#DDDDDD",
        borderTopWidth:1,
        flexDirection:"row",
        justifyContent:"space-between",      
        padding:20,
        paddingTop:0,
        paddingBottom:5,
    },
    caseContainer: {
        width: "60%",
        height: "20%",
        padding: "5%",
        margin: "1%",
        marginRight : 0,
    },
    caseID: {
        fontFamily: "KPWDMedium",
        color: "#000000",
        fontSize: 16,
    },
    caseName:{
        fontFamily: "KPWDMedium",
        fontSize: 13,
        color: "#8D8D8D",
    },
    keywordsText: {
        fontFamily: "KPWDBold",
        fontSize: 12,
        paddingTop: "1%",
        color: "#9E1A1A",
    },
    introText:{
        fontFamily:"KPWDLight",
        fontSize: 13,
        color: "#5C5353",
    },
    lawyerImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf:"center",
        margin: 10,
    },
    userApply:{
        flexDirection:"row",
        justifyContent:"flex-end",
        alignContent:"flex-start",
    },
    starImage: {
        width: 30,
        height: 30,
        alignSelf:"center",
        padding: 0,
        margin: "1%",
        marginTop: "120%",
    },
    confirm:{
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 5,
        width: "15%",
        alignItems: "center",
        paddingVertical: "0.5%",
        marginRight : "3%",
        marginBottom: 0,
    },
    submitText: {
        fontSize: 15,
        color: colors.primary,
        fontFamily: "KPWDBold",
    },
    date:{
        fontFamily: "KPWDLight",
        fontSize: 13,
        color: "#000000",
    }
});
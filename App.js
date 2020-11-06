import React, { Component } from "react";
import { AsyncStorage, View } from 'react-native';
import WelcomeScreen from "./app/screens/WelcomeScreen";
import Home from "./app/screens/Home"
import Enrollment from "./app/screens/Enrollment";
import WritePettition from "./app/screens/WritePettition";
import SimilarCaseAnalysis from "./app/screens/SimilarCaseAnalysis";
import TerminologyExplanation from "./app/screens/TerminologyExplanation";
import CaseView from "./app/screens/CaseView";
import QnaList from "./app/screens/QnaList";
import QaLawyer from "./app/screens/QaLawyer";
import QaUser from "./app/screens/QaUser";
import QaWrite from "./app/screens/QaWrite";
import QaAnswer from "./app/screens/QaAnswer";
import QnaView from "./app/screens/QnaView";
import SideMenu from "./app/screens/SideMenu";
import MyPage from "./app/screens/MyPage";
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MyContext, PRODUCTION_URL } from './context.js';

// const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default class App extends Component {
  state = {
    url: PRODUCTION_URL,
    token: '',
    firstPage: "WelcomeScreen",
    loaded: false,
  };

  updateToken = (new_token) => {
    this.setState({ // React
      token: new_token,
    });
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('auth.accessToken');
    if(token) {
      fetch(`${this.state.url}/login/check`, {
        method: "POST",
        headers: {
          'token': token,
        }
      }).then(res => {
        return res.json();
      }).then(res => {
        if(res.success) {
          this.setState({
            token: token,
            firstPage: "Home",
          })
        }

        this.setState({
          loaded: true,
        })
      });
    } else {
      this.setState({
        loaded: true,
      })
    }
  }

  render() {
    if(!this.state.loaded) {
      return (<View></View>);
    }

    return (
      <MyContext.Provider value={{
        API_URL: this.state.url,
        token: this.state.token,
        updateToken: this.updateToken,
      }}>
        <NavigationContainer>
          {/* <Stack.Navigator initialRouteName={this.state.firstPage}>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Enrollment" component={Enrollment} options={{ headerShown: false }} />
            <Stack.Screen name="WritePettition" component={WritePettition} options={{ headerShown: false }} />
            <Stack.Screen name="SimilarCaseAnalysis" component={SimilarCaseAnalysis} options={{ headerShown: false }} />
            <Stack.Screen name="TerminologyExplanation" component={TerminologyExplanation} options={{ headerShown: false }} />
            <Stack.Screen name="CaseBefore" component={CaseBefore} options={{ headerShown: false }} />
            <Stack.Screen name="CaseView" component={CaseView} options={{ headerShown: false }} />
            <Stack.Screen name="QnaList" component={QnaList} options={{ headerShown: false }} />
            <Stack.Screen name="QnA" component={QnA} options={{ headerShown: false }} />
            <Stack.Screen name="QaLawyer" component={QaLawyer} options={{ headerShown: false }} />
            <Stack.Screen name="QaAnswer" component={QaAnswer} options={{ headerShown: false }} />
            <Stack.Screen name="QaUser" component={QaUser} options={{ headerShown: false }} />
            <Stack.Screen name="QaWrite" component={QaWrite} options={{ headerShown: false }} />
            <Stack.Screen name="QnaView" component={QnaView} options={{ headerShown: false }} />
          </Stack.Navigator> */}
          <Drawer.Navigator drawerContent={(props) => <SideMenu {...props}/>} initialRouteName={this.state.firstPage} hideStatusBar>
            <Drawer.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
            <Drawer.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Drawer.Screen name="Enrollment" component={Enrollment} options={{ headerShown: false }} />
            <Drawer.Screen name="WritePettition" component={WritePettition} options={{ headerShown: false }} />
            <Drawer.Screen name="SimilarCaseAnalysis" component={SimilarCaseAnalysis} options={{ headerShown: false }} />
            <Drawer.Screen name="TerminologyExplanation" component={TerminologyExplanation} options={{ headerShown: false }} />
            <Drawer.Screen name="CaseView" component={CaseView} options={{ headerShown: false }} />
            <Drawer.Screen name="QnaList" component={QnaList} options={{ headerShown: false }} />
            <Drawer.Screen name="QaLawyer" component={QaLawyer} options={{ headerShown: false }} />
            <Drawer.Screen name="QaAnswer" component={QaAnswer} options={{ headerShown: false }} />
            <Drawer.Screen name="QaUser" component={QaUser} options={{ headerShown: false }} />
            <Drawer.Screen name="QaWrite" component={QaWrite} options={{ headerShown: false }} />
            <Drawer.Screen name="QnaView" component={QnaView} options={{ headerShown: false }} />
            <Drawer.Screen name="MyPage" component={MyPage} options={{ headerShown: false }} />
          </Drawer.Navigator>
        </NavigationContainer>
      </MyContext.Provider>
    )
  }
}

import React, { Component } from "react";
import { AsyncStorage } from 'react-native';
import WelcomeScreen from "./app/screens/WelcomeScreen";
import Home from "./app/screens/Home"
import Enrollment from "./app/screens/Enrollment";
import WritePettition from "./app/screens/WritePettition";
import SimilarCaseAnalysis from "./app/screens/SimilarCaseAnalysis";
import TerminologyExplanation from "./app/screens/TerminologyExplanation";
import CaseBefore from "./app/screens/CaseBefore";
import CaseView from "./app/screens/CaseView";
import QnA from "./app/screens/QnA";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MyContext, PRODUCTION_URL } from './context.js';

const Stack = createStackNavigator();

export default class App extends Component {
  state = {
    url: PRODUCTION_URL,
    token: '',
    firstPage: "WelcomeScreen",
  };

  // updateToken() {
  //   this.setState({}); // class App
  // }

  updateToken = (new_token) => {
    this.setState({ // React
      token: new_token,
    })
  }

  async componentDidMount() {
    try {
      const token = await AsyncStorage.getItem('auth.accessToken');
      if(token) {
        // fetch(`${this.state.API_URL}/login/check`, {
        //   headers: {
        //     'token': token,
        //     'Content-Type': 'application/json',
        //   }
        // }).then(res => {
        //   return res.json();
        // }).then(res => {
        //   if(res.success) {
        //     this.setState({
        //       token: token,
        //       firstPage: "Home",
        //     })
        //   }
        // });
        //

        this.setState({
          token: token,
          firstParge: "Home",
        });
      }
    } catch(error) {

    }
  }

  render() {
    return (
      <MyContext.Provider value={{
        API_URL: this.state.url,
        token: this.state.token,
        updateToken: this.updateToken,
      }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={this.state.firstPage}>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Enrollment" component={Enrollment} options={{ headerShown: false }} />
            <Stack.Screen name="WritePettition" component={WritePettition} options={{ headerShown: false }} />
            <Stack.Screen name="SimilarCaseAnalysis" component={SimilarCaseAnalysis} options={{ headerShown: false }} />
            <Stack.Screen name="TerminologyExplanation" component={TerminologyExplanation} options={{ headerShown: false }} />
            <Stack.Screen name="CaseBefore" component={CaseBefore} options={{ headerShown: false }} />
            <Stack.Screen name="CaseView" component={CaseView} options={{ headerShown: false }} />
            <Stack.Screen name="QnA" component={QnA} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </MyContext.Provider>
    )
  }
}

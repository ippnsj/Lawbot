import React, { Component } from "react";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import Enrollment from "./app/screens/Enrollment";
import WritePettition from "./app/screens/WritePettition";
import SimilarCaseAnalysis from "./app/screens/SimilarCaseAnalysis";
import TerminologyButton from "./app/screens/TerminologyButton";
import TerminologyExplanation from "./app/screens/TerminologyExplanation";
import CaseBefore from "./app/screens/CaseBefore";
import CaseView from "./app/screens/CaseView";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CaseBefore">
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Enrollment" component={Enrollment} options={{ headerShown: false }} />
          <Stack.Screen name="WritePettition" component={WritePettition} options={{ headerShown: false }} />
          <Stack.Screen name="SimilarCaseAnalysis" component={SimilarCaseAnalysis} options={{ headerShown: false }} />
          <Stack.Screen name="TerminologyButton" component={TerminologyButton} options={{ headerShown: false }} />
          <Stack.Screen name="TerminologyExplanation" component={TerminologyExplanation} options={{ headerShown: false }} />
          <Stack.Screen name="CaseBefore" component={CaseBefore} options={{ headerShown: false }} />
          <Stack.Screen name="CaseView" component={CaseView} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

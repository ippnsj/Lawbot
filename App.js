import React, { Component } from "react";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import WritePettition from "./app/screens/WritePettition";
import SimilarCaseAnalysis from "./app/screens/SimilarCaseAnalysis";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="WritePettition" component={WritePettition} options={{ headerShown: false }} />
          <Stack.Screen name="SimilarCaseAnalysis" component={SimilarCaseAnalysis} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

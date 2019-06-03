import React, { Component } from 'react';
import {
  Button,
  Surface,
} from 'react-native-paper';
import {
  Text,
  View,
  Linking,
  StyleSheet,
} from 'react-native';

export default class Info extends Component {
  render() {
    return (
      <View
        style={[styles.container, { backgroundColor: 'rgba(177,13,201,0.3)' }]}>
        <Surface style={[styles.card, styles.surface]}>
          <Text style={styles.center}>
            Thank you for checking out this app!
          </Text>
        </Surface>
        <Surface style={[styles.card, styles.surface]}>
          <View style={styles.center}>
            <Text style={styles.center}>Thanks to </Text>
            <Button
              onPress={() =>
                Linking.openURL('https://reactnativepaper.com/').catch(err =>
                  console.error('Linking...', err)
                )
              }>
              React Native Paper
            </Button>
            <Text style={styles.center}> and </Text>
            <Button
              onPress={() =>
                Linking.openURL('https://cryptocompare.com/').catch(err =>
                  console.error('Linking...', err)
                )
              }>
              CryptoCompare
            </Button>
            <Text style={styles.center}>for the excellent resources.</Text>
          </View>
        </Surface>
        <Surface style={[styles.card, styles.surface]}>
          <View style={styles.center}>
            <Text style={styles.center}>Check out my other projects</Text>
            <Button
              onPress={() =>
                Linking.openURL('https://waymans.github.io/').catch(err =>
                  console.error('Linking...', err)
                )
              }>
              here
            </Button>
          </View>
        </Surface>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  surface: {
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 5,
  },
  center: {
    alignSelf: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 5,
    padding: 5,
    flexDirection: 'row',
  },
});
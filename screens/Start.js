import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput,Button } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'

const Start = ({ navigation, router }) => {
    const [isBiometricSupported, setIsBiometricSupported] = React.useState(false);
    const [fingerprint, setFingerprint] = useState(false)

    const [enrollmentNo, setEnrollmentNo] = useState('');
    const [otp, setOtp] = useState('');
  
    const [authStep, setAuthStep] = useState('enrollment'); // 'enrollment' or 'otp'

    const enrollmentNum = (newText) => {
        newText = truncateText(newText, 10);
        getEnrollmentNo(newText);
    };

    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.substring(0, maxLength);
        }
        return text;
    }

    useEffect(() => {
        (async () => {

            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
            const enroll = await LocalAuthentication.isEnrolledAsync()
            if (enroll) {
                setFingerprint(true)
            }
        })();
    }, []);

    const handle = async () => {
        try {
            const biometricAuth = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Login with Biometrics',
                disableDeviceFallback: true,
                cancelLabel: 'Cancel'
            });
            if (biometricAuth.success) {
                navigation.navigate("Home")
            }
        } catch (error) {
            console.log(error)
        }
    }

    //const email = `${enrollmentNo}@mail.jiit.ac.in`;

    const handleSendOtp = async () => {
        try {
          // Make an API call to send OTP
          const response = await fetch('https://8ffb-2401-4900-1c64-c61a-f566-59af-17ed-b1be.ngrok-free.app/send-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: `${enrollmentNo}@mail.jiit.ac.in` }),
          });
      
          const data = await response.json();

    if (response.ok) {
      setAuthStep('otp');
    } else {
      // Log the full response for further inspection
      console.error('Error sending OTP:', response.status, response.statusText, data);
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
      };
      

      const handleVerifyOtp = async () => {
        try {
          // Make an API call to verify OTP
          const response = await fetch('https://8ffb-2401-4900-1c64-c61a-f566-59af-17ed-b1be.ngrok-free.app/verify-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: `${enrollmentNo}@mail.jiit.ac.in`, otp }),
          });
      
          const data = await response.json();
      
          // Check if the API call was successful
          if (response.ok) {
            // If verification is successful, navigate to the HomeScreen
            navigation.navigate('Home') ;
            console.log('OTP verification successful');
          } else {
            // Handle errors or show error messages
            console.error('Error verifying OTP:', data.error);
          }
        } catch (error) {
          console.error('Error verifying OTP:', error);
        }
      };
      



    return (
        <View style={styles.start}>

            <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
                {isBiometricSupported && fingerprint ? (
                    <TouchableOpacity onPress={handle}><Text style={styles.button}>Go to home</Text></TouchableOpacity>
                ) : (<View><Text>fingerprint not supported/ allocated</Text></View>)}
            </View>




            <View style = {{position:'relative', bottom: 200,left: 10}}>
      {authStep === 'enrollment' && (
        <>
          
          <TextInput
            style={{width: '80%',borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginBottom: 10}}
            value={enrollmentNo}
            onChangeText={setEnrollmentNo}
            placeholder="Enter Enrollment Number"
          />
          <Button title="Login with OTP" onPress={handleSendOtp} />
        </>
      )}

      {authStep === 'otp' && (
        <>
          <Text>Enter OTP:</Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP"
          />
          <Button title="Verify OTP" onPress={handleVerifyOtp} />
        </>
      )}
    </View>

        </View>
    )
}

const styles = StyleSheet.create({
    heading: {
        height: 300,
        alignItems: "center",
        justifyContent: "center",
    },
    emoji: {
        alignItems: "center",
        justifyContent: "center",
    },
    headingtext: {
        fontSize: 40,
    },
    start: {
        flex: 1,
        color: "black",
        backgroundColor: "#FFDFD3"
    },
    button: {
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 20
    },
    fields: {
        position: 'absolute', // Change the position to absolute
        bottom: 380,
        right: 30,
        left: 30,
        height: 50, // Adjust the height as needed
        backgroundColor: 'transparent', // Background color of the box
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10, // Adjust the borderRadius to control the roundness
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
    },

})

export default Start

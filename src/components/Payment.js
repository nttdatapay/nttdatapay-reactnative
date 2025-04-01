import {Linking, NativeModules, ToastAndroid, Alert} from 'react-native';
import { WebView } from 'react-native-webview';
import PaymentHelper from './PaymentHelper';
const { NdpsAESLibrary } = NativeModules;

function Payment({ route, navigation }) {
  const INJECT_JS = 'window.ReactNativeWebView.postMessage(document.getElementsByTagName("h5")[0].innerHTML)';
  const htmlPage = route.params.htmlPage;
  const merchantDetails = route.params.merchantDetails;

  decryptFinalResponse = async (data) => {
    console.log('decryptFinalResponse', data);
    let splitStr = data.split("|");
    let responseToastMsg = "";
    if(splitStr[1].includes("encData")) {
       let splitEncData = splitStr[1].split("=");
       if(splitEncData[1] === "cancelTransaction") {
          console.log("Transaction has been cancelled");
          responseToastMsg = "Transaction has been cancelled";
       }else{
           try {
                 const decryptedStr = await NdpsAESLibrary.ndpsDecrypt(splitEncData[1],
                                                                 merchantDetails.res_enc_key);
                 var parsedResponse = JSON.parse(decryptedStr);           
                 const ndps = new PaymentHelper();
                 let signatureStr = ndps.createSigStr(parsedResponse); // create signature string
                 const generatedSignatureStr = await NdpsAESLibrary.calculateHMAC(signatureStr, merchantDetails.response_hash_key); // hashing signature string with native function
                 console.log(generatedSignatureStr);
                 console.log(parsedResponse["payInstrument"]["payDetails"]["signature"]);
                   if(generatedSignatureStr === parsedResponse["payInstrument"]["payDetails"]["signature"]) {
                      if (parsedResponse["payInstrument"]["responseDetails"] ["statusCode"] == 'OTS0000' || parsedResponse["payInstrument"]["responseDetails"] ["statusCode"] == 'OTS0551') {
                         console.log("Transaction success");
                         responseToastMsg = "Transaction success";
                         }else{
                         console.log("Transaction failed");
                         responseToastMsg = "Transaction failed";
                      }
                    }else{
                      console.log("Signature mismatched ! Transaction failed");
                      responseToastMsg = "Transaction failed";
                  }
              }catch(e) {
               console.log("unable to decrypt", e);
           }
       }

      // show toast messages as per the transaction status
       if (Platform.OS === 'android') {
            ToastAndroid.show(responseToastMsg, ToastAndroid.SHORT)
        } else {
            Alert.alert(responseToastMsg);
       }
       // closing WebView and return to homescreen once transaction response received
       navigation.goBack();
    }
  }

  return (
         <WebView
           style={{flex: 1}}
           originWhitelist={["https://*", "upi://*"]}
           source={{ html: htmlPage }}
           javaScriptEnabled={true}
           domStorageEnabled={true}
           renderLoading={this.LoadingIndicatorView}
           startInLoadingState={true}
           onShouldStartLoadWithRequest={request => {
                 let url = request.url;
                 if(url.startsWith('upi:')){
                       Linking.openURL(url).catch(e=>{
                       alert("Error occured !! \nkindly check if you have upi apps installed or not !");
                     })
                     return false
                 }
                 return true
           }}
           onMessage={event => {
              console.log('event', event);
               if(event.nativeEvent.data.includes("encData") && event.nativeEvent.url.indexOf("mobilesdk/param") > -1) {
                  decryptFinalResponse(event.nativeEvent.data);
               }
           }}
           injectedJavaScript={INJECT_JS}
           onError={syntheticEvent => {
                 const { nativeEvent } = syntheticEvent;
                 alert('WebView error: ', nativeEvent);
           }}
         />
  );
}

export default Payment;

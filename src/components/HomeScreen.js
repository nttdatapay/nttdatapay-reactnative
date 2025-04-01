import {Button, Text, View, NativeModules} from 'react-native';
const { NdpsAESLibrary } = NativeModules;
import PaymentHelper from './PaymentHelper';

  // uat merchant configuration data
  const merchantDetails = {
        userId: "317159",
        merchantId: "317159",
        password: "Test@123",
        productId: "NSE",
        req_enc_key: "A4476C2062FFA58980DC8F79EB6A799E",
        res_enc_key: "75AEF0FA1B94B3C10D4F5B268F757F11",
        request_hask_key: "KEY123657234",
        response_hash_key: "KEYRESP123657234",
        custFirstName: "test user",
        custEmailId: "abc@xyz.com",
        custMobileNumber: "8888888888",
        txnDate: "2025-03-26 11:59:49",
        merchTxnId: Math.random().toString(36).substr(2, 10), // generate random unique transaction id's
        amount: 1.00,
        udf1: "udf1",
        udf2: "udf2",
        udf3: "udf3",
        udf4: "udf4",
        udf5: "udf5",
        paymentMode: "NB", // to show only one payment mode on payment screen, you can comment this if not required
        mode: "uat"
  };

function HomeScreen({ navigation }) {

    const initNDPSTransaction = async () => {
        const ndps = new PaymentHelper();
        let jsonStr = ndps.getJsonData(merchantDetails);
        console.log(jsonStr);
         try {
           const encryptedStr = await NdpsAESLibrary.ndpsEncrypt(
             jsonStr,
             merchantDetails.req_enc_key,
           );
           if(encryptedStr) {
             let tokenIdResp = await ndps.getAtomTokenId(encryptedStr, merchantDetails).then(res => res);
               try {
                    const decryptedStr = await NdpsAESLibrary.ndpsDecrypt(
                                                    tokenIdResp,
                                                    merchantDetails.res_enc_key);
                    let parsedResponse = JSON.parse(decryptedStr);
                    if(parsedResponse["responseDetails"]["txnStatusCode"] == "OTS0000") {
                        let aipayContent = ndps.openAipayPopUp(parsedResponse["atomTokenId"], merchantDetails);
                        navigation.navigate('Payment', { htmlPage: aipayContent, merchantDetails: merchantDetails });
                     }else{
                        console.log("failed");
                    }
               } catch (e) {
                    console.error(e);
               }
           }
         } catch (e) {
           console.error(e);
         }
     };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{padding:'2%'}}>Merchant page</Text>
      <Button
        title="Pay Now"
        onPress={() => initNDPSTransaction()}
      />
    </View>
  );
}

export default HomeScreen;

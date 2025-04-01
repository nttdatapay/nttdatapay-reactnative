# nttdatapay-reactnative

React Native Demo project for NTT DATA Payment Services India

## React Native AIPAY Demo Project (Android)

## Dependencies
- "react-native-webview": "^12.0.2"
- "@react-navigation/native": "^6.1.6"
- "@react-navigation/native-stack": "^6.9.12"
- "@react-navigation/stack": "^6.3.16"
- "react-native-safe-area-context": "^4.5.2"
- "react-native-screens": "^3.20.0"

Refer to `package.json` inside the given demo project for more info. Refer to `App.jsx` to understand the navigation flow of pages/screens.

## Setup Instructions

We suggest using Android Studio for better implementation of the following steps:

### Native Encryption and Decryption Features

To use native encryption and decryption features, add the given Java files under the following path:

- `android/app/src/main/java/com/your-app-name/NdpsAesModule.java`
- `android/app/src/main/java/com/your-app-name/NdpsAesPackage.java`


### Register Native Module

You need to register or add this native module package name inside `MainApplication.java`.

Path for `MainApplication.java` file to add package name:
- `android/app/src/main/java/com/your-app-name/MainApplication.java`

Add your package name `packages.add(new NdpsAesPackage());` inside the `getPackages()` function.

### Clear Cache

Once you complete the above steps, clear the cache of the project before proceeding.

Command to clear cache:
```bash
npm start -- --reset-cache
```

## Project Structure
This demo project has two screens and one helper class file, which can be found within the following path:

- src/components/
    - src/components/HomeScreen.js - Contains the merchant configuration data, encryption/decryption logic for request and response, then navigates to the Payment.js screen once we get AtomTokenId.
    - src/components/Payment.js - Contains the WebView code to show AIPAY pop-up and closes WebView and returns to HomeScreen once we get the transaction response.
    - src/components/PaymentHelper.js - Contains functions used in HomeScreen and PaymentHelper pages/screens.

## Running the Project
This is a demo project, so you can run npm install inside the root of the project to run the project directly with the command:

```
npx react-native run-android
```
or you can create a new project and install all dependencies as mentioned above.
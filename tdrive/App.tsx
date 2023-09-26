import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

export default function App() {
  const handleFileUpload = async () => {
    try {
      const res: DocumentPicker.DocumentPickerResult =
        await DocumentPicker.getDocumentAsync({
          type: "*/*",
          copyToCacheDirectory: true,
        });

      console.log("res", res.assets);
      if (res.assets?.length) {
        const asset: DocumentPicker.DocumentPickerAsset = res.assets[0];
        const obj: any = {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType,
        };
        console.log(obj);
        const data = new FormData();
        data.append("file", obj);

        const response = await axios.post("http://10.0.2.2:8000/upload", data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("api response: ", response.data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text>File uploader</Text>
      <StatusBar style="auto" />
      <Button title="Select file to upload..." onPress={handleFileUpload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

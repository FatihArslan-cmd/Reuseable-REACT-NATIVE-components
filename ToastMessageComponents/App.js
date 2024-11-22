import React from "react";
import { View, Button, StyleSheet } from "react-native";
import ToastMessage from "./Toast";
import useToast from "./useToast";

const App = () => {
  const { currentToast, showToast, hideToast } = useToast();

  return (
    <View style={styles.container}>
      <Button title="Show Success Toast" onPress={() => showToast("success", "Operation was successful!")} />
      <Button title="Show Error Toast" onPress={() => showToast("error", "Something went wrong!")} />
      <Button title="Show Info Toast" onPress={() => showToast("info", "This is an informational message!")} />

      {currentToast && (
        <ToastMessage
          type={currentToast.type}
          message={currentToast.message}
          onHide={hideToast}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;

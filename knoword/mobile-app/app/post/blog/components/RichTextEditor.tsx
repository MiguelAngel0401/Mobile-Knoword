import { View, TextInput, StyleSheet } from "react-native";

type RichTextEditorProps = {
  content: string;
  onChange: (newContent: string) => void;
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  return (
    <View style={styles.container}>
      <TextInput
        multiline
        value={content}
        onChangeText={onChange}
        placeholder="Escribe aquí..."
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1f2937",
    borderRadius: 12,
  },
  input: {
    color: "#ffffff",
  },
});
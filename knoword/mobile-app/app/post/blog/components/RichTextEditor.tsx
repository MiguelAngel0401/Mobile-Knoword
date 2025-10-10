import { View, TextInput } from "react-native";

type RichTextEditorProps = {
  content: string;
  onChange: (newContent: string) => void;
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  return (
    <View className="p-4 bg-gray-800 rounded">
      <TextInput
        multiline
        value={content}
        onChangeText={onChange}
        placeholder="Escribe aquí..."
        placeholderTextColor="#9CA3AF"
        className="text-white"
      />
    </View>
  );
}
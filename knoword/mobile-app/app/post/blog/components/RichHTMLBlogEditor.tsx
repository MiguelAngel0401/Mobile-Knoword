import React, { useRef, useState } from "react";
import { View, StyleSheet, Alert, Modal, TextInput, Pressable, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import * as ImagePicker from "expo-image-picker";
import { Link, Image } from "lucide-react-native";
import { uploadToCloudinary } from "../../../../../shared-core/src/services/cloudinary/upload";

interface RichHtmlBlogEditorProps {
    content: string;
    onChange: (html: string) => void;
}

export default function RichHtmlBlogEditor({ content, onChange }: RichHtmlBlogEditorProps) {
    const editorRef = useRef<RichEditor>(null);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [linkText, setLinkText] = useState("");
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const handleAddLink = () => {
        setShowLinkModal(true);
    };

    const insertLink = () => {
        if (linkUrl && linkText) {
            editorRef.current?.insertLink(linkText, linkUrl);
            setShowLinkModal(false);
            setLinkUrl("");
            setLinkText("");
        } else {
            Alert.alert("Error", "Por favor completa ambos campos");
        }
    };

    const handleAddImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== "granted") {
                Alert.alert(
                    "Permisos necesarios",
                    "Necesitamos acceso a tu galería para insertar imágenes"
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) {
                return;
            }

            const asset = result.assets[0];

            if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
                Alert.alert("Error", "La imagen es demasiado grande. El tamaño máximo es 5MB.");
                return;
            }

            setIsUploadingImage(true);

            const imageData = await uploadToCloudinary(asset.uri);
            const imageUrl = imageData.secure_url;


            editorRef.current?.insertImage(imageUrl);

            Alert.alert("Éxito", "Imagen insertada correctamente");

        } catch (error) {
            console.error("Error al subir imagen:", error);
            Alert.alert("Error", "No se pudo subir la imagen");
        } finally {
            setIsUploadingImage(false);
        }
    };

    return (
        <View style={styles.container}>
            <RichEditor
                ref={editorRef}
                initialContentHTML={content}
                onChange={onChange}
                editorStyle={{
                    backgroundColor: "#1f2937",
                    color: "white",
                    placeholderColor: "#9CA3AF",
                    contentCSSText: "font-size: 16px; min-height: 300px; padding: 12px;",
                }}
                placeholder="Escribe tu contenido aquí..."
            />

            <View style={styles.toolbarContainer}>
                <RichToolbar
                    editor={editorRef}
                    actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.setUnderline,
                        actions.heading1,
                        actions.insertBulletsList,
                        actions.insertOrderedList,
                    ]}
                    iconTint="#9CA3AF"
                    selectedIconTint="#3B82F6"
                    disabled={isUploadingImage}
                    style={styles.toolbar}
                />
                
                {/* Botones personalizados para Link e Imagen */}
                <View style={styles.customButtons}>
                    <TouchableOpacity 
                        onPress={handleAddLink}
                        style={styles.customButton}
                        activeOpacity={0.7}
                    >
                        <Link size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={handleAddImage}
                        style={styles.customButton}
                        activeOpacity={0.7}
                        disabled={isUploadingImage}
                    >
                        <Image size={20} color={isUploadingImage ? "#4B5563" : "#9CA3AF"} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Indicador de carga para imagen */}
            {isUploadingImage && (
                <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.uploadingText}>Subiendo imagen...</Text>
                </View>
            )}

            {/* Modal para insertar link */}
            <Modal
                visible={showLinkModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLinkModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Insertar enlace</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Texto del enlace"
                            placeholderTextColor="#9CA3AF"
                            value={linkText}
                            onChangeText={setLinkText}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="URL (https://...)"
                            placeholderTextColor="#9CA3AF"
                            value={linkUrl}
                            onChangeText={setLinkUrl}
                            autoCapitalize="none"
                            keyboardType="url"
                        />

                        <View style={styles.modalButtons}>
                            <Pressable
                                style={styles.cancelButton}
                                onPress={() => {
                                    setShowLinkModal(false);
                                    setLinkUrl("");
                                    setLinkText("");
                                }}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </Pressable>

                            <Pressable style={styles.insertButton} onPress={insertLink}>
                                <Text style={styles.insertButtonText}>Insertar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
    },
    toolbarContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#111827",
        marginTop: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#374151",
    },
    toolbar: {
        flex: 1,
        backgroundColor: "transparent",
        borderWidth: 0,
    },
    customButtons: {
        flexDirection: "row",
        paddingHorizontal: 8,
        gap: 4,
    },
    customButton: {
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#1F2937",
        borderRadius: 12,
        padding: 24,
        width: "100%",
        maxWidth: 400,
        borderWidth: 1,
        borderColor: "#374151",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#111827",
        borderWidth: 1,
        borderColor: "#374151",
        borderRadius: 8,
        padding: 12,
        color: "#fff",
        marginBottom: 12,
        fontSize: 15,
    },
    modalButtons: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#374151",
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#9CA3AF",
        fontSize: 15,
        fontWeight: "600",
    },
    insertButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: "#2563EB",
        alignItems: "center",
    },
    insertButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    uploadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    uploadingText: {
        color: "#fff",
        marginTop: 12,
        fontSize: 14,
    },
});
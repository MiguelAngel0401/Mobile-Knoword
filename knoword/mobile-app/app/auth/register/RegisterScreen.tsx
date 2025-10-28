import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
} from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@shared/validators/auth/register";
import { z } from "zod";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@shared/types/navigation";
import { useAxiosErrorHandler } from "@shared/hooks/useAxiosErrorHandler";
import { checkEmail, checkUsername, registerUser } from "@shared/services/auth/register";
import { uploadToCloudinary } from "@shared/services/cloudinary/upload";
import { debounce } from "lodash";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [step, setStep] = useState(1);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false); // 👁️ Estado para toggle
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const { handleAxiosError } = useAxiosErrorHandler();

    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
    const [isEmailChecking, setIsEmailChecking] = useState(false);
    const [isUsernameChecking, setIsUsernameChecking] = useState(false);

    const {
        handleSubmit,
        trigger,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onTouched",
        reValidateMode: "onSubmit",
    });

    const email = watch("email");
    const password = watch("password");
    const username = watch("username");
    const realName = watch("realName");
    watch("bio");

    const stepFields: Record<number, (keyof RegisterFormData)[]> = {
        1: ["email", "password"],
        2: ["username", "realName"],
        3: ["bio"],
    };

    const checkEmailAvailability = useCallback(
        debounce(async (email: string) => {
            if (!email) {
                setIsEmailAvailable(null);
                clearErrors("email");
                return;
            }
            setIsEmailChecking(true);
            try {
                const response = await checkEmail(email);
                if (response.available) {
                    setIsEmailAvailable(true);
                    clearErrors("email");
                } else {
                    setIsEmailAvailable(false);
                    setError("email", { type: "manual", message: response.message });
                }
            } catch (error) {
                setIsEmailAvailable(false);
                setError("email", {
                    type: "manual",
                    message: "Error al verificar el correo. Inténtalo de nuevo más tarde.",
                });
            } finally {
                setIsEmailChecking(false);
            }
        }, 1000),
        [setError, clearErrors]
    );

    useEffect(() => {
        if (step === 1) checkEmailAvailability(email);
        return () => checkEmailAvailability.cancel();
    }, [email, step]);

    const checkUsernameAvailability = useCallback(
        debounce(async (username: string) => {
            if (!username) {
                setIsUsernameAvailable(null);
                clearErrors("username");
                return;
            }
            setIsUsernameChecking(true);
            try {
                const response = await checkUsername(username);
                if (response.available) {
                    setIsUsernameAvailable(true);
                    clearErrors("username");
                } else {
                    setIsUsernameAvailable(false);
                    setError("username", {
                        type: "manual",
                        message: response.message || "Este nombre de usuario ya está en uso.",
                    });
                }
            } catch (error) {
                setIsUsernameAvailable(false);
                setError("username", {
                    type: "manual",
                    message: "Error al verificar el nombre de usuario. Intenta de nuevo.",
                });
            } finally {
                setIsUsernameChecking(false);
            }
        }, 1000),
        [setError, clearErrors]
    );

    useEffect(() => {
        if (step === 2) checkUsernameAvailability(username);
        return () => checkUsernameAvailability.cancel();
    }, [username, step]);

    const handleNextStep = () => {
        const fields = stepFields[step];
        trigger(fields).then((valid) => {
            if (valid) setStep((prev) => prev + 1);
        });
    };

    const handlePrevStep = () => {
        setStep((prev) => Math.max(1, prev - 1));
    };

    const handleImageUpload = async () => {
        try {
            setIsUploadingAvatar(true);
            const result = await uploadToCloudinary();
            setAvatarPreview(result.secure_url);
            setAvatarError(null);
        } catch (error) {
            setAvatarError("No se pudo subir la imagen. Intenta de nuevo.");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const onSubmit = async (data: RegisterFormData) => {
        setIsSubmitting(true);
        setSubmissionError(null);

        try {
            await registerUser({ ...data, avatar: avatarPreview ?? undefined });

            router.replace({
                pathname: "/auth/verify-account/VerifyAccountScreen",
                params: { email: data.email },
            });
        } catch (error) {
            handleAxiosError(error);
            setSubmissionError("No se pudo completar el registro. Intenta más tarde.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.scroll}>
            <View style={styles.card}>
                <Text style={styles.title}>
                    {step === 1 && "¡Bienvenido! Empecemos creando tu cuenta"}
                    {step === 2 && "¿Cómo te gustaría que te conozcan?"}
                    {step === 3 && "Haz que tu perfil cuente"}
                </Text>

                {/* Paso 1 */}
                {step === 1 && (
                    <>
                        <Text style={styles.subtitle}>
                            Solo necesitamos tu correo y una contraseña segura.
                        </Text>

                        <Text style={styles.label}>Correo electrónico</Text>
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            placeholder="correo@ejemplo.com"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={(text) => setValue("email", text)}
                        />
                        {isEmailAvailable && !errors.email && email && (
                            <Text style={styles.success}>Correo disponible 👍</Text>
                        )}
                        {errors.email && (
                            <Text style={styles.error}>{errors.email.message}</Text>
                        )}

                        <Text style={[styles.label, { marginTop: 16 }]}>Contraseña</Text>
                        <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                            <TextInput
                                style={styles.inputPassword}
                                placeholder="••••••••"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                onChangeText={(text) => setValue("password", text)}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.icon}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} color="white" />
                                ) : (
                                    <Eye size={20} color="white" />
                                )}
                            </TouchableOpacity>
                        </View>
                        {errors.password && (
                            <Text style={styles.error}>{errors.password.message}</Text>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.primaryButton,
                                (!email || !password || isEmailChecking || isEmailAvailable === false) &&
                                styles.disabledButton,
                            ]}
                            disabled={
                                !email || !password || isEmailChecking || isEmailAvailable === false
                            }
                            onPress={handleNextStep}
                        >
                            <Text style={styles.buttonText}>Continuar</Text>
                        </TouchableOpacity>
                    </>
                )}
                {/* Paso 2 */}
                {step === 2 && (
                    <>
                        <Text style={styles.subtitle}>
                            Tu nombre de usuario será visible para otros. El nombre real es opcional, pero puede ayudar a conectar mejor.
                        </Text>

                        <Text style={styles.label}>Nombre de usuario</Text>
                        <TextInput
                            style={[styles.input, errors.username && styles.inputError]}
                            placeholder="usuario123"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="none"
                            onChangeText={(text) => setValue("username", text)}
                        />
                        {isUsernameAvailable && !errors.username && username && (
                            <Text style={styles.success}>Nombre de usuario disponible 👍</Text>
                        )}
                        {errors.username && (
                            <Text style={styles.error}>{errors.username.message}</Text>
                        )}

                        <Text style={[styles.label, { marginTop: 16 }]}>Nombre real</Text>
                        <TextInput
                            style={[styles.input, errors.realName && styles.inputError]}
                            placeholder="Miguel Hernández"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="words"
                            onChangeText={(text) => setValue("realName", text)}
                        />
                        {errors.realName && (
                            <Text style={styles.error}>{errors.realName.message}</Text>
                        )}

                        <View style={styles.row}>
                            <TouchableOpacity style={styles.secondaryButton} onPress={handlePrevStep}>
                                <Text style={styles.buttonText}>Atrás</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.primaryButton,
                                    (!username || !realName || isUsernameChecking || isUsernameAvailable === false) &&
                                    styles.disabledButton,
                                ]}
                                disabled={
                                    !username || !realName || isUsernameChecking || isUsernameAvailable === false
                                }
                                onPress={handleNextStep}
                            >
                                <Text style={styles.buttonText}>Siguiente</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* Paso 3 */}
                {step === 3 && (
                    <>
                        <Text style={styles.subtitle}>
                            Agrega una imagen y una pequeña descripción para mostrar tu personalidad desde el primer día.
                        </Text>

                        <Text style={styles.label}>Imagen de perfil (Opcional)</Text>
                        <TouchableOpacity
                            style={styles.accentButton}
                            onPress={handleImageUpload}
                            disabled={isUploadingAvatar}
                        >
                            <Text style={styles.buttonText}>
                                {isUploadingAvatar
                                    ? "Subiendo..."
                                    : avatarPreview
                                        ? "Cambiar foto"
                                        : "Subir foto"}
                            </Text>
                        </TouchableOpacity>

                        {avatarPreview && (
                            <View style={styles.avatarPreview}>
                                <Image
                                    source={{ uri: avatarPreview }}
                                    style={{ width: 64, height: 64, borderRadius: 32 }}
                                />
                            </View>
                        )}

                        {avatarError && (
                            <Text style={[styles.error, { textAlign: "center" }]}>{avatarError}</Text>
                        )}

                        <Text style={[styles.label, { marginTop: 24 }]}>
                            Descripción (opcional pero recomendado 🥸)
                        </Text>
                        <TextInput
                            style={[styles.input, { minHeight: 80, textAlignVertical: "top" }]}
                            placeholder="Cuéntanos algo sobre ti..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={3}
                            onChangeText={(text) => setValue("bio", text)}
                        />
                        {errors.bio && (
                            <Text style={styles.error}>{errors.bio.message}</Text>
                        )}

                        <View style={styles.row}>
                            <TouchableOpacity style={styles.secondaryButton} onPress={handlePrevStep}>
                                <Text style={styles.buttonText}>Atrás</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
                                disabled={isSubmitting}
                                onPress={handleSubmit(onSubmit)}
                            >
                                <Text style={styles.buttonText}>
                                    {isSubmitting ? "Registrando..." : "Finalizar registro"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                <Text style={styles.progress}>Paso {step} de 3</Text>
            </View>

            {submissionError && (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{submissionError}</Text>
                    <TouchableOpacity
                        style={styles.errorRetry}
                        onPress={() => handleSubmit(onSubmit)()}
                    >
                        <Text style={styles.buttonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: "#0f0f0f",
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    card: {
        backgroundColor: "#1f2937",
        borderRadius: 12,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 14,
        color: "#d1d5db",
        textAlign: "center",
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#ffffff",
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#374151",
        color: "#ffffff",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#4b5563",
    },
    inputPassword: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
        paddingVertical: 12,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#374151",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#4b5563",
        paddingHorizontal: 12,
    },
    icon: {
        paddingLeft: 8,
    },
    inputError: {
        borderColor: "#ef4444",
    },
    error: {
        color: "#ef4444",
        fontSize: 12,
        marginTop: 6,
    },
    success: {
        color: "#22c55e",
        fontSize: 12,
        marginTop: 6,
    },
    primaryButton: {
        backgroundColor: "#e11d48",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 24,
    },
    secondaryButton: {
        backgroundColor: "#4b5563",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 24,
    },
    accentButton: {
        backgroundColor: "#7c3aed",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 8,
        alignItems: "center",
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 24,
    },
    avatarPreview: {
        alignItems: "center",
        marginTop: 16,
    },
    progress: {
        textAlign: "center",
        fontSize: 14,
        color: "#9ca3af",
        marginTop: 24,
    },
    errorBox: {
        marginTop: 24,
        backgroundColor: "#7f1d1d",
        padding: 16,
        borderRadius: 8,
    },
    errorText: {
        color: "#ffffff",
        textAlign: "center",
        marginBottom: 12,
    },
    errorRetry: {
        backgroundColor: "#dc2626",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
});
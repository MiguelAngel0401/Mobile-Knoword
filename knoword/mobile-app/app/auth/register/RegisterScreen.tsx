import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ScrollView,
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

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [step, setStep] = useState(1);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
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
            navigation.navigate("Login");
        } catch (error) {
            handleAxiosError(error);
            setSubmissionError("No se pudo completar el registro. Intenta más tarde.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-900 px-6 py-8">
            <View className="bg-gray-800 rounded-lg shadow-lg p-6">
                <Text className="text-3xl font-bold text-white text-center mb-6">
                    {step === 1 && "¡Bienvenido! Empecemos creando tu cuenta"}
                    {step === 2 && "¿Cómo te gustaría que te conozcan?"}
                    {step === 3 && "Haz que tu perfil cuente"}
                </Text>

                {/* Paso 1 */}
                {step === 1 && (
                    <>
                        <Text className="text-gray-300 text-center mb-4">
                            Solo necesitamos tu correo y una contraseña segura.
                        </Text>

                        <Text className="text-white mb-1">Correo electrónico</Text>
                        <TextInput
                            className="bg-gray-700 text-white rounded-md px-3 py-2"
                            placeholder="correo@ejemplo.com"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={(text) => setValue("email", text)}
                        />
                        {isEmailAvailable && !errors.email && email && (
                            <Text className="text-green-500 text-sm mt-2">Correo disponible 👍</Text>
                        )}
                        {errors.email && (
                            <Text className="text-red-500 text-sm mt-2">{errors.email.message}</Text>
                        )}

                        <Text className="text-white mt-4 mb-1">Contraseña</Text>
                        <TextInput
                            className="bg-gray-700 text-white rounded-md px-3 py-2"
                            placeholder="••••••••"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showPassword}
                            onFocus={() => setShowPassword(true)}
                            onBlur={() => setShowPassword(false)}
                            onChangeText={(text) => setValue("password", text)}
                        />
                        {errors.password && (
                            <Text className="text-red-500 text-sm mt-2">{errors.password.message}</Text>
                        )}

                        <TouchableOpacity
                            className="bg-primary py-3 rounded-lg mt-6 disabled:opacity-50"
                            disabled={
                                !email ||
                                !password ||
                                isEmailChecking ||
                                isEmailAvailable === false
                            }
                            onPress={handleNextStep}
                        >
                            <Text className="text-white text-center font-bold">Continuar</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* Paso 2 */}
                {step === 2 && (
                    <>
                        <Text className="text-gray-300 text-center mb-4">
                            Tu nombre de usuario será visible para otros. El nombre real es opcional, pero puede ayudar a conectar mejor.
                        </Text>

                        <Text className="text-white mb-1">Nombre de usuario</Text>
                        <TextInput
                            className="bg-gray-700 text-white rounded-md px-3 py-2"
                            placeholder="usuario123"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="none"
                        />

                        {isUsernameAvailable && !errors.username && username && (
                            <Text className="text-green-500 text-sm mt-2">Nombre de usuario disponible 👍</Text>
                        )}
                        {errors.username && (
                            <Text className="text-red-500 text-sm mt-2">{errors.username.message}</Text>
                        )}

                        <Text className="text-white mt-4 mb-1">Nombre real</Text>
                        <TextInput
                            className="bg-gray-700 text-white rounded-md px-3 py-2"
                            placeholder="Miguel Hernández"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="words"
                            onChangeText={(text) => setValue("realName", text)}
                        />
                        {errors.realName && (
                            <Text className="text-red-500 text-sm mt-2">{errors.realName.message}</Text>
                        )}

                        <View className="flex-row justify-between mt-6">
                            <TouchableOpacity
                                className="bg-gray-600 py-3 px-4 rounded-lg"
                                onPress={handlePrevStep}
                            >
                                <Text className="text-white font-bold">Atrás</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-primary py-3 px-4 rounded-lg disabled:opacity-50"
                                disabled={
                                    !username ||
                                    !realName ||
                                    isUsernameChecking ||
                                    isUsernameAvailable === false
                                }
                                onPress={handleNextStep}
                            >
                                <Text className="text-white font-bold">Siguiente</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* Paso 3 */}
                {step === 3 && (
                    <>
                        <Text className="text-gray-300 text-center mb-4">
                            Agrega una imagen y una pequeña descripción para mostrar tu personalidad desde el primer día.
                        </Text>

                        <Text className="text-white mb-1">Imagen de perfil (Opcional)</Text>
                        <TouchableOpacity
                            className="bg-accent py-2 px-4 rounded-lg mt-2 disabled:opacity-50"
                            onPress={handleImageUpload}
                            disabled={isUploadingAvatar}
                        >
                            <Text className="text-white text-center font-bold">
                                {isUploadingAvatar
                                    ? "Subiendo..."
                                    : avatarPreview
                                        ? "Cambiar foto"
                                        : "Subir foto"}
                            </Text>
                        </TouchableOpacity>

                        {avatarPreview && (
                            <View className="items-center mt-4">
                                <Image
                                    source={{ uri: avatarPreview }}
                                    className="w-16 h-16 rounded-full"
                                />
                            </View>
                        )}

                        {avatarError && (
                            <Text className="text-red-500 text-sm mt-2 text-center">{avatarError}</Text>
                        )}

                        <Text className="text-white mt-6 mb-1">Descripción (opcional pero recomendado 🥸)</Text>
                        <TextInput
                            className="bg-gray-700 text-white rounded-md px-3 py-2"
                            placeholder="Cuéntanos algo sobre ti..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={3}
                            onChangeText={(text) => setValue("bio", text)}
                        />
                        {errors.bio && (
                            <Text className="text-red-500 text-sm mt-2">{errors.bio.message}</Text>
                        )}

                        <View className="flex-row justify-between mt-6">
                            <TouchableOpacity
                                className="bg-gray-600 py-3 px-4 rounded-lg"
                                onPress={handlePrevStep}
                            >
                                <Text className="text-white font-bold">Atrás</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-primary py-3 px-4 rounded-lg disabled:opacity-50"
                                disabled={isSubmitting}
                                onPress={handleSubmit(onSubmit)}
                            >
                                <Text className="text-white font-bold">
                                    {isSubmitting ? "Registrando..." : "Finalizar registro"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* Indicador de progreso */}
                <Text className="text-center text-sm text-gray-400 mt-6">Paso {step} de 3</Text>
            </View>

            {submissionError && (
                <View className="mt-6 bg-red-900 p-4 rounded-lg">
                    <Text className="text-white text-center mb-2">{submissionError}</Text>
                    <TouchableOpacity
                        className="bg-red-600 py-2 px-4 rounded-lg"
                        onPress={() => handleSubmit(onSubmit)()}
                    >
                        <Text className="text-white text-center font-bold">Reintentar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}
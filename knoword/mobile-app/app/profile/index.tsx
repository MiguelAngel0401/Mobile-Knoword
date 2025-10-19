import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ProfileMenu } from "../../components/ui/navbar/ProfileMenu";
import { Banner } from "../../../mobile-app/src/components/profile/Banner";
import Posts from "../../../mobile-app/src/components/profile/Posts";
import Followers from "../../../mobile-app/src/components/profile/Followers";
import Communities from "../../../mobile-app/src/components/profile/Communities";

export default function ProfileIndex() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.menuWrapper}>
                <ProfileMenu />
            </View>

            <Banner />
            <Posts />
            <Followers />
            <Communities />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "black",
    },
    menuWrapper: {
        alignItems: "flex-end",
        marginBottom: 8,
    },
});
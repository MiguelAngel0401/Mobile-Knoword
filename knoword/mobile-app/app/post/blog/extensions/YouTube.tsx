import React from "react";
import { View, StyleSheet } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

interface YoutubeEmbedProps {
  url: string;
  start?: number;
}

const getYouTubeVideoId = (url: string): string | null => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function YoutubeEmbed({ url, start = 0 }: YoutubeEmbedProps) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  return (
    <View style={styles.container}>
      <YoutubePlayer
        height={220}
        play={false}
        videoId={videoId}
        initialPlayerParams={{ start }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
});
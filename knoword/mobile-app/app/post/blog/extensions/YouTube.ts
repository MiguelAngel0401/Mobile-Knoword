import React from "react";
import { View } from "react-native";
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
    <View className="w-full aspect-video rounded-lg overflow-hidden mb-4">
      <YoutubePlayer
        height={220}
        play={false}
        videoId={videoId}
        initialPlayerParams={{ start }}
      />
    </View>
  );
}
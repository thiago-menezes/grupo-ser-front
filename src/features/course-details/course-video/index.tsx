import { Text, View } from 'reshaped';
import styles from './styles.module.scss';

export type CourseVideoProps = {
  videoUrl: string;
};

export function CourseVideo({ videoUrl }: CourseVideoProps) {
  if (!videoUrl) return null;

  // Extract video ID from YouTube URL
  // Supports formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  const getVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getVideoId(videoUrl);

  if (!videoId) return null;

  return (
    <View className={styles.videoSection}>
      <Text
        as="h2"
        variant="featured-2"
        weight="medium"
        className={styles.title}
      >
        Veja mais sobre o curso
      </Text>
      <div className={styles.videoWrapper}>
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </View>
  );
}

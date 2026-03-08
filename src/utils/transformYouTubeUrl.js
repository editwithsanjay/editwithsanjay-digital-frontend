/**
 * Transforms a standard YouTube URL into an optimized embed iframe string.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
const transformYouTubeUrl = (url) => {
    if (!url) return "";

    // If it's already an iframe, don't change it
    if (url.includes("<iframe")) {
        return url;
    }

    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);

    if (match && match[1]) {
        const videoId = match[1];
        return `<iframe class="w-full h-full rounded-lg shadow-lg" src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&loop=1&playlist=${videoId}&controls=0" title="Embedded Video" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen> </iframe>`;
    }

    return url;
};

export default transformYouTubeUrl;

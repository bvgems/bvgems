with open('/tmp/CategoryContent.tsx.backup', 'r') as f:
    content = f.read()

video_start = content.find('{selectedGradeVideos.length > 0 && currentVideoUrl && (')
video_end = content.find(')}', content.find('{/* Video Thumbnails Carousel')) + 2
video_end = content.find(')}', video_end) + 2
video_block = content[video_start:video_end].strip()

print(video_block[-100:])

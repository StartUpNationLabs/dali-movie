

def cut(video, start, end):
    return video.subclipped(start, end)

def cutStart(video, start_trim):
    return video.subclipped(start_trim, video.duration)

def cutEnd(video, end_trim):
    return video.subclipped(0, video.duration - end_trim )
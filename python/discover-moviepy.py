from moviepy import (VideoFileClip, VideoClip, CompositeVideoClip, concatenate_videoclips)
from os import path

script_dir = path.dirname(path.abspath(__file__))
relative_input_path = "../data/SampleVideo_1280x720_1mb.mp4"
relative_output_path = "../data/result.mp4"
input_absolute_path = path.abspath(path.join(script_dir, relative_input_path))
output_absolute_path = path.abspath(path.join(script_dir, relative_output_path))

clip : VideoFileClip = VideoFileClip(input_absolute_path) 
  
# clipping of the video  
# getting video for only starting 10 seconds 
clip1 = clip.subclipped(0, 2) 
clip2 = clip.subclipped(0,3)

# showing clip 
res : (VideoClip | CompositeVideoClip) = concatenate_videoclips([clip1,clip2], method="compose")
res.write_videofile(output_absolute_path)
from dali_movie.dali_movie import Dali_movie, MODE, ANCHOR_TYPE
from moviepy.audio.AudioClip import AudioClip

#INIT
font_path = "./dali_movie/resources/arial.TTF"
dali_movie = Dali_movie(font_path)

#SCRIPT
clip1 = dali_movie.importVideo("clip1", "../../data/video.mp4")
audio1 = dali_movie.importAudio("audio1", "../../data/audio.mp3")
clip1a = dali_movie.cut("clip1a", clip1, 1, 4)
clip1b = dali_movie.cut_end("clip1b", clip1, 4)
audio1a = dali_movie.cut_start("audio1a", audio1, 2)
testTitle1 = dali_movie.text("testTitle1", "\"Test de titre\"", duration=5, backgroundColor="red", textColor="white", position=(1, 0.25))
dali_movie.add(clip1)
dali_movie.add(clip1a, mode=MODE.START, anchor_type="after", offset=2, reference=clip1)
dali_movie.add(audio1a, mode=MODE.START, anchor_type="at", reference=clip1a)
dali_movie.add(testTitle1, mode=MODE.START, anchor_type="after", reference=clip1a)
testSubtitle1 = dali_movie.text("testSubtitle1", "Je teste les sous-titres", duration=6, textColor="white")
dali_movie.add(testSubtitle1, mode=MODE.START, anchor_type="after", reference=testTitle1)
dali_movie.add(clip1b, mode=MODE.START, anchor_type="after", offset=1, reference=testTitle1)

dali_movie.export("./output.mp4")
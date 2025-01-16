from dali_movie.dali_movie import Dali_movie, MODE, ANCHOR_TYPE
from moviepy.audio.AudioClip import AudioClip

#INIT
font_path = "/home/main/SSE/dali/dali-movie/dist/apps/dali-server/src/assets/arial.TTF"
dali_movie = Dali_movie(font_path)

#SCRIPT
scene1 = dali_movie.importVideo("scene1", "/home/main/SSE/dali/dali-movie/dist/apps/dali-server/uploads/b592952d-885f-4697-b6e9-a64432a2bf80/video.mp4")
scene2 = dali_movie.importVideo("scene2", "/home/main/SSE/dali/dali-movie/dist/apps/dali-server/uploads/b592952d-885f-4697-b6e9-a64432a2bf80/video.mp4")
scene3 = dali_movie.importVideo("scene3", "/home/main/SSE/dali/dali-movie/dist/apps/dali-server/uploads/b592952d-885f-4697-b6e9-a64432a2bf80/video.mp4")
music = dali_movie.importAudio("music", "/home/main/SSE/dali/dali-movie/dist/apps/dali-server/uploads/b592952d-885f-4697-b6e9-a64432a2bf80/audio.mp3")
sfx = dali_movie.importAudio("sfx", "/home/main/SSE/dali/dali-movie/dist/apps/dali-server/uploads/b592952d-885f-4697-b6e9-a64432a2bf80/audio.mp3")
introCut = dali_movie.cut("introCut", scene1, 0, 3)
interviewCut = dali_movie.cut("interviewCut", scene2, 1, 3)
outroCut = dali_movie.cut_start("outroCut", scene3, 4)
dali_movie.add(introCut)
dali_movie.add(music)
dali_movie.add(interviewCut, mode=MODE.START, anchor_type="after", reference=introCut)
dali_movie.add(sfx, mode=MODE.START, anchor_type="after", reference=introCut)
dali_movie.add(outroCut, mode=MODE.START, anchor_type="after", reference=interviewCut)
titleText = dali_movie.text("titleText", "\"Welcome to the Documentary\"", duration=5)
dali_movie.add(titleText)
subtitleInterview = dali_movie.text("subtitleInterview", "\"Interview with John Doe\"", duration=10)
dali_movie.add(subtitleInterview, mode=MODE.START, anchor_type="after", reference=introCut)
outroText = dali_movie.text("outroText", "\"Thank you for watching!\"", duration=7)
dali_movie.add(outroText, mode=MODE.START, anchor_type="after", reference=interviewCut)

dali_movie.export()

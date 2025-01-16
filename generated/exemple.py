from dali_movie.dali_movie import Dali_movie, MODE, ANCHOR_TYPE
from moviepy.audio.AudioClip import AudioClip

#INIT
font_path = "./dali_movie/resources/arial.TTF"
dali_movie = Dali_movie(font_path)

#SCRIPT
clip1 = dali_movie.importVideo("clip1", "./video.mp4")
audio1 = dali_movie.importAudio("audio1", "./audio.mp3")
clip1a = dali_movie.cut("clip1a", clip1, 19, 107)
clip1b = dali_movie.cut_start("clip1b", clip1, 14224)
clip1c = dali_movie.cut_end("clip1c", clip1, 23)
dali_movie.add(clip1)
dali_movie.add(clip1a, mode=MODE.START, anchor_type="after", offset=2, reference=clip1)
dali_movie.add(clip1b, mode=MODE.END, anchor_type="before", offset=3, reference=clip1)
dali_movie.add(clip1c, mode=MODE.START, anchor_type="after", reference=clip1a)
dali_movie.add(audio1)
audio1_2s_1m12s = dali_movie.cut("audio1_2s_1m12s", audio1, 2, 72)
dali_movie.add(audio1_2s_1m12s)
dali_movie.add(audio1, mode=MODE.START, anchor_type="after", offset=2, reference=clip1)
audio1_start_1m12s = dali_movie.cut_start("audio1_start_1m12s", audio1, 72)
dali_movie.add(audio1_start_1m12s, mode=MODE.START, anchor_type="at", reference=clip1)
dali_movie.add(audio1, mode=MODE.END, anchor_type="before", offset=3, reference=clip1)
audio1_end_26s = dali_movie.cut_end("audio1_end_26s", audio1, 26)
dali_movie.add(audio1_end_26s, mode=MODE.END, anchor_type="before", offset=3, reference=clip1)
dali_movie.add(audio1, mode=MODE.START, anchor_type="after", reference=clip1a)
testTitle1 = dali_movie.text("testTitle1", "\"test\"", duration=15, backgroundColor="black", textColor="red")
testTitle2 = dali_movie.text("testTitle2", "test2", duration=8)
dali_movie.add(testTitle1)
dali_movie.add(testTitle2, mode=MODE.START, anchor_type="after", reference=testTitle1)
text_fde35fab_ec12_4954_b107_a172adac320d = dali_movie.text("text_fde35fab_ec12_4954_b107_a172adac320d", "test title", duration=10)
dali_movie.add(text_fde35fab_ec12_4954_b107_a172adac320d)
testTitle3 = dali_movie.text("testTitle3", "test title", duration=10)
dali_movie.add(testTitle3)
text_7fbe22f6_4149_46a9_a253_ae9fcf2c32fa = dali_movie.text("text_7fbe22f6_4149_46a9_a253_ae9fcf2c32fa", "test title2", duration=10)
dali_movie.add(text_7fbe22f6_4149_46a9_a253_ae9fcf2c32fa, mode=MODE.END, anchor_type="before", reference=clip1)
testTitle4 = dali_movie.text("testTitle4", "test title2", duration=10)
dali_movie.add(testTitle4, mode=MODE.END, anchor_type="before", reference=clip1)
text_46e1aa04_9533_499f_8b59_e39873e2316c = dali_movie.text("text_46e1aa04_9533_499f_8b59_e39873e2316c", "test title3", duration=10)
dali_movie.add(text_46e1aa04_9533_499f_8b59_e39873e2316c, mode=MODE.START, anchor_type="after", offset=2, reference=clip1a)
testTitle5 = dali_movie.text("testTitle5", "test title3", duration=10)
dali_movie.add(testTitle5, mode=MODE.START, anchor_type="after", offset=2, reference=clip1a)
text_0fc3ef70_f4d9_4ee0_828a_12a7ec2462fc = dali_movie.text("text_0fc3ef70_f4d9_4ee0_828a_12a7ec2462fc", "test subtitle", duration=10)
dali_movie.add(text_0fc3ef70_f4d9_4ee0_828a_12a7ec2462fc)
testSubTitle = dali_movie.text("testSubTitle", "test subtitle", duration=10)
dali_movie.add(testSubTitle)
text_402fed16_5dee_45fe_b961_9de7d49c0108 = dali_movie.text("text_402fed16_5dee_45fe_b961_9de7d49c0108", "test subtitle2", duration=10)
dali_movie.add(text_402fed16_5dee_45fe_b961_9de7d49c0108, mode=MODE.END, anchor_type="before", reference=clip1)
testSubTitle2 = dali_movie.text("testSubTitle2", "test subtitle2", duration=10)
dali_movie.add(testSubTitle2, mode=MODE.END, anchor_type="before", reference=clip1)
text_6e2ea317_b6b4_49c6_83da_66bc6fe1ad5c = dali_movie.text("text_6e2ea317_b6b4_49c6_83da_66bc6fe1ad5c", "test subtitle3", duration=10)
dali_movie.add(text_6e2ea317_b6b4_49c6_83da_66bc6fe1ad5c, mode=MODE.START, anchor_type="after", offset=2, reference=clip1a)
testSubTitle3 = dali_movie.text("testSubTitle3", "test subtitle3", duration=10)
dali_movie.add(testSubTitle3, mode=MODE.START, anchor_type="after", offset=2, reference=clip1a)

dali_movie.export("./output.mp4")

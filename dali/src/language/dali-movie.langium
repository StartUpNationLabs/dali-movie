grammar DaliMovie

entry Script:
    commands+=Command*
;

Command:
    LoadVideo | LoadAudio | CutVideo | CutAudio | AddMedia | AddTextToVideo
;

LoadVideo:
    'import' 'video' name=ID file=QUOTED_STRING
;

LoadAudio:
    'import' 'audio' name=ID file=QUOTED_STRING
;

CutVideo:
    'cut' videoRef=[Video:ID] 'from' (from=('start' | 'end') 'for'| from=TIME 'to') duration=TIME 'named' name=ID
;

CutAudio:
    'cut' videoRef=[Audio:ID] 'from' (from=('start' | 'end') 'for'| from=TIME 'to') duration=TIME 'named' name=ID
;

// Add a video a cut or an audio, the distinction is made in the logic
AddMedia:
    'add' mediaRef=[Media:ID] ((offset=TIME)? position=('before'|'after') referential=[Video:ID])?
;

// Add a title or a subtitle
AddTextToVideo:
    type=('title' | 'subtitle')  content=QUOTED_STRING 'for' duration=TIME ((offset=TIME)? position=('before'|'after') referential=[Video:ID])? ('named' name=ID)?
;

Video :
    LoadVideo | CutVideo | AddTextToVideo
;

Audio :
    LoadAudio | CutAudio
;

Media :
    Video | Audio
;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal QUOTED_STRING: /(["'])(?:(?=(\\?))\2.)*?\1/;
terminal TIME: /\d+(m\d+)?s/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
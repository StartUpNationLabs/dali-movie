grammar DaliMovie

entry Script:
    commands+=Command*
;

Command:
    LoadVideo | LoadAudio | Cut | AddMedia | AddText
;

LoadVideo:
    'import' 'video' name=ID file=QUOTED_STRING
;

LoadAudio:
    'import' 'audio' name=ID file=QUOTED_STRING
;

Cut:
    'cut' videoRef=[LoadVideo:ID] 'from' (from=('start' | 'end') 'for'| from=TIME 'to') duration=TIME 'named' name=ID
;

// Add a video a cut or an audio, the distinction is made in the logic
AddMedia:
    'add' mediaRef=[Media:ID] ((offset=TIME)? position=('before'|'after') referential=[Video:ID])?
;

// Add a title or a subtitle
AddText:
    type=('title' | 'subtitle')  content=QUOTED_STRING 'for' duration=TIME ((offset=TIME)? position=('before'|'after') referential=[Video:ID])? ('named' name=ID)?
;

Video :
    LoadVideo | Cut | AddText
;

Media :
    LoadVideo | LoadAudio | Cut
;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal QUOTED_STRING: /(["'])(?:(?=(\\?))\2.)*?\1/;
terminal TIME: /\d+(m\d+)?s/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
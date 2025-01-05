grammar DaliMovie

entry Script:
    commands+=Command*
;

Command:
    LoadVideo | LoadAudio | Cut | AddMedia | AddSubtitle | CreateTitle
;

LoadVideo:
    'import' 'video' name=ID file=QUOTED_STRING
;

LoadAudio:
    'import' 'audio' name=ID file=QUOTED_STRING
;


Cut:
    'cut' mediaRef=[Media:ID] 'from' (from=('start' | 'end') 'for'| from=TIME 'to') duration=TIME ('named' name=ID)?
;

// Add a video a cut or an audio, the distinction is made in the logic
AddMedia:
    'add' mediaRef=[Media:ID] ((offset=TIME)? position=('from'|'after') referential=[Video:ID])? ('and' duration=TIME)?
;

// Add a title or a subtitle
CreateTitle:
    'title' content=QUOTED_STRING 'with' 'background' backgroundColor=QUOTED_STRING 'for' duration=TIME 'named' name=ID?
;

// Add a title or a subtitle
AddSubtitle:
    'subtitle' content=QUOTED_STRING 'for' duration=TIME ((offset=TIME)? position=('before'|'after') referential=[Video:ID])? ('named' name=ID)?
;



Video :
    LoadVideo  | AddSubtitle | Cut | CreateTitle
;

Audio :
    LoadAudio | Cut
;

Media :
    Audio | Video
;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal QUOTED_STRING: /(["'])(?:(?=(\\?))\2.)*?\1/;
terminal TIME: /-?\d+(m\d+)?s/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
grammar ArduinoMl

entry Script:
    commands+=Command*
;

Command:
    LoadVideo | LoadAudio | Cut
;
    
LoadVideo:
    'import' 'video' name=ID file=FILEPATH
;

LoadAudio:
    'import' 'audio' name=ID file=FILEPATH
;

Cut:
    'cut' originalVideo=[LoadVideo:ID] 'from' (from=('start' | 'end') | time=Time)
;

Time:
    duration=INT's'
;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal FILEPATH: /(["'])(?:(?=(\\?))\2.)*?\1/;
terminal INT: /[0-9]+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
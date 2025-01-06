grammar DaliMovie

entry Script:
    commands+=Command*
    export=Export?
;

Command:
    LoadVideo | LoadAudio | Cut | Text | AddMedia | AddText
;
    
LoadVideo:
    'import' 'video' name=ID file=QUOTED_STRING
;

LoadAudio:
    'import' 'audio' name=ID file=QUOTED_STRING
;

// Can be a cut from an audio or from a video or from a cut in itself
Cut:
    'cut' mediaRef=[Media:ID] 
    'from' (from=('start' | 'end') 'for'| from=TIME 'to') 
    duration=TIME 'named' name=ID
;

Text:
    'text' content=QUOTED_STRING
    ('color' textColor=Color)?
    ('position' percentageFromLeft=Percentage ',' percentageFromTop=Percentage)?
    ('background' backgroundColor=Color)?
    'named' name=ID;


// Add a video a cut or an audio, the distinction is made in the logic
AddMedia:
    'add' mediaRef=[Media:ID] 
    ('from' (from=('start' | 'end') 'for'| from=TIME 'to') duration=TIME)? 
    (mode=StartingRule referential=[Referentials:ID] |
     mode=EndingRule referential=[Referentials:ID] )?
;

// Add a title or a subtitle
AddText:
    'add' content=QUOTED_STRING 'for' duration=TIME
    (mode=StartingRule referential=[Referentials:ID] |
     mode=EndingRule referential=[Referentials:ID] )?
    ('named' name=ID)?
;

StartingRule:
    'starting' ((offset=TIME)? 'after' | 'at');

EndingRule:
    'ending' ((offset=TIME)? 'before' | 'at');

Media :
    LoadVideo | LoadAudio | Cut | Text
;

Referentials :
    LoadVideo | LoadAudio | Cut | AddText | Text
;

Export :
    'export' 'here' outputFilepath=QUOTED_STRING
;

Color returns string:
    HEX_COLOR | 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'ORANGE' | 'PURPLE' | 'PINK' | 'BLACK' | 'WHITE' | 'GRAY' | 'BROWN' | 'CYAN' | 'MAGENTA' | 'LIME' | 'TEAL' | 'INDIGO' | 'VIOLET' | 'GOLD' | 'SILVER' | 'BEIGE'
;

Percentage returns number:
    PERCENTAGE | '100'
;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal QUOTED_STRING: /(["'])(?:(?=(\\?))\2.)*?\1/;
terminal TIME: /\d+(m\d+)?s/;
terminal HEX_COLOR: /#?([0-9a-f]{6}|[0-9a-f]{3})/;
terminal PERCENTAGE: /([0-9]{1,2})/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
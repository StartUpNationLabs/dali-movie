grammar DaliMovie

entry Script:
    commands+=Command*
    export=Export?
;
Command:
    LoadVideo | LoadAudio | Cut | Text | AddMedia | AddText;
LoadVideo:
    'import' 'video' name=ID QuotedFileName
;

LoadAudio:
    'import' 'audio' name=ID QuotedFileName
;

Cut:
    'cut' mediaRef=[Media:ID] 
    'from' (from=('start' | 'end') 'for'| from=TIME 'to') 
    duration=TIME 'named' name=ID
;

Text:
    'text' QuotedContent
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
    'add' QuotedContent 'for' duration=TIME
    (mode=StartingRule referential=[Referentials:ID] |
     mode=EndingRule referential=[Referentials:ID] )?
    ('named' name=ID)?
;

Export:
    'export' 'here' QuotedFileName
;

StartingRule:
    'starting' ((offset=TIME)? anchor='after' | anchor='at');

EndingRule:
    'ending' ((offset=TIME)? anchor='before' | anchor='at');

Media:
    LoadVideo | LoadAudio | Cut | Text
;

Referentials:
    LoadVideo | LoadAudio | Cut | AddText | Text
;

Color returns string:
    HEX_COLOR | 'RED' | 'BLUE' | 'GREEN' | 'YELLOW' | 'ORANGE' | 'PURPLE' | 'PINK' | 'BLACK' | 'WHITE' | 'GRAY' | 'BROWN' | 'CYAN' | 'MAGENTA' | 'LIME' | 'TEAL' | 'INDIGO' | 'VIOLET' | 'GOLD' | 'SILVER' | 'BEIGE'
;

Percentage returns number:
    PERCENTAGE | '100'
;

fragment QuotedFileName:
    '"' file=ID '"'
;

fragment QuotedContent:
    content=FreeTextInBrackets
;


hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

hidden terminal WS: /\s+/;
terminal TIME: /\d+((h\d+)?m\d+)?s/;

terminal HEX_COLOR: /#?([0-9a-f]{6}|[0-9a-f]{3})/;
terminal PERCENTAGE: /([0-9]{1,2})/;
terminal ID: /[a-zA-Z0-9\-_\\\/.]+/;
terminal INT returns number: /[0-9]+/;
terminal FreeTextInBrackets:
  '[' -> ']'
;

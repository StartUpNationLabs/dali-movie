grammar DaliMovie

entry Script:
    commands+=Command*;

Command:
    LoadCommand | PutCommand | AddSubtitleCommand | SaveCommand;

LoadCommand:
    'load' WS 'video' WS name=ID WS file=STRING (NEWLINE | WS)*;

PutCommand:
    'put' WS
    ( 
        'title' WS title=STRING WS ('for' WS duration=Duration)? 'with' WS 'black' WS 'background' WS 'named' WS name=STRING
    |
        videoRef=[Command:ID] WS 'from' start=Time 'to' end=Time WS 'named' WS name=STRING
    ) (NEWLINE | WS)*;

AddSubtitleCommand:
    'add' WS 'subtitle' WS text=STRING WS
    (
        'before' WS target=STRING WS 'for' WS duration=Duration WS |
        'starting' WS offset=Offset WS 
        ('after' WS ('end'|'start') WS target=STRING WS |
         'before' WS ('start'|'end') WS target=STRING WS) 
        'for' WS duration=Duration
    );

SaveCommand:
    'save' WS 'the' WS 'output' WS 'here' WS file=STRING (NEWLINE | WS)*;

Duration:
    value=NUMBER WS 'seconds' (NEWLINE | WS)*;

Time:
    time=TIME;

Offset:
    value=NUMBER WS 'seconds';

terminal ID: /[a-zA-Z_][a-zA-Z0-9_]*/;
terminal STRING: /"[^"]*"/;
terminal NUMBER: /[0-9]+/;
terminal TIME: /"[0-9][0-9]:[0-5][0-9]"/;
terminal WS: /\s/;
terminal NEWLINE: '\n' | '\r\n';

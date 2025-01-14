// Monarch syntax highlighting for the dali-movie language.
export default {
    keywords: [
        'BEIGE','BLACK','BLUE','BROWN','CYAN','GOLD','GRAY','GREEN','INDIGO','LIME','MAGENTA','ORANGE','PINK','PURPLE','RED','SILVER','TEAL','VIOLET','WHITE','YELLOW','add','after','at','audio','background','before','color','cut','end','ending','export','for','from','here','import','named','position','start','starting','text','to','video'
    ],
    operators: [
        ',','100'
    ],
    symbols: /,|100/,

    tokenizer: {
        initial: [
            { regex: /\d+((h\d+)?m\d+)?s/, action: {"token":"TIME"} },
            { regex: /[a-zA-Z0-9\-_]+/, action: { cases: { '@keywords': {"token":"keyword"}, '@default': {"token":"ID"} }} },
            { regex: /(("([\s\S]*?"))|('([\s\S]*?')))/, action: {"token":"FILENAME"} },
            { regex: /#?([0-9a-f]{6}|[0-9a-f]{3})/, action: { cases: { '@keywords': {"token":"keyword"}, '@default': {"token":"HEX_COLOR"} }} },
            { regex: /([0-9]{1,2})/, action: {"token":"PERCENTAGE"} },
            { regex: /[0-9]+/, action: {"token":"number"} },
            { regex: /(\[([\s\S]*?\]))/, action: {"token":"FreeTextInBrackets"} },
            { include: '@whitespace' },
            { regex: /@symbols/, action: { cases: { '@operators': {"token":"operator"}, '@default': {"token":""} }} },
        ],
        whitespace: [
            { regex: /\/\*/, action: {"token":"comment","next":"@comment"} },
            { regex: /\/\/[^\n\r]*/, action: {"token":"comment"} },
            { regex: /\s+/, action: {"token":"white"} },
        ],
        comment: [
            { regex: /[^/\*]+/, action: {"token":"comment"} },
            { regex: /\*\//, action: {"token":"comment","next":"@pop"} },
            { regex: /[/\*]/, action: {"token":"comment"} },
        ],
    }
};

// window.onload = function() {
//     var constraints = { audio: true };

//     navigator.mediaDevices.getUserMedia(constraints);
// }
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrase = [
    'tab',
    'open',
    'create',
    'why did you talk while I was talking',
    'she enjoys reading books and playing games',
    'where are you going',
    'have a great day',
    'she sells seashells on the seashore'
]

var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase + ';';
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.continuous = true;


//match_arrays
function match_arrays(arr_1, arr_2) {
    if (arr_1.length != arr_2.length) {
        return false;
    } //add code to check same word in one array
    for (var element in arr_1) {
        if (arr_2.indexOf(arr_1[element]) == -1) {
            return false;
        }
    }
    return true;

}
//main_functions
function create_new_tab() {
    var newURL = "chrome://newtab";
    chrome.tabs.create({ url: newURL });
}

//knowledge_base
var main_objects = { 'tab': ['tab'], 'go to': ['goto', 'switch to', 'open', 'show'] }

//k_s_m = keyword synonym mapping
var k_s_m = {
    'create': ['open', 'show'],
    'new': ['fresh', 'blank', 'empty'],
    'url': ['s']
}
var main_functions = {
    'create_new_tab': ['create', 'new', 'tab']
        // '2':['go to',]
}

//get function number
function find_function_number(syntax) {
    for (function_number in main_functions) {
        if (match_arrays(syntax, main_functions[function_number])) {
            // console.log("this" + function_number);
            window[function_number]();
        }
    }
}
function tab_functions(user_speech) {
    var syntax = ['tab'];
    for (var word in user_speech) {
        loop_for__all_keywords: for (var key in k_s_m) {
            if (key != user_speech[word]) {
                for (var synonym in k_s_m[key]) {
                    if (k_s_m[key][synonym] == user_speech[word]) {
                        syntax.push(key);
                        break loop_for__all_keywords;
                    }
                }
            } else {
                syntax.push(key);
                break;
            }
        }
    }
    // console.log(syntax);
    find_function_number(syntax);
}

recognition.start();

recognition.onresult = function(event) {
    var last = event.results.length - 1;
    var user_speech = event.results[last][0].transcript.toLowerCase();
    user_speech = user_speech.split(' ');
    if (~user_speech.indexOf("tab")) {
        tab_functions(user_speech);
    }
    // console.log('Result received: ' + user_speech + '.');
    // console.log(event);
}

// recognition.onspeechend = function() {
//     recognition.stop();
// }

var recognition = new webkitSpeechRecognition();
var preferences;
var username;
recognition.continuous = false;
recognition.interimResults = true;
let final_transcript = '';

recognition.onstart = function() {
    recognizing = true;
}

recognition.onresult = function(event) {
    let interim_transcript = '';

    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
    }
    final_transcript = capitalize(final_transcript);
    Username.value = linebreak(final_transcript);
};

recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        console.log("no speech");
        ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
        console.log("no microphone");
        ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          console.log("Speech blocked");
        } else {
          console.log("Speech denied");
        }
        ignore_onend = true;
    }
}

recognition.onend = function() {
    recognizing = false;
}

function startDictation() {
    final_transcript = '';
    recognition.start();
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

//color
//fonts
//alerts


function categories(){
    window.location.href = 'http://localhost:5500/categories.html';
}

function update_c_preferences(option){
    let new_preset = {
        font:"none",
        colorScheme:option,
        alerts:true
    }
    localStorage.setItem(localStorage.getItem('currentUser').toUpperCase(),JSON.stringify(new_preset));
    console.log(JSON.parse(localStorage.getItem(localStorage.getItem('currentUser').toUpperCase())));
    window.location.reload();
}

function alterPage(){
    let background;
    let foreground;
    preferences = JSON.parse(localStorage.getItem(localStorage.getItem('currentUser').toUpperCase()));
    console.log(preferences)
    if (preferences['colorScheme'] === 'cool-colours'){
        background = '#A4CAEE';
        foreground = 'black';
    }

    document.body.style.backgroundColor = background;
}

function selectColors(){
    window.location.href = 'http://localhost:5500/colour_pref.html';    
    alterPage();
 }


function login(){
    username = document.getElementById('Username').value;
    localStorage.setItem('currentUser',username);
    const info     = document.getElementById('info');
    preferences = JSON.parse(localStorage.getItem(username.toUpperCase()));
    console.log(preferences)
    //Quick authentication 
    if(username.toUpperCase() === 'BOB' || username.toUpperCase() === 'HARRY'){
        if(preferences !== null){
            window.location.href = 'http://localhost:5500/preferences_exist.html';            
        }
        else{
            selectColors(); 
        }
        info.style = 'color:green';
        info.innerText = 'Redirecting...';
    }
    else{
        info.style = 'color:red;';
        info.innerText = 'Wrong Username :(';
    }
}

//Alter the website to the users preferences on load 
window.addEventListener("load",alterPage());


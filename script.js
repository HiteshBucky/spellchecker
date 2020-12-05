function readData(files){	
    let file =  inputfile.files[0];	
    let reader = new FileReader();	
    reader.readAsText(file);	
    reader.onload = async function(){	
        filecontent.innerHTML = await reader.result;
        getCheck(reader.result);	
    }
}

let spell;
async function getCheck(data){
	// console.log(data)
    let url = "https://api.textgears.com/grammar?key=wF4nKAm0SzmgBeEd&text="+data;
    let response = await fetch(url);
    if(response.ok){
        spell = await response.json();
        // console.log(spell)
        // console.log(spell.response.errors);
        // console.log(filecontent.value)
        for(let item of spell.response.errors){
            // console.log(item.bad);
            highlight(item.bad);
        }
    }
}

function highlight(text) {
  var inputText = document.getElementById("filecontent").innerHTML

  var index = inputText.indexOf(text);

  if (index >= 0) { 
   inputText = inputText.substring(0,index) + "<span class='highlight'>" + inputText.substring(index,index+text.length) + "</span>" + inputText.substring(index + text.length);
   document.getElementById("filecontent").innerHTML = inputText;
  }
}






document.oncontextmenu = rightClick;
document.onclick = hideMenu;

function hideMenu() { 
    document.getElementById("contextMenu").style.display = "none";
}

function rightClick(e) { 
    e.preventDefault(); 

    console.log(e)

    if(e.path.length == 7) return;

    var wrongWord = e.path[0].innerHTML

    var errorWords = spell.response.errors;


    var list = document.createElement("ul");
    for(let i = 0; i<errorWords.length; i++){
    	if(errorWords[i].bad == wrongWord) {
    		
    		const parent = document.getElementById('contextMenu')
			while (parent.firstChild) {
			    parent.firstChild.remove()
			}

    		for(let j = 0; j < errorWords[i].better.length; j++ ){
    			var li = document.createElement("li");
    			li.innerText = errorWords[i].better[j];
    			li.addEventListener('click', (ev) => {
    				e.path[0].innerHTML = ev.path[0].innerHTML;
    				console.log(ev.path[0].innerHTML)
    			})
    			list.appendChild(li);
    		}
    		document.getElementById('contextMenu').appendChild(list);
    		console.log(document.getElementById('contextMenu'))
    	}
    }

    if (document.getElementById("contextMenu").style.display == "block") 
        hideMenu(); 
    else { 
        var menu = document.getElementById("contextMenu") 
              
        menu.style.display = 'block'; 
        menu.position = "absolute";
        menu.style.left = e.clientX + "px"; 
        menu.style.top = e.clientY + "px"; 
    } 
}
